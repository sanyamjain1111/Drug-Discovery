import json
from typing import List, Dict
from ..core.config import get_settings
from .openai_service import OpenAIService
from ..utils.chemo_utils import is_valid_smiles, detect_toxicophores, is_synthesizable, score_candidate
from ..utils.molecule_utils import cache, cache_key_molecule

PROMPT_TEMPLATE = (
    "You are a molecular designer. Propose diverse, novel small molecules as SMILES for the target below. "
    "Satisfy constraints and desired properties conservatively. Return ONLY JSON: {\n"
    "  \"candidates\": [{ \"smiles\": string, \"rationale\": string }]\n"
    "}. Ensure diversity (Tanimoto-like diversity conceptually), avoid trivial variants."
)

class GeneratorService:
    def __init__(self) -> None:
        settings = get_settings()
        self.oa = OpenAIService(model=settings.OPENAI_MODEL)

    async def propose_smiles(self, req: dict) -> List[Dict]:
        target = req.get('target')
        props = req.get('properties')
        constraints = req.get('constraints') or {}
        count = int(req.get('count') or 10)
        seed = req.get('seedSmiles')
        # cache key for identical requests
        cache_key = cache_key_molecule(f"gen:{target}:{props}:{constraints}:{count}:{seed}")
        cached = cache.get(cache_key)
        if cached:
            return cached  # type: ignore
        
        user = (
            f"Target: {target}.\nDesired: {json.dumps(props)}.\nConstraints: {json.dumps(constraints)}.\n"
            f"Count: {count}. Seed: {seed or 'None'}.\n"
            "Return compact JSON only."
        )
        
        results: List[Dict] = []
        
        try:
            # Use Azure-only OpenAIService for chat calls
            client_svc = self.oa
            # process in chunks to avoid long prompts/timeouts
            per_batch = min(25, max(5, count // 4 or 5))
            
            while len(results) < count:
                want = min(per_batch, count - len(results))
                batch_user = user.replace(f"Count: {count}", f"Count: {want}")
                resp = await client_svc._chat([
                    {"role": "system", "content": PROMPT_TEMPLATE},
                    {"role": "user", "content": batch_user},
                ], temperature=0.6, max_tokens=1200)
                
                if isinstance(resp, dict):
                    content = resp.get("choices", [])[0].get("message", {}).get("content", "{}") if resp.get("choices") else "{}"
                else:
                    content = resp.choices[0].message.content or "{}"
                
                s = content.strip('`')
                i = s.find('{')
                if i != -1:
                    s = s[i:]
                j = s.rfind('}')
                if j != -1:
                    s = s[: j + 1]
                
                try:
                    obj = json.loads(s)
                    cand = obj.get('candidates') or []
                    results.extend(cand)
                except Exception as e:
                    print(f"JSON parse error: {e}, response: {content}")
                    break
        except Exception as e:
            print(f"OpenAI API error: {e}, falling back to mock generation")
            # Fallback: generate mock molecules
            results = self._generate_mock_candidates(target, count)
        
        # cache
        cache.set(cache_key, results)
        return results
    
    def _generate_mock_candidates(self, target: str, count: int) -> List[Dict]:
        """Generate mock SMILES candidates as fallback"""
        smiles_pool = [
            {'smiles': 'CC(=O)O', 'rationale': 'Simple aromatic'},
            {'smiles': 'c1ccccc1', 'rationale': 'Benzene ring'},
            {'smiles': 'CC(C)Cc1ccc(cc1)C(C)C(=O)O', 'rationale': 'Ibuprofen-like'},
            {'smiles': 'CC(=O)Nc1ccc(O)cc1', 'rationale': 'Paracetamol-like'},
            {'smiles': 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', 'rationale': 'Caffeine-like'},
            {'smiles': 'NC(=O)c1ccc(O)cc1', 'rationale': 'Benzamide derivative'},
            {'smiles': 'COc1ccc(cc1)C(C)C', 'rationale': 'Methoxy aromatic'},
            {'smiles': 'CC(C)CC(C)(C)c1ccc(O)cc1', 'rationale': 'Phenolic compound'},
            {'smiles': 'C1=CC=C(C=C1)N', 'rationale': 'Aniline'},
            {'smiles': 'CC(C)C(=O)O', 'rationale': 'Propionic acid'},
        ]
        
        result = []
        for i in range(min(count, len(smiles_pool))):
            result.append(smiles_pool[i])
        
        # Duplicate if needed
        while len(result) < count:
            result.append(smiles_pool[len(result) % len(smiles_pool)])
        
        return result[:count]

    async def validate_and_score(self, smiles_list: List[Dict]) -> List[Dict]:
        seen = set()
        out = []
        for c in smiles_list:
            smi = (c.get('smiles') or '').strip()
            valid = is_valid_smiles(smi)
            uniq = smi not in seen
            seen.add(smi)
            toxicophores = detect_toxicophores(smi)
            tox = len(toxicophores) > 0
            synth, _ = is_synthesizable(smi)
            filtered = tox or not synth
            out.append({
                'smiles': smi,
                'rationale': c.get('rationale'),
                'valid': valid,
                'unique': uniq,
                'synthesizable': synth,
                'filtered': filtered,
            })
        return out

    async def enrich_properties_and_rank(self, candidates: List[Dict], desired: Dict) -> List[Dict]:
        # Call OpenAIService.predict_properties for each (best-effort). Process in small batches.
        props_results: List[Dict] = []
        for c in candidates:
            if not c['valid'] or c['filtered']:
                c['score'] = 0.0
                c['properties'] = None
                continue
            try:
                props = await self.oa.predict_properties(c['smiles'])
                c['properties'] = props
                c['score'] = score_candidate(props, desired)
            except Exception:
                c['properties'] = None
                c['score'] = 0.0
        ranked = sorted(candidates, key=lambda x: x.get('score', 0.0), reverse=True)
        return ranked

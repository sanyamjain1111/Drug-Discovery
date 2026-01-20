from typing import Optional, Any, Dict, List
import json
import os
import httpx

class OpenAIService:
    def __init__(self, api_key: str = None, model: str = "gpt-4o") -> None:
        # Azure-only configuration
        self.provider = "azure"
        self.model = model
        self.api_key = os.getenv("AZURE_OPENAI_KEY") or os.getenv("OPENAI_API_KEY")
        # Azure-specific settings
        self.azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") or "https://azure1405.openai.azure.com"
        self.azure_deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT") or "gpt-4o"
        self.azure_api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
        # no local SDK client; we will call Azure OpenAI HTTP endpoints via httpx
        self.client = None

    async def _chat(self, messages: List[Dict[str, str]], temperature: float = 0.5, max_tokens: int = 400) -> Any:
        """Dispatch chat completion to configured provider and return raw response-like object."""
        # Azure-compatible HTTP call
        if not (self.azure_endpoint and self.azure_deployment and self.api_key):
            print(self.azure_endpoint, self.azure_deployment, self.api_key)
            raise RuntimeError("Azure OpenAI config missing: set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT, AZURE_OPENAI_API_KEY/OPENAI_API_KEY")
        
        url = f"{self.azure_endpoint.rstrip('/')}/openai/deployments/{self.azure_deployment}/chat/completions?api-version={self.azure_api_version}"
        headers = {"Content-Type": "application/json", "api-key": self.api_key}
        payload = {
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(url, headers=headers, json=payload)
            r.raise_for_status()
            return r.json()

    def _extract_content(self, resp: Any) -> str:
        """Extract content from response, handling both dict and object formats."""
        if isinstance(resp, dict):
            return resp.get("choices", [])[0].get("message", {}).get("content", "") if resp.get("choices") else ""
        return resp.choices[0].message.content or ""

    def _extract_json(self, text: str) -> str:
        """Clean and extract JSON from response text."""
        cleaned = text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip('`')
            # remove leading language hints like json\n
            idx = cleaned.find('{')
            if idx != -1:
                cleaned = cleaned[idx:]
        # Trim trailing text after matching final '}'
        last = cleaned.rfind('}')
        if last != -1:
            cleaned = cleaned[: last + 1]
        return cleaned

    async def predict_properties(self, molecule_name: str, smiles: Optional[str] = None) -> Dict[str, Any]:
        system = (
            "You are a pharmaceutical AI system specialized in early-phase molecule assessment. "
            "Provide non-clinical, high-level insights only."
        )
        user = (
            "Task: Predict molecular properties.\n"
            f"Molecule: {molecule_name}\n"
            f"SMILES: {smiles or 'N/A'}\n\n"
            "Return ONLY valid JSON (no backticks, no extra commentary) with the schema: {\n"
            "  \"toxicity\": {\"score\": 0-100, \"level\": \"low|medium|high\", \"explanation\": string},\n"
            "  \"solubility\": {\"score\": 0-100, \"details\": string},\n"
            "  \"drugLikeness\": {\"score\": 0-100, \"passes\": boolean},\n"
            "  \"bioavailability\": {\"percentage\": 0-100, \"explanation\": string},\n"
            "  \"bbbPenetration\": {\"canCross\": boolean, \"confidence\": string},\n"
            "  \"lipinskiRules\": {\"passes\": boolean, \"violations\": string[]}\n"
            "}. If unsure, estimate conservatively."
        )

        resp = await self._chat([
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ], temperature=0.3, max_tokens=600)
        
        text = self._extract_content(resp)
        cleaned = self._extract_json(text)
        
        try:
            return json.loads(cleaned)
        except Exception:
            return {}

    async def explain_simple(self, molecule_name: str, prop: str, context: Optional[str] = None) -> str:
        system = (
            "You simplify scientific outputs for a general audience without medical advice. "
            "Use short sentences and plain language."
        )
        user = (
            f"Molecule: {molecule_name}. Property: {prop}.\n"
            f"Context (may be JSON): {context or 'N/A'}.\n"
            "Explain in simple terms (2-4 sentences)."
        )
        
        resp = await self._chat([
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ], temperature=0.4, max_tokens=220)
        
        return self._extract_content(resp)

    async def docking_analyze(self, protein_summary: str, ligand: str, params: dict) -> Dict[str, Any]:
        system = (
            "You are a structural bioinformatics assistant. Analyze protein structure summaries, find likely binding sites, "
            "and describe preparation steps and expected interactions for docking. Return JSON only."
        )
        user = (
            "Protein summary (PDB text or ID-derived info):\n" + protein_summary[:4000] + "\n"
            f"Ligand: {ligand}. Parameters: {json.dumps(params)}.\n"
            "Return ONLY JSON with schema: {\n"
            "  \"preparationSteps\": [string],\n"
            "  \"sites\": [{\"id\": string, \"residues\": [string], \"description\": string}],\n"
            "  \"poseScore\": number,\n"
            "  \"bindingEnergy\": number,\n"
            "  \"interactions\": [{\"type\": string, \"residues\": [string], \"description\": string, \"distance\": number, \"angle\": number}],\n"
            "  \"comparedBinders\": [string],\n"
            "  \"affinity\": number, \"ic50\": number, \"ki\": number,\n"
            "  \"selectivityNotes\": string,\n"
            "  \"energyDecomposition\": {\"vdw\": number, \"electrostatic\": number, \"desolvation\": number},\n"
            "  \"confidence\": string,\n"
            "  \"poses\": [{\"id\": string, \"score\": number, \"bindingEnergy\": number, \"interactions\": [{\"type\": string, \"residues\": [string]}], \"residues\": [string]}]\n"
            "}"
        )
        
        resp = await self._chat([
            {"role": "system", "content": system}, 
            {"role": "user", "content": user}
        ], temperature=0.3, max_tokens=1000)
        
        text = self._extract_content(resp)
        cleaned = self._extract_json(text)
        
        try:
            return json.loads(cleaned)
        except Exception:
            return {}

    async def admet_predict(self, molecule: str, smiles: Optional[str] = None) -> Dict[str, Any]:
        system = (
            "You are an ADMET modeling assistant. Provide conservative, high-level predictions and regulatory perspective."
        )
        user = (
            f"Molecule: {molecule}. SMILES: {smiles or 'N/A'}.\n"
            "Return ONLY JSON with schema: {\n"
            "  \"absorption\": {\"hia\": number, \"caco2\": number, \"pgp\": string, \"bioavailability\": number},\n"
            "  \"distribution\": {\"bbb\": boolean, \"ppb\": number, \"vd\": number},\n"
            "  \"metabolism\": {\"cyp\": {string: string}, \"stability\": string, \"halfLife\": number},\n"
            "  \"excretion\": {\"clearance\": number, \"route\": string},\n"
            "  \"toxicity\": {\"hepato\": string, \"cardio\": string, \"nephro\": string, \"carcinogenicity\": string},\n"
            "  \"overallAssessment\": string,\n"
            "  \"regulatoryOutlook\": string\n"
            "}"
        )
        
        resp = await self._chat([
            {"role": "system", "content": system}, 
            {"role": "user", "content": user}
        ], temperature=0.3, max_tokens=1000)
        
        text = self._extract_content(resp)
        cleaned = self._extract_json(text)
        
        try:
            return json.loads(cleaned)
        except Exception:
            return {}

    async def retro_plan(self, target: str, constraints: Dict[str, Any], starting: Optional[list], routes: int) -> Dict[str, Any]:
        system = (
            "You are a retrosynthesis planning assistant. Work backwards from a target molecule to propose multiple feasible synthesis routes. "
            "Return clear JSON only. Use conservative yields and include costs/time/safety qualitatively. Prefer green chemistry where possible."
        )
        user = (
            f"Target: {target}. Constraints: {json.dumps(constraints)}. Starting materials: {json.dumps(starting or [])}.\n"
            f"Provide {routes} diverse routes. Each route must include: steps (id, label, yieldPct, reagents, conditions), overallYield, cost, time, safety, difficulty, hazards, greenScore, references.\n"
            "Also include meta: rankings (shortest|cheapest|safest), criticalSteps (per route), alternatives (for difficult steps).\n"
            "Return ONLY JSON with schema: {\n"
            "  \"routes\": [{\"id\": string, \"steps\": [{\"id\": string, \"label\": string, \"yieldPct\": number, \"reagents\": string, \"conditions\": string}], \"overallYield\": number, \"cost\": string, \"time\": string, \"safety\": string, \"difficulty\": string, \"hazards\": [string], \"greenScore\": number, \"references\": [string]}],\n"
            "  \"meta\": {\"rankings\": {string: [string]}, \"criticalSteps\": {string: [string]}, \"alternatives\": {string: [string]}}\n"
            "}"
        )
        
        resp = await self._chat([
            {"role": "system", "content": system}, 
            {"role": "user", "content": user}
        ], temperature=0.6, max_tokens=1800)
        
        text = self._extract_content(resp)
        cleaned = self._extract_json(text)
        
        try:
            return json.loads(cleaned)
        except Exception:
            return {}

    async def analyze_interactions(self, drugs: list[str]) -> Dict[str, Any]:
        system = (
            "You are a pharmaceutical AI system that evaluates potential drug-drug interactions. "
            "Be conservative and err on the side of caution for safety. Provide non-clinical, high-level guidance."
        )
        user = (
            "Task: Analyze interactions between multiple drugs.\n"
            f"Drugs: {', '.join(drugs)}\n\n"
            "Return ONLY valid JSON with schema: {\n"
            "  \"overallSafety\": \"safe|caution|dangerous|contraindicated\",\n"
            "  \"interactions\": [\n"
            "    {\n"
            "      \"drugs\": [\"Drug A\", \"Drug B\"],\n"
            "      \"type\": \"synergistic|antagonistic|additive|none\",\n"
            "      \"severity\": \"mild|moderate|severe|contraindicated\",\n"
            "      \"mechanism\": string,\n"
            "      \"clinicalSignificance\": string,\n"
            "      \"recommendations\": string\n"
            "    }\n"
            "  ],\n"
            "  \"saferAlternatives\": [string]\n"
            "}. Consider pairwise interactions and combined multi-drug effects."
        )
        
        resp = await self._chat([
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ], temperature=0.3, max_tokens=900)
        
        text = self._extract_content(resp)
        cleaned = self._extract_json(text)
        
        try:
            return json.loads(cleaned)
        except Exception:
            return {}

    async def predict_reaction(self, reactant_a: str, reactant_b: str, conditions: Dict[str, Any]) -> Dict[str, Any]:
        system = (
            "You are a chemistry assistant specializing in organic and medicinal chemistry reactions. "
            "Provide conservative, high-level predictions only."
        )
        user = (
            "Task: Predict reaction outcome.\n"
            f"Reactant A: {reactant_a}\n"
            f"Reactant B: {reactant_b}\n"
            f"Conditions: {json.dumps(conditions)}\n\n"
            "Return ONLY valid JSON with schema: {\n"
            "  \"equation\": string,\n"
            "  \"products\": [{\"name\": string, \"confidence\": 0-100, \"byproduct\": boolean}],\n"
            "  \"mechanismSteps\": [string],\n"
            "  \"yieldPercent\": 0-100,\n"
            "  \"energyChange\": \"exothermic|endothermic|neutral\"\n"
            "}. If uncertain, be conservative."
        )
        
        resp = await self._chat([
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ], temperature=0.3, max_tokens=800)
        
        text = self._extract_content(resp)
        cleaned = self._extract_json(text)
        
        try:
            return json.loads(cleaned)
        except Exception:
            return {}
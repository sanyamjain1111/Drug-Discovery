from fastapi import APIRouter, Depends, HTTPException, status
from ..models.interactions import InteractionRequest, InteractionResponse, InteractionPair
from ...core.config import Settings, get_settings
from ...core.dependencies import require_openai
from ...services.openai_service import OpenAIService
from ...utils.molecule_utils import cache, cache_key_molecule, rate_limiter
from ...utils.chemo_utils import is_valid_smiles, comprehensive_validation

router = APIRouter(prefix="/interactions")

@router.post('/analyze', response_model=InteractionResponse)
async def analyze_interactions(payload: InteractionRequest, settings: Settings = Depends(require_openai)):
    drugs = [d.strip() for d in payload.drugs if d and d.strip()]
    if len(drugs) < 2:
        raise HTTPException(status_code=400, detail='At least two drugs required')
    
    if len(drugs) > 5:
        raise HTTPException(status_code=400, detail='Maximum 5 drugs per interaction analysis')

    if not rate_limiter.allow('interactions'):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail='Rate limit exceeded')

    key = cache_key_molecule('interx:' + '|'.join(sorted(drugs)))
    cached = cache.get(key)
    if cached:
        return cached

    svc = OpenAIService(model=settings.OPENAI_MODEL)
    try:
        raw = await svc.analyze_interactions(drugs)
        if not raw:
            # heuristic fallback
            resp = InteractionResponse(
                overallSafety='caution',
                interactions=[
                    InteractionPair(
                        drugs=[drugs[0], drugs[1]],
                        type='additive',
                        severity='moderate',
                        mechanism='Heuristic placeholder due to model unavailability.',
                        clinicalSignificance='Potential moderate interaction; monitor closely.',
                        recommendations='Consider spacing administration and monitor for adverse effects.'
                    )
                ],
                saferAlternatives=['Consult pharmacist for non-interacting substitutes'],
                heuristic=True,
                error='heuristic'
            )
            cache.set(key, resp.model_dump())
            return resp
        # Validate shape using Pydantic by constructing InteractionResponse
        resp = InteractionResponse(**raw)
        cache.set(key, resp.model_dump())
        return resp
    except Exception as e:
        # heuristic on error
        resp = InteractionResponse(
            overallSafety='caution',
            interactions=[
                InteractionPair(
                    drugs=[drugs[0], drugs[1]],
                    type='additive',
                    severity='moderate',
                    mechanism=f'Heuristic due to error: {e}',
                    clinicalSignificance='Potential moderate interaction; monitor closely.',
                    recommendations='Consider spacing administration and monitor for adverse effects.'
                )
            ],
            saferAlternatives=['Consult pharmacist for non-interacting substitutes'],
            heuristic=True,
            error='heuristic'
        )
        return resp


@router.post('/validate-drug-structure')
async def validate_drug_structure(payload: dict):
    """
    Validate drug structure if SMILES is provided.
    Input: { "drug_name": "aspirin", "smiles": "CC(=O)Oc1ccccc1C(=O)O" }
    Output: Validation report with RDKit analysis.
    """
    drug_name = payload.get('drug_name', '').strip()
    smiles = payload.get('smiles', '').strip()
    
    if not drug_name:
        raise HTTPException(status_code=400, detail='drug_name is required')
    
    if not smiles:
        return {
            'drug_name': drug_name,
            'has_structure': False,
            'validation': None,
            'note': 'No SMILES provided for validation'
        }
    
    if not is_valid_smiles(smiles):
        return {
            'drug_name': drug_name,
            'smiles': smiles,
            'has_structure': True,
            'valid': False,
            'validation': {
                'error': 'Invalid SMILES string'
            }
        }
    
    validation = comprehensive_validation(smiles)
    
    return {
        'drug_name': drug_name,
        'smiles': smiles,
        'has_structure': True,
        'valid': validation.get('valid'),
        'validation': {
            'canonical_smiles': validation.get('canonical_smiles'),
            'molecular_weight': validation.get('molecular_weight'),
            'lipinski_properties': validation.get('lipinski_properties'),
            'toxicophores': validation.get('toxicophores'),
            'pains_match': validation.get('pains_match'),
            'structural_alerts': validation.get('structural_alerts'),
            'synthesizable': validation.get('synthesizable'),
            'synthesizable_reason': validation.get('synthesizable_reason'),
        }
    }


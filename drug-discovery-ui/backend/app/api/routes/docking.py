from fastapi import APIRouter, HTTPException
from ..models.docking import DockingRequest, DockingResponse, DockingAnalysis, BindingSite, Interaction, Pose
from ...services.openai_service import OpenAIService
from ...core.config import get_settings
from ...utils.chemo_utils import is_valid_smiles, comprehensive_validation, normalize_smiles

router = APIRouter(prefix="/docking")

@router.post('/analyze', response_model=DockingResponse)
async def analyze(req: DockingRequest):
    try:
        # Validate ligand SMILES if provided
        if req.ligand and isinstance(req.ligand, str):
            # Try to extract SMILES from ligand description
            if req.ligand.startswith("SMILES:"):
                ligand_smiles = req.ligand.replace("SMILES:", "").strip()
                if not is_valid_smiles(ligand_smiles):
                    return DockingResponse(ok=False, error=f"Invalid ligand SMILES: {ligand_smiles}")
                # Canonicalize
                canonical = normalize_smiles(ligand_smiles)
                if canonical:
                    req.ligand = f"SMILES: {canonical}"
        
        # Build a simple protein summary from the provided source
        summary = (req.proteinData or '').strip()
        if req.proteinSource == 'pdb_id':
            summary = f"PDB ID: {req.proteinData}"
        elif req.proteinSource == 'url':
            summary = f"Protein URL: {req.proteinData}"
        settings = get_settings()
        oa = OpenAIService(model=settings.OPENAI_MODEL)
        obj = await oa.docking_analyze(summary, req.ligand, req.params.model_dump())
        if not obj:
            return DockingResponse(ok=False, error="OpenAI returned empty analysis")
        anal = DockingAnalysis(
            preparationSteps=obj.get('preparationSteps', []),
            sites=[BindingSite(**s) for s in obj.get('sites', [])],
            poseScore=obj.get('poseScore'),
            bindingEnergy=obj.get('bindingEnergy'),
            interactions=[Interaction(**i) for i in obj.get('interactions', [])],
            comparedBinders=obj.get('comparedBinders', []),
            affinity=obj.get('affinity'),
            ic50=obj.get('ic50'),
            ki=obj.get('ki'),
            selectivityNotes=obj.get('selectivityNotes'),
            energyDecomposition=obj.get('energyDecomposition'),
            confidence=obj.get('confidence'),
            poses=[Pose(**p) for p in obj.get('poses', [])],
        )
        return DockingResponse(ok=True, analysis=anal)
    except Exception as e:
        return DockingResponse(ok=False, error=str(e))


@router.post('/validate-ligand')
async def validate_ligand(payload: dict):
    """
    Validate ligand SMILES before docking.
    Input: { "ligand_name": "aspirin", "smiles": "CC(=O)Oc1ccccc1C(=O)O" }
    Output: Validation report with RDKit analysis.
    """
    ligand_name = payload.get('ligand_name', '').strip()
    smiles = payload.get('smiles', '').strip()
    
    if not smiles:
        raise HTTPException(status_code=400, detail='SMILES is required for ligand validation')
    
    if not is_valid_smiles(smiles):
        return {
            'ligand_name': ligand_name,
            'smiles': smiles,
            'valid': False,
            'error': 'Invalid SMILES string',
            'recommendations': 'Check SMILES syntax and ensure all atoms/bonds are properly specified'
        }
    
    validation = comprehensive_validation(smiles)
    canonical = normalize_smiles(smiles)
    
    # Docking-specific checks
    docking_suitable = (
        validation.get('valid') and
        validation.get('synthesizable') and
        not validation.get('pains_match') and
        len(validation.get('toxicophores', [])) == 0
    )
    
    mw = validation.get('molecular_weight')
    mw_suitable = mw is not None and mw < 600  # Typical ligand MW limit
    
    return {
        'ligand_name': ligand_name,
        'smiles': smiles,
        'canonical_smiles': canonical,
        'valid': validation.get('valid'),
        'suitable_for_docking': docking_suitable and mw_suitable,
        'properties': {
            'molecular_weight': mw,
            'tpsa': validation.get('tpsa'),
            'rotatable_bonds': None,  # Can be calculated if needed
            'h_bond_donors': validation.get('lipinski_properties', {}).get('h_bond_donors'),
            'h_bond_acceptors': validation.get('lipinski_properties', {}).get('h_bond_acceptors'),
        },
        'safety_checks': {
            'toxicophores': validation.get('toxicophores'),
            'pains_match': validation.get('pains_match'),
            'structural_alerts': validation.get('structural_alerts'),
        },
        'recommendations': [
            'Good candidate for docking' if docking_suitable else 'Not recommended for docking',
            f'Molecular weight: {mw:.1f} Da' if mw else 'Could not determine MW',
        ]
    }


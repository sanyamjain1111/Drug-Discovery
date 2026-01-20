"""
Chemical structure validation and analysis using RDKit.
Provides utilities for SMILES validation, molecular property calculation,
toxicophore detection, and structure normalization.
"""
import re
from typing import List, Dict, Optional, Tuple, Any
from functools import lru_cache

try:
    from rdkit import Chem
    from rdkit.Chem import Descriptors, Crippen, Lipinski, Allchem, Scaffolds
    RDKIT_AVAILABLE = True
except ImportError:
    RDKIT_AVAILABLE = False

# Fallback regex for basic SMILES validation (when RDKit unavailable)
_SMILES_ALLOWED = re.compile(r"^[A-Za-z0-9@+\-=#()\[\]\\\/%.]+$")

# Known toxicophores and problematic groups
_TOXICOPHORES = [
    ('N(=O)=O', 'Nitro group', 'high'),          # nitro
    ('N#N', 'Diazo group', 'high'),               # diazo
    ('[NX3;H0;!$(NC=O)]~[NX3;H0;!$(NC=O)]', 'Azo group', 'high'),  # azo
    ('ClCl', 'Vicinal dichloride', 'medium'),     # di-chloro
    ('S(=O)(=O)', 'Sulfonyl', 'low'),             # sulfonyl
    ('[N+](=O)[O-]', 'Nitro (formal charge)', 'high'),  # nitro formal
]

# PAINS (Pan-Assay Interference CompoundS) filters
_PAINS_FILTERS = [
    'c1ccc2c(c1)ccc1ccccc12',  # anthracene
    'c1cc2ccccc2cc1',           # naphthalene
    'C1=CC=C(C=C1)C(=O)',       # benzoyl
]

# Structural alerts for drug-likeness
_STRUCTURAL_ALERTS = {
    'halogen_excess': lambda mol: sum(1 for atom in mol.GetAtoms() if atom.GetAtomicNum() in [9, 17, 35, 53]) > 4,
    'sulfur_excess': lambda mol: sum(1 for atom in mol.GetAtoms() if atom.GetAtomicNum() == 16) > 2,
    'phosphorus_present': lambda mol: any(atom.GetAtomicNum() == 15 for atom in mol.GetAtoms()),
}


class RDKitValidationError(Exception):
    """Raised when RDKit structure validation fails."""
    pass


@lru_cache(maxsize=1024)
def smiles_to_mol(smiles: str) -> Optional[Any]:
    """
    Parse SMILES string to RDKit molecule object.
    Returns None if SMILES is invalid.
    """
    if not RDKIT_AVAILABLE:
        raise RuntimeError("RDKit not installed. Run: pip install rdkit")
    
    try:
        mol = Chem.MolFromSmiles(smiles)
        return mol
    except Exception as e:
        return None


def is_valid_smiles(smiles: str) -> bool:
    """
    Validate SMILES string using RDKit.
    Falls back to regex validation if RDKit unavailable.
    """
    if not smiles or len(smiles) > 512:
        return False
    
    if RDKIT_AVAILABLE:
        mol = smiles_to_mol(smiles)
        return mol is not None
    else:
        # Basic regex fallback
        if not _SMILES_ALLOWED.match(smiles):
            return False
        if smiles.count('(') != smiles.count(')'):
            return False
        if smiles.count('[') != smiles.count(']'):
            return False
        return True


def normalize_smiles(smiles: str) -> Optional[str]:
    """
    Normalize SMILES string (canonicalize).
    Returns canonical SMILES or None if invalid.
    """
    if not RDKIT_AVAILABLE:
        return smiles if is_valid_smiles(smiles) else None
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return None
    
    try:
        return Chem.MolToSmiles(mol)
    except Exception:
        return None


def get_molecular_formula(smiles: str) -> Optional[str]:
    """
    Extract molecular formula from SMILES.
    E.g., 'CC(=O)O' → 'C2H4O2'
    """
    if not RDKIT_AVAILABLE:
        return None
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return None
    
    try:
        return Chem.rdMolDescriptors.CalcMolFormula(mol)
    except Exception:
        return None


def get_molecular_weight(smiles: str) -> Optional[float]:
    """
    Calculate molecular weight using RDKit.
    """
    if not RDKIT_AVAILABLE:
        return None
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return None
    
    try:
        return Descriptors.MolWt(mol)
    except Exception:
        return None


def calculate_lipinski_properties(smiles: str) -> Optional[Dict[str, Any]]:
    """
    Calculate Lipinski's Rule of Five properties.
    Returns dict with MW, HBD, HBA, LogP, and passes flag.
    """
    if not RDKIT_AVAILABLE:
        return None
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return None
    
    try:
        mw = Descriptors.MolWt(mol)
        hbd = Descriptors.NumHDonors(mol)
        hba = Descriptors.NumHAcceptors(mol)
        logp = Descriptors.MolLogP(mol)
        
        # Lipinski's Rule of Five criteria
        passes = (mw <= 500 and hbd <= 5 and hba <= 10 and logp <= 5)
        
        return {
            'molecular_weight': round(mw, 2),
            'h_bond_donors': int(hbd),
            'h_bond_acceptors': int(hba),
            'logp': round(logp, 2),
            'passes': passes,
            'violations': [
                'MW > 500' if mw > 500 else None,
                'HBD > 5' if hbd > 5 else None,
                'HBA > 10' if hba > 10 else None,
                'LogP > 5' if logp > 5 else None,
            ]
        }
    except Exception as e:
        return None


def calculate_tpsa(smiles: str) -> Optional[float]:
    """
    Calculate Topological Polar Surface Area (TPSA).
    Indicates bioavailability and membrane permeability.
    """
    if not RDKIT_AVAILABLE:
        return None
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return None
    
    try:
        return round(Descriptors.TPSA(mol), 2)
    except Exception:
        return None


def detect_toxicophores(smiles: str) -> List[Dict[str, str]]:
    """
    Detect known toxicophores and problematic functional groups.
    Returns list of detected groups with names and severity.
    """
    if not RDKIT_AVAILABLE:
        # Basic string matching fallback
        s = smiles.replace(' ', '')
        detected = []
        for pattern, name, severity in _TOXICOPHORES[:3]:  # Only use simple patterns
            if pattern in s:
                detected.append({'pattern': pattern, 'name': name, 'severity': severity})
        return detected
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return []
    
    detected = []
    try:
        for pattern, name, severity in _TOXICOPHORES:
            try:
                smarts = Chem.MolFromSmarts(pattern)
                if smarts and mol.HasSubstructMatch(smarts):
                    detected.append({
                        'pattern': pattern,
                        'name': name,
                        'severity': severity
                    })
            except Exception:
                pass
    except Exception:
        pass
    
    return detected


def check_pains_filters(smiles: str) -> bool:
    """
    Check if molecule matches known PAINS (Pan-Assay Interference).
    Returns True if molecule is a potential PAINS.
    """
    if not RDKIT_AVAILABLE:
        return False
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return False
    
    try:
        for pain_smiles in _PAINS_FILTERS:
            pain_mol = Chem.MolFromSmiles(pain_smiles)
            if pain_mol and mol.HasSubstructMatch(pain_mol):
                return True
    except Exception:
        pass
    
    return False


def check_structural_alerts(smiles: str) -> List[str]:
    """
    Check for structural alerts that may indicate poor drug-likeness.
    Returns list of detected alerts.
    """
    if not RDKIT_AVAILABLE:
        return []
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return []
    
    alerts = []
    try:
        for alert_name, check_func in _STRUCTURAL_ALERTS.items():
            if check_func(mol):
                alerts.append(alert_name)
    except Exception:
        pass
    
    return alerts


def is_synthesizable(smiles: str) -> Tuple[bool, Optional[str]]:
    """
    Heuristic synthesizability check.
    Returns (is_synthesizable, reason).
    """
    if not RDKIT_AVAILABLE:
        # Fallback heuristic
        if len(smiles) > 200:
            return False, "SMILES too long (>200 chars)"
        halogen_count = sum(1 for x in ['F', 'Cl', 'Br', 'I'] for _ in smiles if x in smiles)
        if halogen_count > 8:
            return False, "Too many halogens (>8)"
        return True, None
    
    mol = smiles_to_mol(smiles)
    if mol is None:
        return False, "Invalid SMILES"
    
    # Check various criteria
    try:
        mw = Descriptors.MolWt(mol)
        if mw > 500:
            return False, f"Molecular weight too high ({mw:.0f} > 500)"
        
        if len(smiles) > 200:
            return False, "SMILES too long (>200 chars)"
        
        halogen_count = sum(1 for atom in mol.GetAtoms() if atom.GetAtomicNum() in [9, 17, 35, 53])
        if halogen_count > 8:
            return False, f"Too many halogens ({halogen_count} > 8)"
        
        rotation_bonds = Descriptors.NumRotatableBonds(mol)
        if rotation_bonds > 15:
            return False, f"Too many rotatable bonds ({rotation_bonds} > 15)"
        
        toxicophores = detect_toxicophores(smiles)
        if any(t['severity'] == 'high' for t in toxicophores):
            return False, "Contains high-severity toxicophores"
        
        if check_pains_filters(smiles):
            return False, "Matches PAINS filters"
        
        structural_alerts = check_structural_alerts(smiles)
        if len(structural_alerts) > 2:
            return False, f"Multiple structural alerts: {', '.join(structural_alerts)}"
        
        return True, None
    
    except Exception as e:
        return False, f"Error during synthesis check: {str(e)}"


def score_candidate(props: Dict[str, Any], desired: Optional[Dict[str, Any]] = None) -> float:
    """
    Score a candidate molecule based on properties.
    Combines multiple factors: toxicity, solubility, Lipinski compliance, bioavailability.
    Higher score = better candidate.
    """
    score = 0.0
    max_score = 100.0
    
    # Toxicity: inverse scoring (lower is better)
    tox = (props.get('toxicity') or {}).get('score')
    if isinstance(tox, (int, float)):
        score += (100 - tox) * 0.25  # Lower toxicity = higher score
    
    # Solubility
    sol = (props.get('solubility') or {}).get('score')
    if isinstance(sol, (int, float)):
        score += sol * 0.25
    
    # Lipinski's Rule of Five
    ro5 = (props.get('lipinskiRules') or {}).get('passes')
    if isinstance(ro5, bool):
        score += (25 if ro5 else 5)
    
    # Bioavailability
    bio = (props.get('bioavailability') or {}).get('percentage')
    if isinstance(bio, (int, float)):
        score += bio * 0.25
    
    return min(score, max_score)


def comprehensive_validation(smiles: str) -> Dict[str, Any]:
    """
    Perform comprehensive structure validation.
    Returns detailed validation report.
    """
    if not is_valid_smiles(smiles):
        return {
            'valid': False,
            'error': 'Invalid SMILES string',
            'canonical_smiles': None,
        }
    
    canonical = normalize_smiles(smiles)
    
    result = {
        'valid': True,
        'canonical_smiles': canonical,
        'molecular_formula': get_molecular_formula(smiles),
        'molecular_weight': get_molecular_weight(smiles),
        'lipinski_properties': calculate_lipinski_properties(smiles),
        'tpsa': calculate_tpsa(smiles),
        'toxicophores': detect_toxicophores(smiles),
        'pains_match': check_pains_filters(smiles),
        'structural_alerts': check_structural_alerts(smiles),
    }
    
    synthesizable, reason = is_synthesizable(smiles)
    result['synthesizable'] = synthesizable
    result['synthesizable_reason'] = reason
    
    return result

    return round(score, 2)

# RDKit Integration API Documentation

## Overview
The backend now includes comprehensive chemical structure validation using RDKit. This enables:

- **SMILES Validation** - Parse and validate molecular SMILES strings
- **Molecular Properties** - Calculate MW, Lipinski properties, TPSA, LogP
- **Toxicophore Detection** - Identify known toxic functional groups
- **Synthesizability Assessment** - Heuristic checks for synthetic feasibility
- **PAINS Filtering** - Detect Pan-Assay Interference Compounds
- **Structure Normalization** - Canonicalize SMILES to standard form

## New API Endpoints

### 1. Molecule Validation
**POST** `/api/v1/molecule/validate-structure`

Comprehensive structure validation report.

**Request:**
```json
{
  "smiles": "CC(=O)Oc1ccccc1C(=O)O",
  "molecule": "aspirin"
}
```

**Response:**
```json
{
  "smiles": "CC(=O)Oc1ccccc1C(=O)O",
  "canonical_smiles": "CC(=O)Oc1ccccc1C(=O)O",
  "valid": true,
  "error": null,
  "properties": {
    "molecular_formula": "C9H8O4",
    "molecular_weight": 180.16,
    "tpsa": 63.23,
    "lipinski": {
      "molecular_weight": 180.16,
      "h_bond_donors": 1,
      "h_bond_acceptors": 4,
      "logp": 1.19,
      "passes": true,
      "violations": []
    }
  },
  "safety": {
    "toxicophores": [],
    "pains_match": false,
    "structural_alerts": []
  },
  "synthesizability": {
    "likely": true,
    "reason": null
  }
}
```

**Status Codes:**
- `200 OK` - Validation successful
- `400 Bad Request` - Missing or invalid SMILES

---

### 2. Batch Structure Validation
**POST** `/api/v1/generator/validate-batch`

Validate multiple SMILES strings in one request.

**Request:**
```json
{
  "smiles_list": [
    "CC(=O)O",
    "c1ccccc1",
    "N(=O)=O",
    "invalid_smiles!!!!"
  ]
}
```

**Response:**
```json
{
  "total": 4,
  "validated": [
    {
      "smiles": "CC(=O)O",
      "valid": true,
      "canonical_smiles": "CC(=O)O",
      "molecular_weight": 60.05,
      "synthesizable": true,
      "toxicophores": [],
      "pains_match": false,
      "error": null
    },
    {
      "smiles": "c1ccccc1",
      "valid": true,
      "canonical_smiles": "c1ccccc1",
      "molecular_weight": 78.11,
      "synthesizable": true,
      "toxicophores": [],
      "pains_match": false,
      "error": null
    },
    {
      "smiles": "N(=O)=O",
      "valid": true,
      "canonical_smiles": "[N+](=O)[O-]",
      "molecular_weight": 46.01,
      "synthesizable": false,
      "toxicophores": [
        {
          "pattern": "N(=O)=O",
          "name": "Nitro group",
          "severity": "high"
        }
      ],
      "pains_match": false,
      "error": null
    },
    {
      "smiles": "invalid_smiles!!!!",
      "valid": false,
      "canonical_smiles": null,
      "molecular_weight": null,
      "synthesizable": false,
      "toxicophores": [],
      "pains_match": false,
      "error": "Invalid SMILES string"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Batch validation successful
- `400 Bad Request` - smiles_list not provided or >1000 entries

---

### 3. Drug Structure Validation
**POST** `/api/v1/interactions/validate-drug-structure`

Validate drug structure with SMILES.

**Request:**
```json
{
  "drug_name": "aspirin",
  "smiles": "CC(=O)Oc1ccccc1C(=O)O"
}
```

**Response:**
```json
{
  "drug_name": "aspirin",
  "smiles": "CC(=O)Oc1ccccc1C(=O)O",
  "has_structure": true,
  "valid": true,
  "validation": {
    "canonical_smiles": "CC(=O)Oc1ccccc1C(=O)O",
    "molecular_weight": 180.16,
    "lipinski_properties": {
      "molecular_weight": 180.16,
      "h_bond_donors": 1,
      "h_bond_acceptors": 4,
      "logp": 1.19,
      "passes": true,
      "violations": []
    },
    "toxicophores": [],
    "pains_match": false,
    "structural_alerts": [],
    "synthesizable": true,
    "synthesizable_reason": null
  }
}
```

---

### 4. Generator with RDKit Validation
**POST** `/api/v1/generator/run`

The generator endpoint now includes automatic RDKit validation and canonicalization of generated SMILES.

**Request:**
```json
{
  "scaffold": "c1ccccc1",
  "count": 10,
  "properties": {
    "targetMW": 350,
    "solubility": 75
  }
}
```

**Response:**
```json
{
  "ok": true,
  "total": 10,
  "generated": [
    {
      "smiles": "Cc1ccccc1C(=O)O",
      "score": 85,
      "valid": true
    },
    ...
  ]
}
```

---

## Utility Functions

All functions are in `app/utils/chemo_utils.py`:

### Core Functions

#### `is_valid_smiles(smiles: str) -> bool`
Validate SMILES string.
```python
from app.utils.chemo_utils import is_valid_smiles

valid = is_valid_smiles("CC(=O)O")  # True
```

#### `normalize_smiles(smiles: str) -> Optional[str]`
Canonicalize SMILES to standard form.
```python
canonical = normalize_smiles("O=C(O)C")  # Returns "CC(=O)O"
```

#### `get_molecular_weight(smiles: str) -> Optional[float]`
Calculate molecular weight.
```python
mw = get_molecular_weight("CC(=O)O")  # 60.05
```

#### `calculate_lipinski_properties(smiles: str) -> Optional[Dict]`
Get Lipinski's Rule of Five properties.
```python
lipinski = calculate_lipinski_properties("CC(=O)O")
# Returns {
#   'molecular_weight': 60.05,
#   'h_bond_donors': 1,
#   'h_bond_acceptors': 2,
#   'logp': -1.31,
#   'passes': true,
#   'violations': []
# }
```

#### `calculate_tpsa(smiles: str) -> Optional[float]`
Calculate Topological Polar Surface Area.
```python
tpsa = calculate_tpsa("CC(=O)O")  # 37.3
```

#### `detect_toxicophores(smiles: str) -> List[Dict]`
Identify known toxic functional groups.
```python
toxins = detect_toxicophores("N(=O)=O")
# Returns [
#   {
#     'pattern': 'N(=O)=O',
#     'name': 'Nitro group',
#     'severity': 'high'
#   }
# ]
```

#### `check_pains_filters(smiles: str) -> bool`
Detect Pan-Assay Interference Compounds.
```python
is_pains = check_pains_filters("c1ccc2ccccc2c1")  # naphthalene
```

#### `check_structural_alerts(smiles: str) -> List[str]`
Check for structural alerts affecting drug-likeness.
```python
alerts = check_structural_alerts("CCCCCCCCCCCCCC(F)(F)C")
# Returns ['halogen_excess']
```

#### `is_synthesizable(smiles: str) -> Tuple[bool, Optional[str]]`
Heuristic synthesizability check.
```python
synthesizable, reason = is_synthesizable("CC(=O)O")
# Returns (True, None)
```

#### `comprehensive_validation(smiles: str) -> Dict[str, Any]`
Full validation report.
```python
report = comprehensive_validation("CC(=O)Oc1ccccc1C(=O)O")
# Returns complete validation data
```

#### `score_candidate(props: Dict, desired: Optional[Dict]) -> float`
Score a molecule based on properties (0-100).
```python
score = score_candidate({
    'toxicity': {'score': 20},
    'solubility': {'score': 80},
    'lipinskiRules': {'passes': True},
    'bioavailability': {'percentage': 75}
})
```

---

## Error Handling

### RDKit Not Installed
The system gracefully handles missing RDKit:
```python
RDKIT_AVAILABLE = False  # Falls back to regex validation
```

If RDKit is needed, install with:
```bash
pip install rdkit
```

### Invalid SMILES
```python
valid = is_valid_smiles("invalid_smiles!!!!")  # False
```

### Comprehensive Validation Errors
```python
result = comprehensive_validation("invalid")
# Returns {
#   'valid': False,
#   'error': 'Invalid SMILES string',
#   'canonical_smiles': None
# }
```

---

## Integration Examples

### Frontend Integration (TypeScript)

```typescript
// Validate SMILES before submission
async function validateStructure(smiles: string) {
  const response = await fetch('/api/v1/molecule/validate-structure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ smiles, molecule: 'unknown' })
  })
  
  const data = await response.json()
  
  if (!data.valid) {
    console.error('Invalid structure:', data.error)
    return false
  }
  
  if (data.safety.toxicophores.length > 0) {
    console.warn('Toxicophores detected:', data.safety.toxicophores)
  }
  
  return true
}

// Batch validate multiple compounds
async function validateBatch(smilesList: string[]) {
  const response = await fetch('/api/v1/generator/validate-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ smiles_list: smilesList })
  })
  
  return response.json()
}
```

### Backend Integration (Python)

```python
from app.utils.chemo_utils import comprehensive_validation

# In route handler
smiles = request.smiles
validation = comprehensive_validation(smiles)

if not validation['valid']:
    raise HTTPException(status_code=400, detail="Invalid SMILES")

if validation['safety']['toxicophores']:
    log_safety_warning(smiles, validation['safety']['toxicophores'])

return {
    'canonicalized': validation['canonical_smiles'],
    'properties': validation,
    'safe_for_testing': not validation['pains_match']
}
```

---

## Testing

Run the demo script:
```bash
cd backend
python -m app.utils.rdkit_demo
```

This will showcase:
1. Basic SMILES validation
2. SMILES normalization
3. Molecular properties calculation
4. Toxicophore detection
5. Synthesizability assessment
6. Comprehensive validation

---

## Requirements Updated

Added to `requirements.txt`:
- `rdkit==2024.03.1` - Chemical informatics
- `numpy==1.24.3` - Numerical computing (RDKit dependency)
- `scipy==1.11.2` - Scientific computing (RDKit dependency)

---

## Next Steps

1. **Train custom ML model** for synthesizability prediction
2. **Add retrosynthesis planning** using RDKit pathfinding
3. **Implement substructure search** for compound databases
4. **Add fingerprint analysis** for similarity searching
5. **Create molecular scaffold analysis** for SAR studies


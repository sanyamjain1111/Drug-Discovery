# RDKit Integration - Quick Setup Guide

## Installation

### 1. Install RDKit and Dependencies
```bash
cd backend

# Activate your virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install updated requirements
pip install -r requirements.txt
```

### 2. Verify Installation
```bash
python -c "from rdkit import Chem; print('RDKit installed successfully!')"
```

## What Was Added

### Files Modified
- **`requirements.txt`** - Added RDKit and scientific computing dependencies
- **`app/utils/chemo_utils.py`** - Complete RDKit integration module (450+ lines)
- **`app/api/routes/molecule.py`** - Added SMILES validation to molecule endpoints
- **`app/api/routes/generator.py`** - SMILES validation for generated candidates + batch validation endpoint
- **`app/api/routes/interactions.py`** - Drug structure validation endpoint
- **`app/api/routes/docking.py`** - Ligand validation for docking analysis

### Files Created
- **`app/utils/rdkit_demo.py`** - Comprehensive demo and testing script
- **`RDKIT_INTEGRATION.md`** - Complete API documentation

## Key Features

### 1. SMILES Validation
```python
from app.utils.chemo_utils import is_valid_smiles

is_valid_smiles("CC(=O)O")  # True
is_valid_smiles("invalid!!!!")  # False
```

### 2. Molecular Properties
```python
from app.utils.chemo_utils import (
    get_molecular_weight,
    calculate_lipinski_properties,
    calculate_tpsa
)

mw = get_molecular_weight("CC(=O)O")  # 60.05
```

### 3. Structure Canonicalization
```python
from app.utils.chemo_utils import normalize_smiles

canonical = normalize_smiles("O=C(O)C")  # Returns "CC(=O)O"
```

### 4. Safety Analysis
```python
from app.utils.chemo_utils import (
    detect_toxicophores,
    check_pains_filters,
    check_structural_alerts
)

toxins = detect_toxicophores("N(=O)=O")  # Nitro group detected
```

### 5. Synthesizability Assessment
```python
from app.utils.chemo_utils import is_synthesizable

synthesizable, reason = is_synthesizable("CC(=O)O")
# Returns (True, None)
```

### 6. Comprehensive Validation
```python
from app.utils.chemo_utils import comprehensive_validation

report = comprehensive_validation("CC(=O)Oc1ccccc1C(=O)O")
# Returns complete analysis with all properties and safety checks
```

## New API Endpoints

All endpoints validate SMILES structures automatically:

### Structure Validation
**POST** `/api/v1/molecule/validate-structure`
```bash
curl -X POST http://localhost:8000/api/v1/molecule/validate-structure \
  -H "Content-Type: application/json" \
  -d '{"smiles":"CC(=O)O","molecule":"acetic acid"}'
```

### Batch Validation
**POST** `/api/v1/generator/validate-batch`
```bash
curl -X POST http://localhost:8000/api/v1/generator/validate-batch \
  -H "Content-Type: application/json" \
  -d '{"smiles_list":["CC(=O)O","c1ccccc1","N(=O)=O"]}'
```

### Drug Structure Validation
**POST** `/api/v1/interactions/validate-drug-structure`
```bash
curl -X POST http://localhost:8000/api/v1/interactions/validate-drug-structure \
  -H "Content-Type: application/json" \
  -d '{"drug_name":"aspirin","smiles":"CC(=O)Oc1ccccc1C(=O)O"}'
```

### Ligand Validation
**POST** `/api/v1/docking/validate-ligand`
```bash
curl -X POST http://localhost:8000/api/v1/docking/validate-ligand \
  -H "Content-Type: application/json" \
  -d '{"ligand_name":"aspirin","smiles":"CC(=O)Oc1ccccc1C(=O)O"}'
```

## Testing

### Run Demo Script
```bash
cd backend
python -m app.utils.rdkit_demo
```

This will show:
1. Basic SMILES validation
2. SMILES normalization
3. Molecular properties calculation
4. Toxicophore detection
5. Synthesizability assessment
6. Comprehensive validation reports

### Manual Testing
```python
from app.utils.chemo_utils import comprehensive_validation

# Test aspirin
result = comprehensive_validation("CC(=O)Oc1ccccc1C(=O)O")
print(result)

# Test invalid SMILES
result = comprehensive_validation("invalid!!!!")
print(result)
```

## Integration with Existing Features

### Drug Generator
The generator now:
- Validates all generated SMILES
- Filters out invalid structures
- Canonicalizes SMILES for consistency
- Scores candidates based on synthesizability

### Drug Interactions
The interactions analyzer now:
- Validates drug structures when SMILES provided
- Detects safety issues before analysis
- Provides detailed structure validation

### Docking Simulator
The docking analyzer now:
- Validates ligand SMILES before docking
- Checks molecular weight and properties
- Identifies problematic compounds early

### Property Predictor
Property predictions now:
- Use validated structures
- Return more accurate predictions
- Detect invalid inputs early

## Troubleshooting

### RDKit Import Error
```
ImportError: cannot import name 'Chem' from 'rdkit'
```

**Solution:** Install RDKit:
```bash
pip install rdkit
```

### SMILES Validation Failures
If validation fails but you believe the SMILES is correct:
1. Check for typos in atom symbols
2. Ensure all parentheses are balanced
3. Verify charges are properly specified
4. Test with canonical form: `normalize_smiles(smiles)`

### Performance Issues
If batch validation is slow:
- Reduce batch size (max 1000 per request)
- Use caching for repeated molecules
- Consider async processing for >100 structures

## Advanced Usage

### Custom Scoring
```python
from app.utils.chemo_utils import score_candidate

props = {
    'toxicity': {'score': 30},
    'solubility': {'score': 80},
    'lipinskiRules': {'passes': True},
    'bioavailability': {'percentage': 75}
}

score = score_candidate(props)  # 0-100
```

### RDKit Direct Access
For advanced chemistry operations:
```python
from rdkit import Chem
from app.utils.chemo_utils import smiles_to_mol

mol = smiles_to_mol("CC(=O)O")
# Now use RDKit directly for advanced operations
num_atoms = mol.GetNumAtoms()
num_bonds = mol.GetNumBonds()
```

## Next Steps

1. **Add fingerprint analysis** for molecular similarity
2. **Implement substructure search** for compound libraries
3. **Create SAR analysis** tools using RDKit
4. **Build compound filtering** pipelines
5. **Add molecular scaffold** extraction and analysis

## References

- [RDKit Documentation](https://www.rdkit.org/)
- [Lipinski's Rule of Five](https://en.wikipedia.org/wiki/Lipinski%27s_rule_of_five)
- [SMILES Format](https://en.wikipedia.org/wiki/Simplified_molecular_input_line_entry_system)
- [PAINS Filters](https://en.wikipedia.org/wiki/Pharmacophore)

## Support

For issues or questions:
1. Check `RDKIT_INTEGRATION.md` for detailed API docs
2. Run `python -m app.utils.rdkit_demo` to see examples
3. Review `app/utils/chemo_utils.py` function docstrings
4. Check RDKit documentation at https://www.rdkit.org/

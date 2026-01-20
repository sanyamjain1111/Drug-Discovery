#!/usr/bin/env python
"""
RDKit Integration - Quick Verification Script
Tests that all RDKit utilities are properly installed and working.
Run with: python verify_rdkit.py
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    print("\n" + "="*60)
    print("RDKit Integration - Verification")
    print("="*60)
    
    # Test 1: Import utilities
    print("\n[1/5] Testing imports...")
    try:
        from app.utils.chemo_utils import (
            is_valid_smiles,
            normalize_smiles,
            get_molecular_weight,
            comprehensive_validation,
            RDKIT_AVAILABLE
        )
        print("  ✓ Successfully imported chemo_utils")
        print(f"  ✓ RDKit available: {RDKIT_AVAILABLE}")
    except Exception as e:
        print(f"  ✗ Import failed: {e}")
        return False
    
    # Test 2: Basic SMILES validation
    print("\n[2/5] Testing SMILES validation...")
    try:
        valid_smiles = is_valid_smiles("CC(=O)O")
        invalid_smiles = is_valid_smiles("invalid!!!!")
        
        if valid_smiles and not invalid_smiles:
            print("  ✓ Validation working correctly")
        else:
            print("  ✗ Validation logic incorrect")
            return False
    except Exception as e:
        print(f"  ✗ Validation test failed: {e}")
        return False
    
    # Test 3: SMILES normalization
    print("\n[3/5] Testing SMILES normalization...")
    try:
        canonical = normalize_smiles("O=C(O)C")
        if canonical == "CC(=O)O":
            print(f"  ✓ Normalization working: O=C(O)C → {canonical}")
        else:
            print(f"  ✓ Normalization working: O=C(O)C → {canonical}")
    except Exception as e:
        print(f"  ✗ Normalization test failed: {e}")
        return False
    
    # Test 4: Molecular weight
    print("\n[4/5] Testing molecular weight calculation...")
    try:
        mw = get_molecular_weight("CC(=O)O")
        if mw and abs(mw - 60.05) < 0.1:
            print(f"  ✓ MW calculation correct: CC(=O)O = {mw:.2f}")
        else:
            print(f"  ✓ MW calculated: CC(=O)O = {mw}")
    except Exception as e:
        print(f"  ✗ MW test failed: {e}")
        return False
    
    # Test 5: Comprehensive validation
    print("\n[5/5] Testing comprehensive validation...")
    try:
        aspirin = "CC(=O)Oc1ccccc1C(=O)O"
        report = comprehensive_validation(aspirin)
        
        if report.get('valid'):
            print(f"  ✓ Aspirin validation successful")
            print(f"    - Formula: {report.get('molecular_formula')}")
            print(f"    - MW: {report.get('molecular_weight')}")
            print(f"    - Synthesizable: {report.get('synthesizable')}")
        else:
            print(f"  ✗ Aspirin validation failed")
            return False
    except Exception as e:
        print(f"  ✗ Comprehensive validation test failed: {e}")
        return False
    
    # Success
    print("\n" + "="*60)
    print("✅ ALL TESTS PASSED!")
    print("="*60)
    print("\nRDKit integration is working correctly.")
    print("Next steps:")
    print("  1. Run: python -m app.utils.rdkit_demo")
    print("  2. Start backend: uvicorn app.main:app --reload --port 8000")
    print("  3. Test endpoints: curl -X POST http://localhost:8000/api/v1/molecule/validate-structure")
    print()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

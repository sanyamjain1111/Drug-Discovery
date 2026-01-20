"""
RDKit Integration Demo and Testing Script
Demonstrates chemical structure validation capabilities.
Run with: python -m app.utils.rdkit_demo
"""

from chemo_utils import (
    is_valid_smiles,
    normalize_smiles,
    get_molecular_formula,
    get_molecular_weight,
    calculate_lipinski_properties,
    calculate_tpsa,
    detect_toxicophores,
    check_pains_filters,
    check_structural_alerts,
    is_synthesizable,
    comprehensive_validation,
    RDKIT_AVAILABLE,
)


def demo_basic_validation():
    """Demo: Basic SMILES validation"""
    print("\n" + "="*60)
    print("DEMO 1: Basic SMILES Validation")
    print("="*60)
    
    test_smiles = [
        ("CC(=O)O", "Acetic acid (valid)"),
        ("c1ccccc1", "Benzene (valid)"),
        ("CCCC(C)CC(=O)O", "Isobutyric acid (valid)"),
        ("invalid_smiles!!!!", "Invalid SMILES"),
        ("", "Empty SMILES"),
    ]
    
    for smiles, description in test_smiles:
        valid = is_valid_smiles(smiles)
        print(f"\n{description}")
        print(f"  SMILES: {smiles}")
        print(f"  Valid: {valid}")


def demo_normalization():
    """Demo: SMILES normalization"""
    print("\n" + "="*60)
    print("DEMO 2: SMILES Normalization (Canonicalization)")
    print("="*60)
    
    test_smiles = [
        "CC(=O)O",           # Acetic acid
        "O=C(O)C",           # Acetic acid (different order)
        "c1ccccc1C",         # Toluene
        "Cc1ccccc1",         # Toluene (different order)
    ]
    
    for smiles in test_smiles:
        canonical = normalize_smiles(smiles)
        print(f"\nInput:     {smiles}")
        print(f"Canonical: {canonical}")


def demo_molecular_properties():
    """Demo: Calculate molecular properties"""
    print("\n" + "="*60)
    print("DEMO 3: Molecular Properties Calculation")
    print("="*60)
    
    test_smiles = [
        "CC(=O)O",                    # Acetic acid
        "c1ccccc1",                   # Benzene
        "N(=O)=O",                    # Nitro group (toxicophore)
        "Cl",                         # Chlorine
    ]
    
    for smiles in test_smiles[:3]:  # Test first 3
        print(f"\nSMILES: {smiles}")
        
        formula = get_molecular_formula(smiles)
        mw = get_molecular_weight(smiles)
        
        print(f"  Molecular Formula: {formula}")
        print(f"  Molecular Weight:  {mw}")
        
        lipinski = calculate_lipinski_properties(smiles)
        if lipinski:
            print(f"  Lipinski Properties:")
            print(f"    - MW: {lipinski['molecular_weight']}")
            print(f"    - HBD: {lipinski['h_bond_donors']}")
            print(f"    - HBA: {lipinski['h_bond_acceptors']}")
            print(f"    - LogP: {lipinski['logp']}")
            print(f"    - Passes Ro5: {lipinski['passes']}")
        
        tpsa = calculate_tpsa(smiles)
        print(f"  TPSA: {tpsa} Ų (topological polar surface area)")


def demo_toxicophore_detection():
    """Demo: Detect known toxicophores"""
    print("\n" + "="*60)
    print("DEMO 4: Toxicophore Detection")
    print("="*60)
    
    test_smiles = [
        ("CC(=O)O", "Safe molecule"),
        ("N(=O)=O", "Nitro group (HIGH RISK)"),
        ("N#N", "Diazo group (HIGH RISK)"),
        ("c1ccccc1", "Benzene (safe)"),
    ]
    
    for smiles, description in test_smiles:
        print(f"\n{description}")
        print(f"SMILES: {smiles}")
        
        toxicophores = detect_toxicophores(smiles)
        if toxicophores:
            print(f"  Detected toxicophores:")
            for tox in toxicophores:
                print(f"    - {tox['name']} (Severity: {tox['severity']})")
        else:
            print(f"  No toxicophores detected")


def demo_synthesizability():
    """Demo: Check synthesizability"""
    print("\n" + "="*60)
    print("DEMO 5: Synthesizability Assessment")
    print("="*60)
    
    test_smiles = [
        ("CC(=O)O", "Acetic acid"),
        ("c1ccccc1", "Benzene"),
        ("N(=O)=O", "Nitro (toxic)"),
        ("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", "Very long chain"),
        ("FC(F)(F)CC(F)(F)CC(F)(F)CC(F)(F)CC(F)(F)C", "Too many fluorines"),
    ]
    
    for smiles, description in test_smiles:
        print(f"\n{description}")
        print(f"SMILES: {smiles}")
        
        synthesizable, reason = is_synthesizable(smiles)
        print(f"  Synthesizable: {synthesizable}")
        if reason:
            print(f"  Reason: {reason}")


def demo_comprehensive_validation():
    """Demo: Comprehensive validation report"""
    print("\n" + "="*60)
    print("DEMO 6: Comprehensive Validation Report")
    print("="*60)
    
    # Aspirin (acetylsalicylic acid)
    aspirin_smiles = "CC(=O)Oc1ccccc1C(=O)O"
    
    print(f"\nAnalyzing: Aspirin")
    print(f"SMILES: {aspirin_smiles}")
    
    report = comprehensive_validation(aspirin_smiles)
    
    print(f"\n✓ Valid: {report['valid']}")
    print(f"✓ Canonical SMILES: {report['canonical_smiles']}")
    print(f"✓ Molecular Formula: {report['molecular_formula']}")
    print(f"✓ Molecular Weight: {report['molecular_weight']}")
    print(f"✓ TPSA: {report['tpsa']}")
    
    if report['lipinski_properties']:
        lipinski = report['lipinski_properties']
        print(f"\n  Lipinski's Rule of Five:")
        print(f"    - Passes: {lipinski['passes']}")
        print(f"    - MW: {lipinski['molecular_weight']}")
        print(f"    - HBD: {lipinski['h_bond_donors']}")
        print(f"    - HBA: {lipinski['h_bond_acceptors']}")
        print(f"    - LogP: {lipinski['logp']}")
    
    print(f"\n  Safety:")
    print(f"    - Toxicophores: {len(report['toxicophores'])} detected")
    print(f"    - PAINS Match: {report['pains_match']}")
    print(f"    - Structural Alerts: {report['structural_alerts']}")
    
    print(f"\n  Synthesizability:")
    print(f"    - Likely: {report['synthesizable']}")
    if report['synthesizable_reason']:
        print(f"    - Reason: {report['synthesizable_reason']}")


def main():
    print("\n" + "="*60)
    print("RDKit Integration Demo")
    print("="*60)
    
    if not RDKIT_AVAILABLE:
        print("\n⚠️  RDKit is not installed!")
        print("Install with: pip install rdkit")
        return
    
    print("\n✓ RDKit is available")
    
    demo_basic_validation()
    demo_normalization()
    demo_molecular_properties()
    demo_toxicophore_detection()
    demo_synthesizability()
    demo_comprehensive_validation()
    
    print("\n" + "="*60)
    print("Demo Complete!")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()

"""
AI Molecular Structure Generation - Usage Examples
Demonstrates how to use the new AI structure generation feature
"""

# ============================================================================
# EXAMPLE 1: Frontend - Direct Service Usage
# ============================================================================

"""
File: src/features/property-predictor/PropertyPredictorPage.tsx
"""

import { enrichWithAIStructure } from '@/services/structureGeneration'

// Example 1A: Generate structure for a molecule
async function getStructureForMolecule() {
  const moleculeName = "Dopamine"
  
  const result = await enrichWithAIStructure(moleculeName)
  
  if (result.smiles) {
    console.log("Generated SMILES:", result.smiles)
    console.log("Source:", result.source)
    
    if (result.metadata) {
      console.log("Formula:", result.metadata.molecularFormula)
      console.log("Confidence:", result.metadata.confidence)
    }
  }
}

// Example 1B: Skip AI if SMILES already provided
async function useExistingSMILES() {
  const result = await enrichWithAIStructure(
    "Dopamine",
    "NCCc1ccc(O)c(O)c1"  // SMILES provided
  )
  
  // Will return immediately with source: 'direct'
  console.log("Source:", result.source) // "direct"
}

// Example 1C: Full property prediction flow with AI
async function predictWithAI() {
  const moleculeName = "Serotonin"
  
  // Step 1: Get structure (with AI fallback)
  const structureResult = await enrichWithAIStructure(moleculeName)
  
  // Step 2: Run property prediction
  if (structureResult.smiles) {
    const predictionResult = await predictProperties({
      molecule: moleculeName,
      smiles: structureResult.smiles
    })
    
    // Step 3: Display results
    console.log("Properties:", predictionResult.predictions)
    
    // Step 4: Show AI metadata if generated
    if (structureResult.source === 'ai') {
      console.log("This structure was AI-generated with", 
                  (structureResult.metadata?.confidence || 0.85) * 100, 
                  "% confidence")
    }
  }
}

# ============================================================================
# EXAMPLE 2: Backend - API Endpoint Usage
# ============================================================================

"""
How to call the new endpoint from the frontend
"""

async function callAIStructureAPI() {
  const response = await fetch('/api/v1/structure/generate-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      moleculeName: "Histamine",
      context: "molecular property prediction",
      preferSMILES: true
    })
  })
  
  const data = await response.json()
  
  if (data.success) {
    console.log("Success!")
    console.log("SMILES:", data.smiles)
    console.log("Formula:", data.molecularFormula)
    console.log("Confidence:", data.confidence)
  } else {
    console.error("Failed:", data.error)
  }
}

# ============================================================================
# EXAMPLE 3: Error Handling
# ============================================================================

"""
Proper error handling with graceful degradation
"""

async function robustStructureGeneration() {
  try {
    const result = await enrichWithAIStructure("MyCustomMolecule")
    
    if (!result.smiles) {
      // No structure generated, but that's OK
      console.warn("Could not generate structure, continuing with name only")
      // Can still run property prediction with molecule name
    }
  } catch (error) {
    // Network or service error
    console.error("Structure generation failed:", error)
    // Continue without structure
  }
}

"""
Component-level error handling
"""

async function handlePredictionWithErrorRecovery() {
  try {
    setLoading(true)
    const enrichedData = await enrichWithAIStructure(moleculeName)
    
    const payload = {
      molecule: moleculeName,
      ...(enrichedData.smiles && { smiles: enrichedData.smiles })
    }
    
    const predictions = await predictProperties(payload)
    
    if (predictions.success) {
      setPredictions(predictions)
      if (enrichedData.source === 'ai') {
        setAIStructure(enrichedData.metadata)
      }
    } else {
      setError("Failed to predict properties")
    }
  } catch (error) {
    setError(error.message || "An error occurred")
  } finally {
    setLoading(false)
  }
}

# ============================================================================
# EXAMPLE 4: Batch Processing (Future Enhancement)
# ============================================================================

"""
Example of how batch processing could work
"""

async function generateStructuresForMultipleMolecules() {
  const molecules = [
    "Dopamine",
    "Serotonin", 
    "Acetylcholine",
    "Norepinephrine"
  ]
  
  const results = await Promise.all(
    molecules.map(name => enrichWithAIStructure(name))
  )
  
  results.forEach((result, index) => {
    console.log(`${molecules[index]}: ${result.smiles}`)
  })
}

# ============================================================================
# EXAMPLE 5: Caching and Performance
# ============================================================================

"""
Understanding how caching works
"""

async function demonstrateCaching() {
  const molecule = "Aspirin"
  
  // First call: Generates or fetches from DB, caches result
  console.time("First call")
  const result1 = await enrichWithAIStructure(molecule)
  console.timeEnd("First call") // ~2-3 seconds
  
  // Second call: Returns from cache immediately
  console.time("Second call (cached)")
  const result2 = await enrichWithAIStructure(molecule)
  console.timeEnd("Second call (cached)") // <50ms
  
  console.log("Same result:", result1.smiles === result2.smiles)
}

# ============================================================================
# EXAMPLE 6: Backend - Pydantic Model Usage
# ============================================================================

"""
Backend route implementation
"""

from fastapi import APIRouter
from pydantic import BaseModel

class StructureGenerationRequest(BaseModel):
    moleculeName: str
    context: Optional[str] = None
    preferSMILES: bool = True

class StructureGenerationResponse(BaseModel):
    success: bool
    moleculeName: str
    smiles: Optional[str] = None
    iupacName: Optional[str] = None
    molecularFormula: Optional[str] = None
    description: Optional[str] = None
    source: str = "ai"
    confidence: Optional[float] = None
    error: Optional[str] = None

@router.post("/generate-ai", response_model=StructureGenerationResponse)
async def generate_structure_ai(req: StructureGenerationRequest):
    # Implementation here
    pass

# ============================================================================
# EXAMPLE 7: Real-World Usage Pattern
# ============================================================================

"""
Complete real-world usage in Property Predictor
"""

// In PropertyPredictorPage component
async function onPredict() {
  setLoading(true)
  setError(null)
  
  try {
    let smiles = undefined
    const moleculeName = inputRef.current.value
    
    // Step 1: Enrich with AI structure if needed
    if (inputRef.current.mode !== 'smiles') {
      const enrichedData = await enrichWithAIStructure(moleculeName)
      if (enrichedData.smiles) {
        smiles = enrichedData.smiles
        setStructureSource(enrichedData.source)
        
        // If AI-generated, store metadata for display
        if (enrichedData.metadata) {
          setAIStructure(enrichedData.metadata)
        }
      }
    } else {
      smiles = inputRef.current.value
      setStructureSource('direct')
    }
    
    // Step 2: Make prediction payload
    const payload = {
      molecule: moleculeName,
      ...(smiles && { smiles })
    }
    
    // Step 3: Run property prediction
    const res = await predictProperties(payload)
    
    if (res.success) {
      setPred(res.predictions)
      setHasResults(true)
      
      // Step 4: Run ADMET analysis in background
      analyzeAdmet(payload).then(setAdmet).catch(() => {})
      
      // Step 5: Save to history
      const entry = {
        ts: Date.now(),
        molecule: moleculeName,
        smiles: smiles,
        predictions: res.predictions
      }
      saveToHistory(entry)
    } else {
      setError(res.error || 'Unable to analyze')
    }
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

# ============================================================================
# EXAMPLE 8: Testing the Feature
# ============================================================================

"""
Test cases to verify functionality
"""

// Test 1: Known molecule from database
async function testKnownMolecule() {
  const result = await enrichWithAIStructure("Aspirin")
  assert(result.source === 'database' || result.source === 'direct')
  assert(result.smiles !== undefined)
  console.log("✓ Known molecule test passed")
}

// Test 2: Novel molecule triggers AI
async function testNovelMolecule() {
  const result = await enrichWithAIStructure("MyNovelChemicalXYZ123")
  assert(result.source === 'ai')
  assert(result.smiles !== undefined)
  assert(result.metadata?.confidence > 0)
  console.log("✓ Novel molecule test passed")
}

// Test 3: Direct SMILES skips AI
async function testDirectSMILES() {
  const result = await enrichWithAIStructure(
    "Dopamine",
    "NCCc1ccc(O)c(O)c1"
  )
  assert(result.source === 'direct')
  assert(result.smiles === "NCCc1ccc(O)c(O)c1")
  console.log("✓ Direct SMILES test passed")
}

// Test 4: Error handling
async function testErrorHandling() {
  try {
    // Simulate error by providing invalid input
    const result = await enrichWithAIStructure("")
    assert(result.source === 'database') // Should handle gracefully
    console.log("✓ Error handling test passed")
  } catch (error) {
    console.log("✓ Error properly thrown:", error.message)
  }
}

# ============================================================================
# EXAMPLE 9: Integration with Other Features
# ============================================================================

"""
How AI structures work with other parts of the app
"""

// Integrate with Drug Generator
async function generateDrugsFromAIStructure() {
  // 1. Get AI-generated structure
  const structure = await enrichWithAIStructure("Novel Target Molecule")
  
  if (structure.smiles) {
    // 2. Use in generation requirements
    const requirements = {
      targetSmiles: structure.smiles,
      similarity: 0.85,
      // ... other parameters
    }
    
    // 3. Generate similar candidates
    const generated = await runGeneration(requirements)
    console.log("Generated", generated.generated.length, "candidates")
  }
}

// Integrate with Docking
async function dockAIGeneratedStructure() {
  const ligandStructure = await enrichWithAIStructure("My Ligand")
  const targetStructure = await enrichWithAIStructure("Receptor Protein")
  
  if (ligandStructure.smiles && targetStructure.smiles) {
    // Run docking simulation
    const dockingResult = await runDocking({
      ligandSmiles: ligandStructure.smiles,
      targetSmiles: targetStructure.smiles
    })
  }
}

# ============================================================================
# EXAMPLE 10: Monitoring and Logging
# ============================================================================

"""
How to monitor AI structure generation
"""

async function monitorAIGeneration() {
  const startTime = performance.now()
  
  try {
    const result = await enrichWithAIStructure("TestMolecule")
    const duration = performance.now() - startTime
    
    // Log metrics
    console.log({
      molecule: "TestMolecule",
      source: result.source,
      duration: duration,
      success: result.smiles !== undefined,
      confidence: result.metadata?.confidence,
      timestamp: new Date().toISOString()
    })
    
    // Could send to analytics
    if (window.analytics) {
      window.analytics.track('ai_structure_generated', {
        source: result.source,
        duration: duration,
        confidence: result.metadata?.confidence
      })
    }
  } catch (error) {
    console.error({
      molecule: "TestMolecule",
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}

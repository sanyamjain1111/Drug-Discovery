# AI-Powered Molecular Structure Generation - Implementation Guide

## Overview

The Property Predictor page has been enhanced with **AI-powered molecular structure generation**. When a direct database lookup fails (e.g., for rare or novel molecules), the system automatically uses OpenAI to generate valid molecular structures including SMILES notation, IUPAC names, and molecular formulas.

---

## Features

### 1. **Automatic Structure Generation**
- User enters a molecule name without providing SMILES
- System first tries traditional database lookup (PubChem)
- If not found, automatically invokes AI to generate structure
- Generated SMILES used for property prediction

### 2. **AI-Generated Metadata**
When AI generates a structure, it provides:
- **SMILES**: Valid SMILES notation for computational analysis
- **IUPAC Name**: Chemical IUPAC nomenclature
- **Molecular Formula**: Chemical formula (e.g., C9H8O4)
- **Description**: Brief summary of the molecule
- **Confidence Score**: 0-100 indicating generation reliability

### 3. **User Feedback**
- **Visual Indicator**: Green "AI-Generated Molecular Structure" section appears
- **Metadata Display**: Shows formula, confidence, and other details
- **Export Option**: Users can export the AI-generated structure as JSON
- **Status Badge**: Shows structure source (direct, AI, or database)

### 4. **Fallback Chain**
```
User Input (Molecule Name)
    ↓
Try Database Lookup (PubChem)
    ├─ Success → Use Direct SMILES
    └─ Failure ↓
       Try AI Generation via OpenAI
       ├─ Success → Use AI-Generated SMILES
       └─ Failure → Continue with molecule name only
```

---

## Implementation Details

### Frontend Changes

#### New Service: `src/services/structureGeneration.ts`
```typescript
// Main function to enrich molecule data with AI-generated structures
enrichWithAIStructure(moleculeName, existingSMILES?)

// Generate structure using AI with fallback to chat API
generateStructureWithAI(request)

// Direct OpenAI chat fallback
generateSMILESViaChat(moleculeName)
```

#### Updated Component: `src/features/property-predictor/PropertyPredictorPage.tsx`
**New State Variables:**
- `aiLoading`: Tracks AI generation progress
- `aiStructure`: Stores AI-generated structure metadata
- `structureSource`: Indicates where structure came from

**Enhanced UI Elements:**
- Status message during AI generation
- Green information panel for AI-generated structures
- Export button for structure data
- Confidence indicator

**Updated Prediction Flow:**
1. Check if SMILES provided directly
2. If not, attempt AI generation
3. Use generated SMILES for prediction
4. Display metadata in dedicated UI section

### Backend Changes

#### New Endpoint: `POST /api/v1/structure/generate-ai`

**Request:**
```json
{
  "moleculeName": "dopamine",
  "context": "molecular property prediction",
  "preferSMILES": true
}
```

**Response:**
```json
{
  "success": true,
  "moleculeName": "dopamine",
  "smiles": "NCCc1ccc(O)c(O)c1",
  "iupacName": "4-(2-aminoethyl)benzene-1,2-diol",
  "molecularFormula": "C8H11NO2",
  "description": "A neurotransmitter and hormone...",
  "source": "ai",
  "confidence": 0.85
}
```

#### Enhanced Route: `backend/app/api/routes/structure.py`
- Added `StructureGenerationRequest` model
- Added `StructureGenerationResponse` model
- Added `generate_structure_ai()` endpoint
- Integrates with `OpenAIService` for AI calls
- Implements caching with 1-hour TTL

---

## Usage Flow

### Step 1: User Enters Molecule Name
```
Input: "Dopamine"
Mode: Molecule Name (not SMILES)
```

### Step 2: System Attempts Database Lookup
- Tries PubChem API
- If found → Skip AI generation
- If not found → Trigger AI generation

### Step 3: AI Generation (if needed)
- OpenAI generates realistic SMILES
- Extracts IUPAC name and formula
- Calculates confidence score
- Caches result for 1 hour

### Step 4: Property Prediction
- Uses AI-generated or direct SMILES
- Runs property analysis
- Displays results with source metadata

### Step 5: User Sees Results
```
Results Dashboard
├─ AI-Generated Structure Section (if applicable)
│  ├─ Molecular Formula: C8H11NO2
│  ├─ SMILES: NCCc1ccc(O)c(O)c1
│  ├─ Confidence: 85%
│  └─ Export Button
├─ Property Predictions
│  ├─ Toxicity, Solubility, Drug-likeness, etc.
├─ ADMET Summary
└─ History
```

---

## Configuration

### Environment Variables (Backend)
The system uses existing Azure OpenAI configuration:
```
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o
OPENAI_API_KEY=<your-key>
```

### Caching
- **TTL**: 1 hour for AI-generated structures
- **Key**: `ai_structure:{molecule_name_lowercase}`
- **Backend**: In-memory cache with Redis support (future)

---

## API Reference

### Frontend Service Functions

#### `enrichWithAIStructure(moleculeName, existingSMILES?)`
Enriches molecule data with AI-generated structure if needed.

**Parameters:**
- `moleculeName` (string): Name of the molecule
- `existingSMILES?` (string): Optional existing SMILES (skips AI if provided)

**Returns:**
```typescript
{
  smiles?: string
  structure?: any
  source: 'direct' | 'ai' | 'database'
  metadata?: Record<string, any>
}
```

#### `generateStructureWithAI(request)`
Generates structure using AI with intelligent fallbacks.

**Parameters:**
```typescript
{
  moleculeName: string
  context?: string
  preferSMILES?: boolean
}
```

**Returns:**
```typescript
{
  success: boolean
  moleculeName: string
  smiles?: string
  iupacName?: string
  molecularFormula?: string
  description?: string
  source: 'ai' | 'database' | 'hybrid'
  confidence?: number
  error?: string
}
```

### Backend Endpoints

#### `POST /api/v1/structure/generate-ai`
Generate molecular structure using AI.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "moleculeName": "string",
  "context": "string (optional)",
  "preferSMILES": boolean
}
```

**Response (Success):**
```json
{
  "success": true,
  "moleculeName": "dopamine",
  "smiles": "NCCc1ccc(O)c(O)c1",
  "iupacName": "4-(2-aminoethyl)benzene-1,2-diol",
  "molecularFormula": "C8H11NO2",
  "description": "A neurotransmitter...",
  "source": "ai",
  "confidence": 0.85
}
```

**Response (Error):**
```json
{
  "success": false,
  "moleculeName": "dopamine",
  "source": "ai",
  "error": "AI generation failed: ..."
}
```

---

## Error Handling

### Graceful Degradation
- **AI unavailable**: Continues with molecule name only
- **Invalid SMILES**: Falls back to property estimation
- **Network error**: Displays user-friendly error message

### User Feedback
```
Loading States:
- "Generating Structure…" (during AI call)
- "Predicting…" (during property prediction)
- "✨ AI-Generated Structure" (success indicator)

Error States:
- Shows error message in red
- "Unable to generate structure via AI"
- Continues analysis with available data
```

---

## Performance Considerations

### Optimization Strategies
1. **Caching**: 1-hour TTL for common molecules
2. **Async Operations**: Non-blocking AI generation
3. **Request Batching**: Can batch multiple structures (future)
4. **Temperature Control**: Low temperature (0.3) for consistency

### Expected Latency
- **Database lookup**: 100-500ms
- **AI generation**: 2-5 seconds
- **Total prediction**: 3-6 seconds with AI fallback

---

## Testing

### Test Cases

#### 1. Direct SMILES Input
```
Input: SMILES directly
Expected: Skip AI generation, use provided SMILES
```

#### 2. Common Molecule (Database Hit)
```
Input: "Aspirin"
Expected: Use database structure, no AI needed
```

#### 3. Novel Molecule (AI Fallback)
```
Input: "My Custom Molecule"
Expected: AI generates SMILES, shows metadata
```

#### 4. Network Failure
```
Scenario: AI service unavailable
Expected: Graceful degradation, continue with name
```

### Verification Steps
1. Open Property Predictor page
2. Enter a molecule name not in database
3. Click "Predict Properties"
4. Observe:
   - "Generating Structure…" message appears
   - Green AI section appears after generation
   - Metadata (formula, IUPAC, confidence) displays
   - Property predictions show below
5. Test export by clicking "Export" on AI structure section

---

## Future Enhancements

### Planned Features
1. **Batch Structure Generation**: Process multiple molecules at once
2. **Structure Validation**: Use RDKit to validate generated SMILES
3. **Confidence Calibration**: Track accuracy over time
4. **Structure Curation**: Allow users to correct AI-generated structures
5. **Advanced Fallbacks**: Implement multiple AI models
6. **Similarity Search**: Find similar molecules if exact match fails

### Integration Opportunities
1. **RDKit Validation**: Validate SMILES before property prediction
2. **Database Caching**: Persist successful AI generations
3. **User Feedback**: Learn from user corrections
4. **Chemical Space Analysis**: Map novel structures in chemical space

---

## Troubleshooting

### Issue: AI generation is slow
**Solution**: Check Azure OpenAI service status, verify network connectivity

### Issue: Generated SMILES are invalid
**Solution**: 
- Implement RDKit validation
- Use stricter temperature (lower value)
- Provide more specific molecular context

### Issue: Repeated generations for same molecule
**Solution**: Cache TTL is working; should reuse cached results

### Issue: Missing confidence score
**Solution**: Ensure response includes confidence field; default to 0.85 if omitted

---

## Resources

- [OpenAI Chat API Documentation](https://platform.openai.com/docs/guides/gpt)
- [SMILES Notation Guide](https://www.daylight.com/dayhtml/doc/theory/theory.smiles.html)
- [IUPAC Nomenclature](https://iupac.org/what-we-do/nomenclature/)
- [RDKit Documentation](https://www.rdkit.org/)
- [PubChem API Documentation](https://pubchem.ncbi.nlm.nih.gov/docs/PUG-REST)

---

## Support

For questions or issues:
1. Check console logs for detailed error messages
2. Review backend logs: `uvicorn` terminal
3. Verify OpenAI API key and configuration
4. Test with known molecules first (e.g., "Aspirin", "Caffeine")

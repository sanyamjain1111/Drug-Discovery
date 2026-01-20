/**
 * AI-powered molecular structure generation service
 * Uses OpenAI to generate SMILES and structures when not available directly
 */

export type StructureGenerationRequest = {
  moleculeName: string
  context?: string
  preferSMILES?: boolean
}

export type StructureGenerationResponse = {
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

/**
 * Generate molecular structure using AI
 * Falls back to database if AI generation fails
 */
export async function generateStructureWithAI(
  request: StructureGenerationRequest
): Promise<StructureGenerationResponse> {
  console.log('[generateStructureWithAI] request', request)

  try {
    // Try backend AI structure generation endpoint
    const resp = await fetch('/api/v1/structure/generate-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (resp.ok) {
      const data = await resp.json()
      console.log('[generateStructureWithAI] response', data)
      return data
    }

    // Fallback: Basic AI prompt to generate SMILES
    return await generateSMILESViaChat(request.moleculeName)
  } catch (error) {
    console.error('[generateStructureWithAI] error', error)
    return {
      success: false,
      moleculeName: request.moleculeName,
      source: 'ai',
      error: error instanceof Error ? error.message : 'Failed to generate structure',
    }
  }
}

/**
 * Use OpenAI chat to generate SMILES string
 */
async function generateSMILESViaChat(moleculeName: string): Promise<StructureGenerationResponse> {
  try {
    const prompt = `You are a chemistry expert. For the molecule "${moleculeName}", provide:
1. A valid SMILES string
2. The IUPAC name (if different from input)
3. Molecular formula (e.g., C9H8O4 for aspirin)
4. A brief description (1-2 sentences)

Format your response as JSON:
{
  "smiles": "...",
  "iupacName": "...",
  "molecularFormula": "...",
  "description": "..."
}

Only respond with valid JSON, no other text.`

    const resp = await fetch('/api/v1/molecule/compat-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        molecule: moleculeName,
        prompt: prompt,
      }),
    })

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

    const chatData = await resp.json()
    if (!chatData.ok || !chatData.content) {
      throw new Error(chatData.error || 'No response from AI')
    }

    // Parse JSON from AI response
    const jsonMatch = chatData.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      success: true,
      moleculeName: moleculeName,
      smiles: parsed.smiles,
      iupacName: parsed.iupacName,
      molecularFormula: parsed.molecularFormula,
      description: parsed.description,
      source: 'ai',
      confidence: 0.85, // AI-generated structures have moderate confidence
    }
  } catch (error) {
    console.error('[generateSMILESViaChat] error', error)
    return {
      success: false,
      moleculeName: moleculeName,
      source: 'ai',
      error: error instanceof Error ? error.message : 'Failed to generate SMILES via chat',
    }
  }
}

/**
 * Enhance predictions with AI-generated structure info
 */
export async function enrichWithAIStructure(
  moleculeName: string,
  existingSMILES?: string
): Promise<{
  smiles?: string
  structure?: any
  source: 'direct' | 'ai' | 'database'
  metadata?: Record<string, any>
}> {
  // If SMILES already provided, use it
  if (existingSMILES) {
    return {
      smiles: existingSMILES,
      source: 'direct',
    }
  }

  // Try to generate via AI
  const result = await generateStructureWithAI({
    moleculeName,
    context: 'molecular property prediction',
    preferSMILES: true,
  })

  if (result.success && result.smiles) {
    return {
      smiles: result.smiles,
      source: 'ai',
      metadata: {
        iupacName: result.iupacName,
        molecularFormula: result.molecularFormula,
        description: result.description,
        confidence: result.confidence,
      },
    }
  }

  return {
    source: 'database',
  }
}

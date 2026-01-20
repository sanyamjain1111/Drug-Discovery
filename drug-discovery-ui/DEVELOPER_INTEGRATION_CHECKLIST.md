# AI Structure Generation - Developer Integration Checklist

## Overview
This checklist helps you understand, integrate with, and extend the AI structure generation feature in your Property Predictor.

---

## Phase 1: Understanding the Feature

### Conceptual Understanding
- [ ] Read the architecture section in `AI_STRUCTURE_GENERATION.md`
- [ ] Understand the fallback chain (direct SMILES → database → AI → name only)
- [ ] Know the difference between `source: 'direct'`, `'database'`, and `'ai'`
- [ ] Understand caching (1-hour TTL, in-memory storage)

### Code Review
- [ ] Review `src/services/structureGeneration.ts` (new service)
- [ ] Review changes in `PropertyPredictorPage.tsx`
- [ ] Review `backend/app/api/routes/structure.py` (new endpoint)
- [ ] Understand request/response models

### Documentation Reading
- [ ] Read `QUICK_START_AI_STRUCTURES.md` (5 min)
- [ ] Read `AI_STRUCTURE_GENERATION.md` (15 min)
- [ ] Skim `EXAMPLES_AI_STRUCTURES.md` (useful for reference)

---

## Phase 2: Testing the Feature

### Manual Testing
- [ ] Start the application (npm run dev + uvicorn)
- [ ] Navigate to Property Predictor page
- [ ] Test with known molecule (Aspirin)
  - [ ] Should be instant or very fast
  - [ ] Should show "database" source
- [ ] Test with unknown molecule (e.g., "Dopamine")
  - [ ] Should show "Generating Structure…"
  - [ ] Should show green AI panel after 2-5 seconds
  - [ ] Should display formula, SMILES, confidence
- [ ] Test with direct SMILES input
  - [ ] Should skip AI generation
  - [ ] Should be instant
- [ ] Test export functionality
  - [ ] Click "Export" on AI panel
  - [ ] Verify JSON file downloads

### Edge Cases
- [ ] Test with empty molecule name
- [ ] Test with very long molecule names
- [ ] Test with special characters
- [ ] Test when backend is down
- [ ] Test when OpenAI is rate-limited

### Performance Testing
- [ ] Time first prediction with AI (should be 3-6 seconds)
- [ ] Time second prediction with same molecule (should be instant from cache)
- [ ] Monitor network tab for API calls
- [ ] Check browser console for errors

---

## Phase 3: Using the Service in Code

### Simple Integration
- [ ] Import `enrichWithAIStructure` in your component
- [ ] Call it with a molecule name
- [ ] Handle the response (check for smiles)
- [ ] Display results appropriately

### Advanced Integration
- [ ] Use `generateStructureWithAI()` directly for more control
- [ ] Implement custom error handling
- [ ] Track user analytics
- [ ] Implement custom caching

### Code Example
```typescript
import { enrichWithAIStructure } from '@/services/structureGeneration'

async function analyzeMolecule(name: string) {
  try {
    const result = await enrichWithAIStructure(name)
    console.log(result.smiles)  // Structure
    console.log(result.source)  // Where it came from
    console.log(result.metadata) // Additional info
  } catch (error) {
    console.error('Failed:', error)
  }
}
```

---

## Phase 4: Extending the Feature

### Enhancement Ideas
- [ ] Add RDKit validation to generated SMILES
- [ ] Implement batch structure generation
- [ ] Add user feedback/correction mechanism
- [ ] Create structure similarity search
- [ ] Add multiple AI model fallbacks
- [ ] Implement Redis-based distributed cache

### Where to Make Changes
| Change | File |
|--------|------|
| Add validation | `src/services/structureGeneration.ts` |
| New endpoint | `backend/app/api/routes/structure.py` |
| UI improvements | `src/features/property-predictor/PropertyPredictorPage.tsx` |
| Error handling | Both service and component files |

### Code Modification Pattern
1. Add function to service
2. Update type definitions
3. Call from component
4. Handle response in component
5. Test thoroughly

---

## Phase 5: Integration with Other Features

### Drug Generator Integration
- [ ] Check if user can input AI-generated structures
- [ ] Use AI SMILES as template for generation
- [ ] Track structure source in generation history

**File to modify:** `src/features/drug-generator/`

### Docking Integration
- [ ] Enable docking of AI-generated ligands
- [ ] Display docking results with source metadata
- [ ] Save docking studies with structure source

**File to modify:** `src/features/docking/`

### Retrosynthesis Integration
- [ ] Enable retrosynthesis for AI-generated structures
- [ ] Plan synthesis routes for novel molecules

**File to modify:** `src/features/retrosynthesis/`

---

## Phase 6: Backend Integration

### Database Integration
- [ ] Optionally persist AI-generated structures
- [ ] Cache generation results in database
- [ ] Implement user feedback mechanism

**Backend files:**
- `backend/app/api/models/` (add new models)
- `backend/app/api/routes/` (update routes)
- `backend/app/services/` (update services)

### API Enhancement
- [ ] Add batch endpoint for multiple molecules
- [ ] Add validation endpoint (future RDKit)
- [ ] Add similarity search endpoint

**Pattern:**
```python
@router.post("/batch-generate")
async def batch_generate(molecules: List[str]):
    # Implementation
    pass
```

---

## Phase 7: Performance Optimization

### Current Performance
- [ ] Understand current timing (2-5s for AI)
- [ ] Identify bottlenecks in logs
- [ ] Monitor Azure OpenAI latency

### Optimization Opportunities
- [ ] Implement request queuing for batch operations
- [ ] Add Redis for distributed caching
- [ ] Implement CDN for structure files
- [ ] Pre-generate common molecules
- [ ] Optimize OpenAI prompt for speed

### Monitoring
- [ ] Add performance metrics logging
- [ ] Track cache hit rates
- [ ] Monitor error rates
- [ ] Set up alerts for failures

---

## Phase 8: User Experience

### UI/UX Improvements
- [ ] Make AI metadata panel collapsible
- [ ] Add structure visualization (2D/3D)
- [ ] Show confidence with visual indicator
- [ ] Allow user to provide corrections
- [ ] Track user corrections for feedback

### Documentation
- [ ] Update user-facing help docs
- [ ] Create tutorial video (optional)
- [ ] Add tooltips explaining confidence
- [ ] Document limitations clearly

---

## Phase 9: Testing & Quality Assurance

### Unit Testing
- [ ] Test `enrichWithAIStructure()` with various inputs
- [ ] Test error handling
- [ ] Test caching behavior
- [ ] Mock OpenAI responses

### Integration Testing
- [ ] Test full prediction flow with AI
- [ ] Test fallback chain
- [ ] Test with real molecules
- [ ] Test error scenarios

### Performance Testing
- [ ] Load test the endpoint
- [ ] Test with many concurrent users
- [ ] Monitor memory usage
- [ ] Test cache behavior under load

### User Testing
- [ ] Test with real users
- [ ] Gather feedback on accuracy
- [ ] Identify UX improvements
- [ ] Track error rates

---

## Phase 10: Documentation & Handoff

### Code Documentation
- [ ] Add JSDoc comments to service functions
- [ ] Document all parameters and return types
- [ ] Add inline comments for complex logic
- [ ] Create README in service folder

### API Documentation
- [ ] Document all endpoints in OpenAPI spec
- [ ] Include request/response examples
- [ ] Document error codes
- [ ] List required authentication

### Developer Guide
- [ ] Document architecture decisions
- [ ] Explain why certain choices were made
- [ ] Provide troubleshooting guide
- [ ] List known limitations

### Deployment Documentation
- [ ] Document deployment process
- [ ] List environment variables needed
- [ ] Document monitoring setup
- [ ] Provide rollback procedures

---

## Common Tasks

### Task: Add AI Structure to New Feature
1. Import service: `import { enrichWithAIStructure } from '@/services/structureGeneration'`
2. Call in your handler: `const result = await enrichWithAIStructure(moleculeName)`
3. Use the SMILES: `if (result.smiles) { /* use it */ }`
4. Display metadata: `if (result.source === 'ai') { /* show AI info */ }`

### Task: Debug AI Generation
1. Check browser console for errors
2. Check Network tab for API calls
3. Look at backend logs in uvicorn
4. Verify OpenAI API key is set
5. Test with known molecule first

### Task: Optimize Performance
1. Check cache is working (second call should be instant)
2. Monitor OpenAI response times
3. Implement request batching for multiple calls
4. Consider using a faster model for non-critical molecules

### Task: Add New Metadata Field
1. Update `StructureGenerationResponse` type in service
2. Update backend Pydantic model
3. Update OpenAI prompt to extract field
4. Update component to display field
5. Update tests

---

## Checklist Summary

### Must Complete
- [ ] Understand the architecture
- [ ] Read documentation (at least quick start)
- [ ] Test the feature manually
- [ ] Verify no errors in console
- [ ] Confirm Azure OpenAI is configured

### Should Complete
- [ ] Review all code changes
- [ ] Test edge cases
- [ ] Understand caching mechanism
- [ ] Plan future enhancements

### Nice to Complete
- [ ] Add unit tests
- [ ] Implement monitoring
- [ ] Create developer guide
- [ ] Document API changes

---

## Sign-Off

**Checklist Status:** ⬜ Not Started | 🟨 In Progress | ✅ Complete

- [ ] Feature understanding complete
- [ ] Code review complete
- [ ] Manual testing complete
- [ ] Integration plan ready
- [ ] Performance acceptable
- [ ] Ready for production

**Developer Name:** ________________  
**Date:** ________________  
**Sign-Off:** ________________  

---

## Quick Reference

**Key Files:**
- Service: `src/services/structureGeneration.ts`
- Component: `src/features/property-predictor/PropertyPredictorPage.tsx`
- Backend: `backend/app/api/routes/structure.py`

**Key Functions:**
- Frontend: `enrichWithAIStructure()`
- Backend: `POST /api/v1/structure/generate-ai`

**Key Types:**
- Frontend: `StructureGenerationResponse`
- Backend: `StructureGenerationRequest`, `StructureGenerationResponse`

**Performance:**
- AI generation: 2-5 seconds
- Cached: <50ms
- Cache TTL: 1 hour

**Configuration:**
- Uses existing Azure OpenAI config
- No new environment variables

---

## Getting Help

**Documentation:**
1. `QUICK_START_AI_STRUCTURES.md` - Start here
2. `AI_STRUCTURE_GENERATION.md` - Full details
3. `EXAMPLES_AI_STRUCTURES.md` - Code examples

**Debugging:**
1. Check browser console
2. Check network tab
3. Check backend logs
4. Read error message carefully

**Questions:**
1. Check documentation first
2. Review code comments
3. Look at examples
4. Ask team member

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-05 | Initial implementation |
| (future) | TBD | RDKit validation |
| (future) | TBD | Batch processing |
| (future) | TBD | User corrections |


import { KnowledgeChunk, isAllowedBankSource } from './kb'

// Simple embedding function using text similarity
// In production, replace with OpenAI embeddings or a vector DB
function simpleEmbedding(text: string): number[] {
  // Normalize text
  const normalized = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
  
  // Simple hash-based embedding (for demo)
  // In production: use OpenAI text-embedding-ada-002
  const embedding = new Array(384).fill(0)
  for (const word of normalized) {
    const hash = word.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0)
    }, 0)
    const index = Math.abs(hash) % embedding.length
    embedding[index] += 1 / normalized.length
  }
  
  // Normalize vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8)
}

export interface RetrievedChunk extends KnowledgeChunk {
  similarity: number
}

export function retrieveRelevantChunks(
  query: string,
  knowledgeBase: KnowledgeChunk[],
  topK: number = 5,
  minSimilarity: number = 0.1
): RetrievedChunk[] {
  const queryEmbedding = simpleEmbedding(query)
  
  const scored: RetrievedChunk[] = knowledgeBase
    .map(chunk => ({
      ...chunk,
      similarity: cosineSimilarity(queryEmbedding, simpleEmbedding(chunk.text)),
    }))
    .filter(chunk => {
      // For bank sources, verify they're in the allowlist
      if (chunk.category === 'bank' && chunk.sourceUrl) {
        return isAllowedBankSource(chunk.sourceUrl)
      }
      return true
    })
    .filter(chunk => chunk.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
  
  return scored
}

// Cache for knowledge base (reload on server restart)
let cachedKnowledgeBase: KnowledgeChunk[] | null = null

export function getKnowledgeBase(): KnowledgeChunk[] {
  if (cachedKnowledgeBase === null) {
    try {
      const { loadKnowledgeBase } = require('./kb')
      cachedKnowledgeBase = loadKnowledgeBase()
      console.log(`Loaded ${cachedKnowledgeBase?.length || 0} knowledge chunks`)
    } catch (error) {
      console.error('Error loading knowledge base:', error)
      cachedKnowledgeBase = []
    }
  }
  return cachedKnowledgeBase || []
}

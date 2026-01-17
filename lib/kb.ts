import fs from 'fs'
import path from 'path'

export interface KnowledgeChunk {
  id: string
  text: string
  source: string
  sourceUrl?: string
  title?: string
  category: 'site' | 'bank'
}

const BANK_DOMAIN_ALLOWLIST = [
  'dbs.com',
  'posb.com.sg',
  'ocbc.com',
  'uob.com.sg',
  'maybank2u.com.sg',
  'maybank.com.sg',
  'cimb.com.sg',
  'hsbc.com.sg',
  'standardchartered.com.sg',
  'rhbgroup.com',
]

export function isAllowedBankSource(url?: string): boolean {
  if (!url) return false
  try {
    const domain = new URL(url).hostname.toLowerCase()
    return BANK_DOMAIN_ALLOWLIST.some((allowed) => domain.includes(allowed))
  } catch {
    return false
  }
}

export function loadKnowledgeBase(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  const kbDir = path.join(process.cwd(), 'kb')

  if (!fs.existsSync(kbDir)) {
    console.warn('Knowledge base directory not found. Creating template structure...')
    createKBStructure(kbDir)
    return []
  }

  // Load site knowledge
  const siteDir = path.join(kbDir, 'site')
  if (fs.existsSync(siteDir)) {
    const siteFiles = fs.readdirSync(siteDir, { recursive: true })
    for (const file of siteFiles) {
      if (typeof file === 'string' && file.endsWith('.md')) {
        const filePath = path.join(siteDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const parsed = parseMarkdownFile(content, file, 'site')
        chunks.push(...parsed)
      }
    }
  }

  // Load bank knowledge
  const bankDir = path.join(kbDir, 'banks')
  if (fs.existsSync(bankDir)) {
    const bankFiles = fs.readdirSync(bankDir, { recursive: true })
    for (const file of bankFiles) {
      if (typeof file === 'string' && file.endsWith('.md')) {
        const filePath = path.join(bankDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const parsed = parseMarkdownFile(content, file, 'bank')
        chunks.push(...parsed)
      }
    }
  }

  return chunks
}

function parseMarkdownFile(content: string, filename: string, category: 'site' | 'bank'): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  const lines = content.split('\n')
  
  let currentChunk = ''
  let sourceUrl: string | undefined
  let title: string | undefined
  let chunkId = 0

  // Extract frontmatter if present
  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('---', 3)
    if (frontmatterEnd > 0) {
      const frontmatter = content.substring(3, frontmatterEnd)
      for (const line of frontmatter.split('\n')) {
        if (line.startsWith('source:')) {
          sourceUrl = line.split('source:')[1].trim()
        }
        if (line.startsWith('title:')) {
          title = line.split('title:')[1].trim()
        }
      }
      content = content.substring(frontmatterEnd + 3).trim()
    }
  }

  // Try to extract source URL from content
  if (!sourceUrl) {
    const urlMatch = content.match(/Source:\s*(https?:\/\/[^\s\n]+)/i)
    if (urlMatch) {
      sourceUrl = urlMatch[1]
    }
  }

  // Try to extract title
  if (!title) {
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch) {
      title = titleMatch[1]
    } else {
      title = filename.replace('.md', '').replace(/-/g, ' ')
    }
  }

  // Split into chunks (by paragraphs, roughly 300-500 chars)
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50)
  
  for (const para of paragraphs) {
    const cleaned = para.trim().replace(/^#+\s+/, '').trim()
    if (cleaned.length > 50) {
      chunks.push({
        id: `${category}-${filename}-${chunkId++}`,
        text: cleaned,
        source: filename,
        sourceUrl,
        title,
        category,
      })
    }
  }

  return chunks
}

function createKBStructure(kbDir: string) {
  if (!fs.existsSync(kbDir)) {
    fs.mkdirSync(kbDir, { recursive: true })
  }
  
  const siteDir = path.join(kbDir, 'site')
  const bankDir = path.join(kbDir, 'banks')
  
  if (!fs.existsSync(siteDir)) {
    fs.mkdirSync(siteDir, { recursive: true })
  }
  
  if (!fs.existsSync(bankDir)) {
    fs.mkdirSync(bankDir, { recursive: true })
  }

  // Create README files
  const siteReadme = `# Brilliance Advisory Knowledge Base

Place your website information files here as Markdown (.md) files.

## Format

\`\`\`markdown
---
title: Page Title
source: https://brillianceadvisory.sg/page
---

# Content Title

Your content here...

Source: https://brillianceadvisory.sg/page
\`\`\`
`

  const bankReadme = `# Bank Knowledge Base

Place official bank information here as Markdown files. ONLY include content from official bank websites.

## Allowed Sources

${BANK_DOMAIN_ALLOWLIST.map(d => `- ${d}`).join('\n')}

## Format

\`\`\`markdown
---
title: Bank Product Name
source: https://official-bank-domain.com/product-page
---

# Product Information

Content from official bank website...

Source: https://official-bank-domain.com/product-page
\`\`\`
`

  fs.writeFileSync(path.join(siteDir, 'README.md'), siteReadme)
  fs.writeFileSync(path.join(bankDir, 'README.md'), bankReadme)
}

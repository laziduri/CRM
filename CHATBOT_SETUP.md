# Claire Chatbot Setup Guide

## Overview

Claire is a compliance-focused AI chatbot for Brilliance Advisory with strict source grounding and appointment-first behavior.

## Features

- ✅ RAG (Retrieval-Augmented Generation) with knowledge base
- ✅ Source grounding with bank domain allowlist
- ✅ Citation display in responses
- ✅ Conversation threads with localStorage persistence
- ✅ Appointment booking functionality
- ✅ WhatsApp handoff integration
- ✅ Strict compliance rules (no invented facts)

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
WHATSAPP_NUMBER=6591234567
```

### 2. Knowledge Base Structure

The knowledge base is stored in `/kb` directory:

```
kb/
├── site/          # Brilliance Advisory website content
│   ├── README.md
│   ├── about-brilliance.md
│   └── services.md
└── banks/         # Official bank information (allowlist only)
    ├── README.md
    └── [bank-name]-[product].md
```

### 3. Adding Knowledge Base Content

#### Site Content (`/kb/site/`)

Create markdown files with your website information:

```markdown
---
title: Page Title
source: https://brillianceadvisory.sg/page
---

# Content Title

Your content here...

Source: https://brillianceadvisory.sg/page
```

#### Bank Content (`/kb/banks/`)

**IMPORTANT**: Only include content from official bank websites in the allowlist:

- dbs.com
- posb.com.sg
- ocbc.com
- uob.com.sg
- maybank2u.com.sg / maybank.com.sg
- cimb.com.sg
- hsbc.com.sg
- standardchartered.com.sg
- rhbgroup.com

Format:

```markdown
---
title: Bank Product Name
source: https://official-bank-domain.com/product-page
---

# Product Information

Content from official bank website...

Source: https://official-bank-domain.com/product-page
```

### 4. Starting the Development Server

```bash
npm run dev
```

The knowledge base will be loaded on server startup. Check the console for:
```
Loaded X knowledge chunks
```

### 5. Testing the Chatbot

1. Click the "Chat with us" button (bottom right)
2. Ask a question related to your knowledge base
3. Check that:
   - Responses include citations
   - Invalid questions trigger handoff to WhatsApp/appointment
   - Appointment booking form works

## Compliance Rules (Hardcoded)

1. **Source Grounding**: Bot only answers using provided context
2. **Bank Allowlist**: Only official bank domains are accepted
3. **No Legal Advice**: Never provides legal advice
4. **Subject to Assessment**: All financing discussions include this disclaimer
5. **Appointment-First**: Every answer ends with appointment booking CTA
6. **Handoff Rules**: Complex/urgent queries → WhatsApp + appointment

## API Endpoint

`POST /api/chat`

Request:
```json
{
  "threadId": "optional-thread-id",
  "messages": [
    { "role": "user", "content": "What loans do you offer?" }
  ]
}
```

Response:
```json
{
  "message": "Response text with citations...",
  "citations": [
    { "title": "Page Title", "url": "https://..." }
  ],
  "shouldForceHandoff": false,
  "whatsappUrl": "https://wa.me/..."
}
```

## Troubleshooting

### Knowledge base not loading
- Check that `/kb` directory exists
- Verify markdown files are properly formatted
- Check server console for errors

### No citations in responses
- Ensure source URLs are included in markdown frontmatter
- Check that bank sources are in the allowlist

### OpenAI API errors
- Verify `OPENAI_API_KEY` is set in `.env.local`
- Check API key is valid and has credits

## Security Notes

- API key is server-only (never exposed to client)
- Bank domain allowlist prevents unauthorized sources
- All responses include compliance disclaimers

## Next Steps

1. Add more content to `/kb/site/` from your website
2. Add official bank information to `/kb/banks/` (from allowlist domains only)
3. Customize system prompt in `/app/api/chat/route.ts` if needed
4. Update WhatsApp number in environment variables

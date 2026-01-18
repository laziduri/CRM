# CRM Subdomain Setup Guide

## Overview
The CRM is configured to run on `crm.yourdomain.sg` subdomain. Here's how to set it up:

## 1. DNS Configuration

Add a CNAME or A record in your DNS provider:

### Option A: CNAME (Recommended)
```
Type: CNAME
Name: crm
Value: yourdomain.sg (or your hosting provider's subdomain)
TTL: 3600
```

### Option B: A Record
```
Type: A
Name: crm
Value: [Your server IP address]
TTL: 3600
```

## 2. Vercel Deployment (If using Vercel)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add domain: `crm.yourdomain.sg`
4. Vercel will automatically configure SSL

## 3. Other Hosting Providers

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^crm\.yourdomain\.sg$ [NC]
RewriteRule ^(.*)$ /crm/$1 [L]
```

### Nginx
```nginx
server {
    listen 80;
    server_name crm.yourdomain.sg;
    
    location / {
        proxy_pass http://localhost:3000/crm;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 4. Next.js Middleware (Optional)

If you want to route based on subdomain automatically, you can add middleware:

Create `middleware.ts` in the root:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // If accessing via crm subdomain, ensure we're on /crm route
  if (hostname.startsWith('crm.')) {
    const url = request.nextUrl.clone()
    if (!url.pathname.startsWith('/crm')) {
      url.pathname = `/crm${url.pathname === '/' ? '' : url.pathname}`
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## 5. Environment Variables

Update your production environment variables if needed:
```
NEXT_PUBLIC_CRM_URL=https://crm.yourdomain.sg
```

## 6. Testing

1. Update your local `/etc/hosts` file (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 crm.localhost
```

2. Access via `http://crm.localhost:3000/crm`

## 7. PWA Installation

The CRM is configured as a Progressive Web App (PWA). Users can:
- Install it on their mobile devices
- Install it on desktop browsers
- Access it offline (with cached resources)

The install prompt will appear automatically in supported browsers.

## Current Status

✅ CRM homepage at `/crm`
✅ Login page at `/crm/login`
✅ PWA manifest configured
✅ Service worker ready
✅ Install prompt ready
✅ Button links to subdomain in production

Once DNS is configured, the button on `/client/login` will automatically link to `https://crm.yourdomain.sg`.

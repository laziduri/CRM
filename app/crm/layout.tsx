import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brilliance CRM - AI-Powered Loan Advisory CRM',
  description: 'Complete CRM platform for loan consultants with AI-powered tools, client management, and performance analytics',
  manifest: '/manifest.json',
  themeColor: '#0066CC',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Brilliance CRM',
  },
  openGraph: {
    title: 'Brilliance CRM - AI-Powered Loan Advisory CRM',
    description: 'Complete CRM platform for loan consultants',
    type: 'website',
  },
}

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0066CC" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Brilliance CRM" />
      {children}
      {/* PWA Install Prompt Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator && typeof window !== 'undefined') {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('Service Worker registered', reg))
                  .catch(err => console.log('Service Worker registration failed', err));
              });
              
              // PWA Install Prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                // Show custom install button
                const installBtn = document.getElementById('pwa-install-btn');
                if (installBtn) {
                  installBtn.style.display = 'flex';
                  installBtn.addEventListener('click', () => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                      if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                      }
                      deferredPrompt = null;
                      installBtn.style.display = 'none';
                    });
                  });
                }
              });
            }
          `,
        }}
      />
    </>
  )
}

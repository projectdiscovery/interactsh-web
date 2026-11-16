import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import StyledComponentsRegistry from '@/lib/registry';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Interactsh | Web Client',
  description: 'Interactsh Web Client - Out of band Data Extraction tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans&family=Poppins&family=Montserrat&family=Open+Sans&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        {/* Server-side configuration, loaded before the app code runs. */}
        <Script src="/env.js" strategy="beforeInteractive" />
        <StyledComponentsRegistry>
          <div id="root">{children}</div>
          <div id="portal_root"></div>
          <div id="download_anchor_element" />
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  );
}

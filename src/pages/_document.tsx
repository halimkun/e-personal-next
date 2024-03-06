import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head />

      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content='A employee management system' />
      <meta name='keywords' content='employee, management, system' />
      <meta name='theme-color' content='#ffffff' />

      <link rel='icon' href='/favicon.ico' />
      <link rel='shortcut icon' href='/favicon.ico' />
      <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      <link
        rel='apple-touch-icon'
        sizes='192x192'
        href='/apple-touch-icon-192x192.png'
      />
      <link
        rel='apple-touch-icon'
        sizes='512x512'
        href='/apple-touch-icon-512x512.png'
      />

      {/* manifest */}
      <link rel='manifest' href='/manifest.json' />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

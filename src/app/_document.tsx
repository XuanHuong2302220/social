import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
          
          {/* SEO Meta Tags */}
          <meta name="description" content="Your website description here" />
          <meta name="keywords" content="website, nextjs, seo, react" />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Your Name or Company Name" />
          
          {/* Open Graph Meta Tags for Social Media */}
          <meta property="og:title" content="Your Website Title" />
          <meta property="og:description" content="Your website description here" />
          <meta property="og:image" content="/og-image.jpg" />
          <meta property="og:url" content="https://www.yoursite.com" />
          <meta property="og:type" content="website" />
          
          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Your Website Title" />
          <meta name="twitter:description" content="Your website description here" />
          <meta name="twitter:image" content="/og-image.jpg" />
          
          {/* Theme Color */}
          <meta name="theme-color" content="#000000" />
          
          {/* Charset */}
          <meta charSet="UTF-8" />
          
          {/* Viewport for Responsive Design */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          {/* Structured Data (JSON-LD) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://www.yoursite.com",
                "name": "Your Website Name",
                "description": "Your website description here",
                "logo": "/",
                "sameAs": ["https://www.facebook.com/yourprofile", "https://twitter.com/yourprofile"],
              }),
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

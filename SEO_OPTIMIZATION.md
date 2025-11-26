# SEO Optimization - David Abt Portfolio

This document describes the SEO optimizations implemented for the David Abt portfolio website.

## Overview

The website has been optimized for search engines and social media sharing with comprehensive metadata, structured data, and proper semantic HTML.

## Key SEO Features Implemented

### 1. Metadata Configuration

#### Root Layout (`app/layout.tsx`)
- **Title Template**: Dynamic titles for all pages following the pattern "Page Title | David Abt"
- **Description**: Artist bio highlighting David Abt as a sculptor from Chaco
- **Keywords**: Relevant keywords for search engines
- **Open Graph Tags**: Optimized for Facebook, LinkedIn, and other platforms
- **Twitter Cards**: Large image cards for Twitter sharing
- **Canonical URLs**: Proper canonical URL structure
- **Robots Meta**: Instructions for search engine crawlers
- **Language**: Set to Spanish (`lang="es"`)

#### Individual Pages
Each section page has custom metadata:
- **Formas y Volumenes**: `/formasyvolumenes`
- **Cosmos**: `/cosmos`
- **Pinturas**: `/pinturas`
- **OnAgua**: `/onagua`
- **Trabajos Especiales**: `/trabajosespeciales`
- **Procesos**: `/procesos`
- **Eventos**: `/eventos`
- **Curriculum**: `/curriculum`

### 2. Social Media Sharing

All pages include:
- **Open Graph Image**: `/images/fotodavidabt.png` (1200x630px recommended)
- **Open Graph Description**: Artist bio in Spanish
- **Twitter Card**: Large image format
- **Locale**: Set to `es_AR` (Spanish - Argentina)

When sharing on social media, the preview will show:
- Artist's photo (`fotodavidabt.png`)
- Title: "David Abt - Escultor y Artista Plástico Chaqueño"
- Description: "David Abt es un escultor y artista plástico chaqueño cuya obra se caracteriza por una exploración profunda del volumen, la fantasía y lo simbólico, con un fuerte anclaje en el territorio del Gran Chaco."

### 3. Structured Data (JSON-LD)

Schema.org structured data for the artist:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "David Abt",
  "jobTitle": "Escultor y Artista Plástico",
  "description": "...",
  "image": "/images/fotodavidabt.png",
  "url": "https://davidabt.com",
  "sameAs": ["https://www.instagram.com/david.abt1"],
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Chaco",
    "addressCountry": "AR"
  }
}
```

### 4. Sitemap

Automatic XML sitemap generation at `/sitemap.xml` including:
- All main pages
- Priority levels (1.0 for home, 0.9 for sections, etc.)
- Change frequency hints
- Last modified dates

### 5. Robots.txt

Automatic robots.txt generation at `/robots.txt`:
- Allows all search engines to crawl public pages
- Blocks `/admin/` and `/api/` routes
- References sitemap location

### 6. Image Optimization

- Using Next.js Image component for automatic optimization
- Proper alt text for accessibility and SEO
- Artist thumbnail optimized for social sharing

## Environment Variables

Add to your `.env` file:

```bash
NEXT_PUBLIC_BASE_URL=https://davidabt.com
```

Replace with your actual domain when deploying.

## Testing SEO

### Test Open Graph Tags
1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### Test Structured Data
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Markup Validator**: https://validator.schema.org/

### Test General SEO
1. **Google Search Console**: Submit sitemap and monitor indexing
2. **PageSpeed Insights**: https://pagespeed.web.dev/
3. **Lighthouse**: Built into Chrome DevTools

## Best Practices Implemented

✅ Semantic HTML structure
✅ Proper heading hierarchy (H1, H2, H3)
✅ Descriptive alt text for images
✅ Mobile-responsive design
✅ Fast page load times (Next.js optimization)
✅ HTTPS (when deployed)
✅ Unique meta descriptions for each page
✅ Canonical URLs
✅ Structured data (JSON-LD)
✅ XML sitemap
✅ Robots.txt
✅ Social media meta tags
✅ Spanish language declaration
✅ Accessibility features (aria-labels)

## Recommendations

1. **Submit Sitemap**: Submit `/sitemap.xml` to Google Search Console
2. **Verify Domain**: Add domain verification in Google Search Console
3. **Monitor Performance**: Use Google Analytics to track visitor behavior
4. **Update Content**: Regularly update eventos and obras to keep content fresh
5. **Image Optimization**: Ensure `fotodavidabt.png` is optimized (1200x630px for best results)
6. **Build Backlinks**: Share on social media and art platforms
7. **Local SEO**: Consider adding Google My Business if applicable

## Future Enhancements

- Add breadcrumb navigation with structured data
- Implement article structured data for eventos
- Add FAQ schema if applicable
- Consider multilingual support (English version)
- Add video structured data if video content is added
- Implement AMP pages for faster mobile loading (optional)

## Monitoring

After deployment, monitor:
- Google Search Console for indexing status
- Social media sharing previews
- Page load speed
- Mobile usability
- Core Web Vitals
- Organic search traffic

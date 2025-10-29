# SMPIT Daarut Tarbiyah - Build Configuration

## Build Commands
```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Production build
npm run build

# Clean build directory
npm run clean

# Lint code
npm run lint
```

## Environment Variables
```bash
NODE_ENV=production
BASE_URL=https://smpitdaaruttarbiyah.github.io/smpit-dti-web/
```

## Performance Optimization

### Critical CSS
- Above-the-fold CSS is inlined
- Non-critical CSS is loaded asynchronously
- CSS is minified and compressed

### Image Optimization
- Images are served in next-gen formats (WebP)
- Responsive images with srcset
- Lazy loading for below-the-fold images
- Compression level: 85%

### JavaScript Optimization
- Code splitting for better caching
- Tree shaking to remove unused code
- Minification with Terser
- Async loading for non-critical scripts

### Caching Strategy
- Static assets: 1 year cache
- HTML: 1 hour cache
- Images: 30 days cache
- Service Worker for offline support

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## Performance Budget
- JavaScript: < 250KB compressed
- CSS: < 100KB compressed
- Images: Optimized per page
- Total page weight: < 2MB

## Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

## Deployment
- Built with Eleventy static site generator
- Deployed to GitHub Pages
- CI/CD with GitHub Actions
- Automatic deployment on main branch push
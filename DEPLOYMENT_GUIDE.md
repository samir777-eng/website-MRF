# Deployment Guide - MRF Educational Platform

Complete guide for deploying the MRF Educational Platform to production.

---

## [Prerequisites]

### Required
- Node.js 18+ installed
- npm or yarn package manager
- Git repository access
- Domain name (optional for demo)

### Recommended
- Vercel account (easiest deployment)
- Or Netlify account
- Or AWS account

---

## [Quick Deploy to Vercel] (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd mrf-edu-web
vercel --prod
```

### Step 4: Configure Domain (Optional)
```bash
vercel domains add yourdomain.com
```

**Done!** Your site is live at: `https://your-project.vercel.app`

---

## [Deploy to Netlify]

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd mrf-edu-web
netlify deploy --prod
```

### Option 2: Git Integration

1. Push code to GitHub/GitLab/Bitbucket
2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

---

## [Deploy to AWS Amplify]

### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify
```bash
cd mrf-edu-web
amplify init
```

### Step 3: Add Hosting
```bash
amplify add hosting
# Select: Hosting with Amplify Console
```

### Step 4: Deploy
```bash
amplify publish
```

---

## [Environment Variables]

### Required Variables
None for demo deployment (uses mock data)

### Optional Variables (for production)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_KEY=your_api_key

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=auth.yourdomain.com
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://yourdomain.com

# Payment Gateway
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Setting Environment Variables

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_API_URL
```

**Netlify:**
```bash
netlify env:set NEXT_PUBLIC_API_URL "https://api.yourdomain.com"
```

**AWS Amplify:**
Add in Amplify Console > App Settings > Environment Variables

---

## [Build Configuration]

### Vercel (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Netlify (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## [Custom Domain Setup]

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

---

## [SSL/HTTPS]

### Automatic SSL (Recommended)
- Vercel: Automatic (Let's Encrypt)
- Netlify: Automatic (Let's Encrypt)
- AWS Amplify: Automatic (AWS Certificate Manager)

### Custom SSL Certificate
Upload your certificate in platform settings.

---

## [Performance Optimization]

### Enable Compression
Already enabled in Next.js config.

### Enable Caching
```javascript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Enable CDN
- Vercel: Automatic (Edge Network)
- Netlify: Automatic (CDN)
- AWS Amplify: Automatic (CloudFront)

---

## [Monitoring & Analytics]

### Setup Google Analytics
1. Get GA4 tracking ID
2. Add to environment variables:
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Already integrated in the app

### Setup Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Setup Performance Monitoring
- Vercel Analytics: Enable in dashboard
- Netlify Analytics: Enable in dashboard
- AWS CloudWatch: Configure in Amplify Console

---

## [Continuous Deployment]

### Automatic Deployment on Git Push

**Vercel:**
- Automatically deploys on push to main branch
- Preview deployments for pull requests

**Netlify:**
- Configure in Site Settings > Build & Deploy
- Deploy on push to production branch

**AWS Amplify:**
- Configure in App Settings > Build Settings
- Auto-deploy on push

---

## [Rollback Strategy]

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Netlify
```bash
# List deploys
netlify deploy:list

# Restore previous deploy
netlify deploy:restore [deploy-id]
```

---

## [Health Checks]

### Endpoints to Monitor
- Homepage: `https://yourdomain.com/ar`
- API health: `https://yourdomain.com/api/health`
- Build status: Check platform dashboard

### Uptime Monitoring
- Use UptimeRobot (free)
- Or Pingdom
- Or StatusCake

---

## [Backup Strategy]

### Code Backup
- Git repository (GitHub/GitLab)
- Multiple branches (main, staging, dev)

### Database Backup (when integrated)
- Daily automated backups
- Point-in-time recovery
- Off-site backup storage

---

## [Security Checklist]

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Dependencies updated
- [ ] Vulnerability scanning enabled

---

## [Pre-Deployment Checklist]

### Code Quality
- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Tests pass: `npm test`

### Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size < 200KB
- [ ] Images optimized
- [ ] Fonts optimized

### Functionality
- [ ] All pages load
- [ ] All links work
- [ ] Forms submit
- [ ] Navigation works
- [ ] Mobile responsive

### SEO
- [ ] Meta tags present
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data added

### Accessibility
- [ ] WCAG AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes

---

## [Post-Deployment Checklist]

- [ ] Site loads correctly
- [ ] SSL certificate active
- [ ] Custom domain working
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance monitoring active
- [ ] Backup configured
- [ ] Team notified

---

## [Troubleshooting]

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Check variable names (must start with NEXT_PUBLIC_ for client-side)
- Redeploy after adding variables
- Check platform-specific syntax

### 404 Errors
- Check routing configuration
- Verify file paths
- Check middleware configuration

### Slow Performance
- Enable CDN
- Optimize images
- Enable caching
- Check bundle size

---

## [Support]

### Platform Support
- Vercel: https://vercel.com/support
- Netlify: https://www.netlify.com/support/
- AWS: https://aws.amazon.com/support/

### Project Support
- Email: support@mrredaelfarouk.com
- Documentation: /docs
- GitHub Issues: [repository-url]/issues

---

## [Next Steps After Deployment]

1. **Monitor Performance**
   - Check Lighthouse scores
   - Monitor load times
   - Track error rates

2. **Gather Feedback**
   - User testing
   - Stakeholder review
   - Analytics review

3. **Iterate**
   - Fix bugs
   - Improve performance
   - Add features

4. **Scale**
   - Backend integration
   - Database setup
   - Payment gateway

---

**Status:** Ready for deployment  
**Recommended Platform:** Vercel  
**Estimated Deploy Time:** 5-10 minutes  
**Difficulty:** Easy


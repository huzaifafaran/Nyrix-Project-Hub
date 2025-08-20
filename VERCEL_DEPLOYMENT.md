# 🚀 Deploy to Vercel

This guide will walk you through deploying your Nyrix Project Hub to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Supabase Database**: Ensure your database is set up and running

## 🔧 Step 1: Prepare Your Code

### 1.1 Environment Variables
Create a `.env.local` file in your project root with your Supabase credentials:

```bash
# Copy from env.example
cp env.example .env.local
```

### 1.2 Verify Build
Test that your project builds successfully locally:

```bash
npm run build
```

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://ymllzviqvocnknziordb.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbGx6dmlxdm9jbmtuemlvcmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDYzMzcsImV4cCI6MjA3MTI4MjMzN30.fWVgkwgqSVsJpRraDuiu-VzWHHtDkW1VX15W0bIy-Tg
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set environment variables when prompted

## 🌐 Step 3: Configure Custom Domain (Optional)

1. **Add Domain**
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Follow Vercel's DNS configuration instructions
   - Wait for DNS propagation (up to 48 hours)

## 🔒 Step 4: Security & Environment

### Environment Variables in Vercel
- Go to Project Settings → Environment Variables
- Add both production and preview environments
- Ensure `NEXT_PUBLIC_` prefix for client-side variables

### Supabase Security
- Your Supabase project is already configured for public access
- In production, consider implementing Row Level Security (RLS) policies
- Monitor your Supabase usage and limits

## 📊 Step 5: Monitor & Optimize

### Vercel Analytics
- Enable Vercel Analytics in your project
- Monitor performance metrics
- Track user behavior

### Supabase Monitoring
- Check Supabase dashboard for:
  - Database performance
  - API usage
  - Error logs

## 🧪 Step 6: Test Your Deployment

1. **Create a Project**
   - Test project creation functionality
   - Verify data is saved to Supabase

2. **Add Tasks**
   - Create tasks within projects
   - Test task management features

3. **Test Comments**
   - Add comments to tasks
   - Verify real-time updates

4. **Cross-Device Testing**
   - Test on mobile devices
   - Verify responsive design

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Verify all dependencies are in package.json
   npm run build # Test locally first
   ```

2. **Environment Variables**
   - Ensure variables are set in Vercel
   - Check for typos in variable names
   - Verify `NEXT_PUBLIC_` prefix

3. **Supabase Connection**
   - Verify Supabase URL and key
   - Check Supabase project status
   - Ensure database tables exist

4. **Performance Issues**
   - Enable Vercel Edge Functions
   - Optimize images and assets
   - Use Next.js Image component

### Getting Help

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

## 🎉 Success!

Your project management tool is now live on Vercel with:
- ✅ Automatic deployments from GitHub
- ✅ Global CDN for fast loading
- ✅ SSL certificates included
- ✅ Automatic scaling
- ✅ Real-time Supabase database
- ✅ Professional domain (optional)

## 🔄 Continuous Deployment

- Every push to your main branch triggers a new deployment
- Preview deployments are created for pull requests
- Rollback to previous versions anytime

## 📈 Next Steps

1. **Set up monitoring** with Vercel Analytics
2. **Configure custom domain** for branding
3. **Implement authentication** for user management
4. **Add real-time features** with Supabase subscriptions
5. **Set up CI/CD** for automated testing

Your project management tool is now production-ready! 🚀

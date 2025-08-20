# 📧 SMTP Setup for Nyrix Project Hub

This guide will help you set up SMTP email notifications using Gmail for the Nyrix Project Hub.

## 🚀 Quick Setup

### 1. Gmail App Password Setup
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to "Security" → "2-Step Verification" (enable if not already enabled)
3. Go to "App passwords" under 2-Step Verification
4. Generate a new app password for "Mail"
5. Copy the generated password (16 characters)

### 2. Environment Variables
Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# SMTP Configuration
SMTP_HOST=smtp.gmail.co
SMTP_PORT=465
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_FROM=Your Name <your_gmail@gmail.com>
```



## 🔧 How It Works

### Email Flow
1. **Task Assignment**: When a task is assigned, an email is sent to the assignee
2. **Comment Notifications**: When someone comments on a task, the assignee receives an email
3. **Email Content**: Beautiful HTML emails with task details and styling

### Technical Implementation
- **Frontend**: Email service functions format and send email requests
- **Backend**: API route (`/api/send-email`) handles SMTP sending
- **SMTP**: Direct connection to Gmail SMTP server
- **Security**: App passwords provide secure authentication

## 📱 Testing

### 1. Test SMTP Connection
Visit `/api/send-email` in your browser to test the SMTP connection.

### 2. Test Task Assignment
1. Create a new task and assign it to a team member
2. Check if the email is received
3. Verify email content and formatting

### 3. Test Comment Notifications
1. Add a comment to an assigned task
2. Verify the assignee receives the notification email

## 🚨 Troubleshooting

### Common Issues:

#### SMTP Authentication Failed
- **Cause**: Incorrect app password or 2FA not enabled
- **Solution**: Regenerate app password and ensure 2FA is enabled

#### Connection Timeout
- **Cause**: Firewall or network restrictions
- **Solution**: Check if port 465 is open, try port 587 with TLS

#### Emails Not Sending
- **Cause**: Environment variables not loaded
- **Solution**: Restart development server after adding `.env.local`

#### Gmail Quota Exceeded
- **Cause**: Daily sending limit reached
- **Solution**: Gmail free tier allows 500 emails/day

### Debug Mode:
Check the browser console and server logs for detailed error messages.

## 🔒 Security Notes

- **App Passwords**: More secure than regular passwords
- **Environment Variables**: Never commit `.env.local` to version control
- **SMTP Ports**: 465 (SSL) or 587 (TLS) are secure
- **Rate Limiting**: Gmail has built-in rate limiting

## 💰 Pricing

- **Gmail Free**: 500 emails/day, 100 emails/minute
- **Gmail Workspace**: Higher limits, business features
- **Custom SMTP**: Use your own email server for unlimited sending

## 📞 Support

- **Gmail Help**: [support.google.com/mail](https://support.google.com/mail)
- **App Passwords**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- **Nyrix Project Hub**: GitHub repository issues

## 🚀 Production Deployment

### Vercel Environment Variables
When deploying to Vercel, add these environment variables:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each SMTP variable:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `EMAIL_FROM`

### Alternative SMTP Providers
You can use other SMTP providers by changing the configuration:

```env
# Outlook/Hotmail
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587

# Yahoo
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587

# Custom SMTP Server
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
```

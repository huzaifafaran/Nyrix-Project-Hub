import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER || 'veeko.assistant@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'zeka pffu xpfv axmm';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Veeko Reports <veeko.assistant@gmail.com>';

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and either html or text' },
        { status: 400 }
      );
    }

    // Email options
    const mailOptions = {
      from: EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
      text: text || html?.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: subject,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    });

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Test endpoint to verify SMTP connection
export async function GET() {
  try {
    // Verify SMTP connection
    await transporter.verify();
    
    return NextResponse.json({
      success: true,
      message: 'SMTP connection verified successfully',
      config: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        user: SMTP_USER,
        from: EMAIL_FROM,
      }
    });
  } catch (error) {
    console.error('❌ SMTP verification failed:', error);
    
    return NextResponse.json(
      { 
        error: 'SMTP verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

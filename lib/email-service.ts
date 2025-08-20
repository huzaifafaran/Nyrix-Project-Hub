import { TeamMember } from './team-members';

// SMTP Configuration
const SMTP_HOST = process.env.NEXT_PUBLIC_SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.NEXT_PUBLIC_SMTP_PORT || '465';
const SMTP_USER = process.env.NEXT_PUBLIC_SMTP_USER || 'veeko.assistant@gmail.com';
const SMTP_PASS = process.env.NEXT_PUBLIC_SMTP_PASS || 'zeka pffu xpfv axmm';
const EMAIL_FROM = process.env.NEXT_PUBLIC_EMAIL_FROM || 'Veeko Reports <veeko.assistant@gmail.com>';

export interface TaskAssignmentEmail {
  to_email: string;
  to_name: string;
  task_title: string;
  project_name: string;
  deadline?: string;
  priority: string;
  assigned_by: string;
}

// Simple email sending function using fetch to a backend endpoint
export const sendTaskAssignmentEmail = async (emailData: TaskAssignmentEmail): Promise<boolean> => {
  try {
    const emailContent = formatTaskAssignmentEmail(emailData);
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📧 Task Assignment Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};

export const sendCommentNotificationEmail = async (
  toEmail: string,
  toName: string,
  taskTitle: string,
  projectName: string,
  commentAuthor: string,
  commentText: string
): Promise<boolean> => {
  try {
    const emailContent = formatCommentNotificationEmail(
      toEmail,
      toName,
      taskTitle,
      projectName,
      commentAuthor,
      commentText
    );
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📧 Comment Notification Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send comment notification email:', error);
    return false;
  }
};

// New function for tag notifications
export const sendTagNotificationEmail = async (
  toEmail: string,
  toName: string,
  taskTitle: string,
  projectName: string,
  commentAuthor: string,
  commentText: string
): Promise<boolean> => {
  try {
    const emailContent = formatTagNotificationEmail(
      toEmail,
      toName,
      taskTitle,
      projectName,
      commentAuthor,
      commentText
    );
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📧 Tag Notification Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send tag notification email:', error);
    return false;
  }
};

// Helper function to format email content
export const formatTaskAssignmentEmail = (emailData: TaskAssignmentEmail) => {
  return {
    to: emailData.to_email,
    subject: `New Task Assigned: ${emailData.task_title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">New Task Assignment</h2>
        <p>Hello ${emailData.to_name},</p>
        <p>You have been assigned a new task in the <strong>Nyrix Project Hub</strong>:</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${emailData.task_title}</h3>
          <p><strong>Project:</strong> ${emailData.project_name}</p>
          <p><strong>Priority:</strong> <span style="color: ${getPriorityColor(emailData.priority)}">${emailData.priority}</span></p>
          <p><strong>Deadline:</strong> ${emailData.deadline || 'No deadline set'}</p>
          <p><strong>Assigned by:</strong> ${emailData.assigned_by}</p>
        </div>
        
        <p>Please log in to the project hub to view full details and start working on this task.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            <strong>Nyrix Project Hub Team</strong>
          </p>
        </div>
      </div>
    `
  };
};

export const formatCommentNotificationEmail = (
  toEmail: string,
  toName: string,
  taskTitle: string,
  projectName: string,
  commentAuthor: string,
  commentText: string
) => {
  return {
    to: toEmail,
    subject: `New Comment on Task: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">New Comment Notification</h2>
        <p>Hello ${toName},</p>
        <p>A new comment has been added to your task in the <strong>Nyrix Project Hub</strong>:</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${taskTitle}</h3>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Comment by:</strong> ${commentAuthor}</p>
          <p><strong>Comment:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 10px 0;">
            ${commentText}
          </div>
        </div>
        
        <p>Please log in to the project hub to view the full context and respond if needed.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            <strong>Nyrix Project Hub Team</strong>
          </p>
        </div>
      </div>
    `
  };
};

export const formatTagNotificationEmail = (
  toEmail: string,
  toName: string,
  taskTitle: string,
  projectName: string,
  commentAuthor: string,
  commentText: string
) => {
  return {
    to: toEmail,
    subject: `You were tagged in a comment: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">You were tagged in a comment!</h2>
        <p>Hello ${toName},</p>
        <p>You were tagged in a comment in the <strong>Nyrix Project Hub</strong>:</p>
        
        <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #FECACA;">
          <h3 style="margin-top: 0; color: #DC2626;">${taskTitle}</h3>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Tagged by:</strong> ${commentAuthor}</p>
          <p><strong>Comment:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #DC2626; margin: 10px 0;">
            ${commentText}
          </div>
        </div>
        
        <p><strong>Action Required:</strong> Please review this comment and respond if needed.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            <strong>Nyrix Project Hub Team</strong>
          </p>
        </div>
      </div>
    `
  };
};

// Helper function to get priority colors
const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'urgent': return '#DC2626';
    case 'high': return '#EA580C';
    case 'medium': return '#D97706';
    case 'low': return '#059669';
    default: return '#6B7280';
  }
};

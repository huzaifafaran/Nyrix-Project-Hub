# Nyrix Project Hub

A beautiful and efficient project management platform by Nyrix, built with Next.js, featuring modern UI/UX design and comprehensive task management capabilities.

## ✨ Features

### 🎯 Project Management
- **Create Projects**: Add new projects with names, descriptions, and status
- **Project Status**: Track projects as Active, On Hold, or Completed
- **Visual Progress**: See project completion progress with visual indicators
- **Project Dashboard**: Overview of all projects with key metrics

### 📋 Task Management
- **Create Tasks**: Add tasks within projects with detailed information
- **Task Status**: Track tasks through Todo → In Progress → Review → Completed workflow
- **Priority Levels**: Set task priority (Low, Medium, High, Urgent)
- **Deadlines**: Set and track task deadlines with overdue warnings
- **Assignments**: Assign tasks to predefined team members with email notifications
- **Task Filtering**: Filter tasks by status, priority, and search terms

### 💬 Communication
- **Comments System**: Add comments to tasks for team collaboration
- **User Tagging**: Tag team members using @username syntax (e.g., @huzaifa, @sarim)
- **Real-time Updates**: See comment counts and recent activity
- **Author Tracking**: Track who made each comment with timestamps
- **Email Notifications**: Automatic email alerts for task assignments, comments, and tags

### 🎨 Beautiful UI/UX
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Color-coded System**: Visual indicators for priorities, statuses, and deadlines
- **Interactive Elements**: Hover effects, smooth transitions, and intuitive navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nyrix-project-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: Supabase (PostgreSQL)
- **Email Service**: EmailJS for notifications

## 👥 Team Members

The system comes pre-configured with four team members:

1. **Huzaifa** (huzaifa@nyrix.co)
2. **Sarim** (sarim@nyrix.co)  
3. **Talha** (talhaone1234@gmail.com)
4. **Hashir** (muhammadhashirsiddiqui2@gmail.com)

### Adding/Modifying Team Members
Edit `lib/team-members.ts` to add, remove, or modify team members.

## 📧 Email Notifications

### Setup Required
To enable email notifications, you need to:
1. Configure SMTP environment variables (see [SMTP_SETUP.md](./SMTP_SETUP.md))
2. Test the notification system

### What Triggers Emails
- **Task Assignment**: When a task is assigned to a team member
- **Comment Notifications**: When someone comments on a task assigned to you
- **Tag Notifications**: When someone tags you in a comment (special priority emails)

## 📱 Usage Guide

### Creating a Project
1. Click the "New Project" button on the dashboard
2. Fill in the project name (required) and description
3. Select the project status
4. Click "Create Project"

### Adding Tasks
1. Click on a project to view its tasks
2. Click "Add Task" button
3. Fill in task details:
   - Title (required)
   - Description
   - Priority level
   - Assignee (required) - Select from predefined team members
   - Deadline (optional)
4. Click "Create Task"
5. The assigned team member will receive an email notification

### Managing Task Status
1. Click the three-dot menu on any task card
2. Select "Change Status" to update task progress
3. Choose from: Todo, In Progress, Review, or Completed

### Adding Comments
1. Click on a task to open the detail view
2. Scroll to the comments section
3. Select your name from the team member dropdown
4. Enter your comment (use @username to tag team members)
5. Click the send button
6. The task assignee and any tagged users will receive email notifications

### Tagging Team Members
- **Syntax**: Use `@username` in your comment (e.g., "@huzaifa please review this")
- **Auto-complete**: Tag suggestions appear as you type
- **Notifications**: Tagged users receive special email notifications
- **Visual Display**: Tags are highlighted in comments with colored badges

### Filtering and Searching
- Use the search bar to find tasks by title, description, or assignee
- Filter tasks by status using the status tabs
- Filter by priority level
- See real-time counts for each filter option

## 🎨 Customization

### Colors and Themes
The application uses a consistent color system that can be easily customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... more shades
  }
}
```

### Adding New Features
The modular component structure makes it easy to add new features:
- New components can be added to the `components/` directory
- Types can be extended in `types/index.ts`
- Utility functions can be added to `utils/` directory

## 🔧 Project Structure

```
project-management-tool/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/             # React components
│   ├── CreateProjectModal.tsx
│   ├── CreateTaskModal.tsx
│   ├── DashboardStats.tsx
│   ├── ProjectCard.tsx
│   ├── TaskCard.tsx
│   ├── TaskDetailModal.tsx
│   └── TaskList.tsx
├── types/                  # TypeScript interfaces
│   └── index.ts
├── utils/                  # Utility functions
│   ├── helpers.ts         # Helper functions
│   └── storage.ts         # Local storage management
├── package.json
├── tailwind.config.js
└── README.md
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file for any environment-specific configuration:

```env
NEXT_PUBLIC_APP_NAME="Project Manager"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication and roles
- [ ] File attachments for tasks
- [ ] Email notifications
- [ ] Team collaboration features
- [ ] Advanced reporting and analytics
- [ ] Mobile app
- [ ] Dark mode theme
- [ ] Multi-language support

---

Built with ❤️ using Next.js and modern web technologies.

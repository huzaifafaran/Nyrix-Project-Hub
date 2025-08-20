# Supabase Database Setup

This guide will help you set up the Supabase database for your Nyrix Project Hub.

## 🚀 Quick Setup

### 1. Access Your Supabase Dashboard
- Go to [https://supabase.com](https://supabase.com)
- Sign in to your account
- Navigate to your project: `ymllzviqvocnknziordb`

### 2. Create Database Tables
- In your Supabase dashboard, go to **SQL Editor**
- Copy and paste the contents of `database-schema.sql`
- Click **Run** to execute the SQL

### 3. Verify Tables
- Go to **Table Editor** in your dashboard
- You should see three tables:
  - `projects`
  - `tasks` 
  - `comments`

## 📊 Database Schema

### Projects Table
- `id` - Unique identifier (UUID)
- `name` - Project name (required)
- `description` - Project description
- `status` - Project status (active, completed, on-hold)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Tasks Table
- `id` - Unique identifier (UUID)
- `project_id` - Reference to projects table
- `title` - Task title (required)
- `description` - Task description
- `status` - Task status (todo, in-progress, review, completed)
- `priority` - Task priority (low, medium, high, urgent)
- `assigned_to` - Person assigned to task (required)
- `deadline` - Task deadline
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Comments Table
- `id` - Unique identifier (UUID)
- `task_id` - Reference to tasks table
- `author` - Comment author name (required)
- `content` - Comment content (required)
- `created_at` - Creation timestamp

## 🔐 Row Level Security (RLS)

The database includes Row Level Security policies that allow public access for this demo application. In a production environment, you should implement proper authentication and authorization.

## 📝 Features

- **Automatic Timestamps**: `created_at` and `updated_at` are automatically managed
- **Cascading Deletes**: Deleting a project automatically deletes associated tasks and comments
- **Data Validation**: Check constraints ensure valid status and priority values
- **Performance Indexes**: Optimized queries for common operations

## 🧪 Testing

After setup, you can test the application:
1. Create a new project
2. Add tasks to the project
3. Add comments to tasks
4. Verify data persistence across page refreshes

## 🔧 Troubleshooting

### Common Issues:
1. **Permission Denied**: Ensure RLS policies are enabled and configured
2. **Table Not Found**: Verify the SQL schema was executed successfully
3. **Connection Error**: Check your Supabase URL and API key

### Need Help?
- Check Supabase logs in the dashboard
- Verify your API credentials in `lib/supabase.ts`
- Ensure all tables were created successfully

## 🚀 Next Steps

Once the database is set up:
1. Start your development server: `npm run dev`
2. Test creating projects, tasks, and comments
3. Verify data is being stored in Supabase
4. Check the real-time functionality

Your Nyrix Project Hub is now powered by a robust PostgreSQL database! 🎉

import { Project, Task } from '@/types';
import { FolderOpen, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  projects: Project[];
  tasks: Task[];
}

export default function DashboardStats({ projects, tasks }: DashboardStatsProps) {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overdueTasks = tasks.filter(task => 
    task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed'
  ).length;
  const activeProjects = projects.filter(project => project.status === 'active').length;

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Overdue Tasks',
      value: overdueTasks,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

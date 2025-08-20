import { Project } from '@/types';
import { Calendar, Users, CheckCircle, Clock, AlertTriangle, Edit } from 'lucide-react';
import { formatDate, getProjectStatusColor, generateGradient, truncateText, isOverdue } from '@/utils/helpers';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: (project: Project) => void;
}

export default function ProjectCard({ project, onClick, onEdit }: ProjectCardProps) {
  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const overdueTasks = project.tasks.filter(task => 
    task.deadline && isOverdue(task.deadline) && task.status !== 'completed'
  ).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'on-hold':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div 
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${generateGradient(project.id)} flex items-center justify-center text-white font-bold text-lg`}>
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit Project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1">
            {getStatusIcon(project.status)}
            <span className={`badge border ${getProjectStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {project.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {truncateText(project.description, 100)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} tasks</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Project Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(project.updatedAt)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{totalTasks} task{totalTasks !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Overdue Warning */}
      {overdueTasks > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

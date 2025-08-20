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
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer group p-4 sm:p-6"
      onClick={onClick}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${generateGradient(project.id)} flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0`}>
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
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
            <span className={`badge border text-xs ${getProjectStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {project.name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
          {truncateText(project.description, 80)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} tasks</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Project Stats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="truncate">{formatDate(project.updatedAt)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{totalTasks} task{totalTasks !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Overdue Warning */}
      {overdueTasks > 0 && (
        <div className="mt-3 sm:mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">
              {overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

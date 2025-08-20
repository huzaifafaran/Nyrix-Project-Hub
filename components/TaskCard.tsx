import { useState, useEffect } from 'react';
import { Calendar, User, MessageCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Task } from '@/types';
import { formatDate, formatRelativeDate, getPriorityColor, getStatusColor, getInitials, isOverdue } from '@/utils/helpers';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isTaskOverdue, setIsTaskOverdue] = useState(false);

  // Check if task is overdue
  useEffect(() => {
    if (task.deadline && isOverdue(task.deadline) && task.status !== 'completed') {
      setIsTaskOverdue(true);
    }
  }, [task.deadline, task.status]);

  const getStatusOptions = () => {
    const options = [
      { value: 'todo', label: 'Todo', color: 'bg-gray-100 text-gray-800' },
      { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      { value: 'review', label: 'Review', color: 'bg-purple-100 text-purple-800' },
      { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    ];
    
    return options.filter(option => option.value !== task.status);
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task.id, newStatus);
    setShowMenu(false);
  };

  const getDeadlineDisplay = () => {
    if (!task.deadline) return null;
    
    const deadline = new Date(task.deadline);
    const isTaskOverdue = isOverdue(deadline) && task.status !== 'completed';
    
    return (
      <div className={`flex items-center space-x-1 text-xs sm:text-sm ${
        isTaskOverdue ? 'text-red-600' : 'text-gray-500'
      }`}>
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className={isTaskOverdue ? 'font-medium' : ''}>
          {isTaskOverdue ? 'Overdue' : formatRelativeDate(deadline)}
        </span>
      </div>
    );
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-200 group p-4 sm:p-6 cursor-pointer" onClick={onEdit}>
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <span className={`badge border text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`badge border text-xs ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
        
        {/* Action Menu */}
        <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              {/* Status Change Options */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Change Status
                </p>
                {getStatusOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full text-left px-2 py-1 rounded text-xs sm:text-sm hover:bg-gray-50 ${option.color}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {/* Edit/Delete Options */}
              <button
                onClick={onEdit}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={onDelete}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Title */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Task Details */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {/* Assigned To */}
        {task.assignedTo && (
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-primary-700">
                  {getInitials(task.assignedTo)}
                </span>
              </div>
              <span className="truncate">{task.assignedTo}</span>
            </div>
          </div>
        )}

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            {getDeadlineDisplay()}
          </div>
        )}

        {/* Comments Count */}
        {task.comments && task.comments.length > 0 && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-xs text-primary-600 font-medium">
              Click to view
            </span>
          </div>
        )}
      </div>

      {/* Overdue Warning */}
      {isTaskOverdue && (
        <div className="mt-3 sm:mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <Calendar className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Task is overdue</span>
          </div>
        </div>
      )}
    </div>
  );
}

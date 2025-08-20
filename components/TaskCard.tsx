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
      <div className={`flex items-center space-x-1 text-sm ${
        isTaskOverdue ? 'text-red-600' : 'text-gray-500'
      }`}>
        <Calendar className="w-4 h-4" />
        <span className={isTaskOverdue ? 'font-medium' : ''}>
          {isTaskOverdue ? 'Overdue' : formatRelativeDate(deadline)}
        </span>
      </div>
    );
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-200 group">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`badge border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`badge border ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
        
        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              {/* Status Change Options */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Change Status
                </p>
                {getStatusOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-50 ${option.color}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {/* Edit/Delete Options */}
              <button
                onClick={onEdit}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Task</span>
              </button>
              <button
                onClick={onDelete}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Content */}
      <div className="mb-4">
        <h3 
          onClick={onEdit}
          className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors cursor-pointer hover:text-primary-600"
        >
          {task.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {task.description}
        </p>
      </div>

      {/* Task Meta */}
      <div className="space-y-3">
        {/* Assigned To */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {getInitials(task.assignedTo || 'Unknown')}
          </div>
          <span className="text-sm text-gray-600">{task.assignedTo || 'Unassigned'}</span>
        </div>

        {/* Deadline */}
        {getDeadlineDisplay()}

        {/* Comments Count */}
        <div 
          onClick={onEdit}
          className="flex items-center justify-between text-sm text-gray-500 cursor-pointer hover:text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
          </div>
          <span className="text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
            View
          </span>
        </div>
      </div>

      {/* Overdue Warning */}
      {isTaskOverdue && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Overdue since {formatDate(new Date(task.deadline!))}</span>
          </div>
        </div>
      )}
    </div>
  );
}

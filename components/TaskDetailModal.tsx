import { useState, useEffect } from 'react';
import { X, Edit, Trash2, MessageCircle, Send, Calendar, User, CheckSquare } from 'lucide-react';
import { Task, Comment, CommentFormData } from '@/types';
import { updateTask, deleteTask, addComment, deleteComment, getTasksWithComments } from '@/utils/supabase-storage';
import { formatDate, formatDateTime, getPriorityColor, getStatusColor, getInitials } from '@/utils/helpers';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onTaskUpdated: () => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskDetailModal({ isOpen, task, onClose, onTaskUpdated, onTaskDeleted }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Task | null>(null);
  const [commentForm, setCommentForm] = useState<CommentFormData>({
    content: '',
    author: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    if (task) {
      setEditForm({ ...task });
      setCurrentTask(task);
    }
  }, [task]);

  // Refresh task data to get latest comments
  const refreshTask = async () => {
    if (task) {
      try {
        const allTasks = await getTasksWithComments();
        const updatedTask = allTasks.find(t => t.id === task.id);
        if (updatedTask) {
          setCurrentTask(updatedTask);
          setEditForm(updatedTask);
        }
      } catch (error) {
        console.error('Error refreshing task:', error);
      }
    }
  };

  if (!isOpen || !task || !currentTask) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ ...currentTask });
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedTask = await updateTask(task.id, {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        assignedTo: editForm.assignedTo,
        deadline: editForm.deadline,
        status: editForm.status,
      });
      
      if (!updatedTask) {
        throw new Error('Failed to update task');
      }
      
      setIsEditing(false);
      await refreshTask();
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await onTaskDeleted(task.id);
        onClose();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.content?.trim() || !commentForm.author?.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const newComment = await addComment({
        taskId: task.id,
        content: commentForm.content,
        author: commentForm.author,
      });
      
      if (!newComment) {
        throw new Error('Failed to add comment');
      }
      
      setCommentForm({ content: '', author: '' });
      await refreshTask();
      onTaskUpdated();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        const deleted = await deleteComment(commentId);
        if (deleted) {
          await refreshTask();
          onTaskUpdated();
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const getStatusOptions = () => [
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
  ];

  const getPriorityOptions = () => [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Task' : 'Task Details'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            /* Edit Form */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={editForm?.title || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editForm?.status || 'todo'}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                    className="input-field"
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editForm?.priority || 'medium'}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
                    className="input-field"
                  >
                    {getPriorityOptions().map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To *</label>
                  <input
                    type="text"
                    value={editForm?.assignedTo || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, assignedTo: e.target.value } : null)}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={editForm?.deadline ? new Date(editForm.deadline).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditForm(prev => prev ? { 
                      ...prev, 
                      deadline: e.target.value ? new Date(e.target.value) : null 
                    } : null)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editForm?.description || ''}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="input-field resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                                 <button
                   onClick={handleSaveEdit}
                   className="btn-primary"
                   disabled={isSubmitting || !editForm?.title?.trim() || !editForm?.assignedTo?.trim()}
                 >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            /* Task Details View */
            <div className="space-y-6">
              {/* Task Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentTask.title}</h3>
                  <p className="text-gray-600">{currentTask.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className={`badge border ${getPriorityColor(currentTask.priority)}`}>
                      {currentTask.priority}
                    </span>
                    <span className={`badge border ${getStatusColor(currentTask.status)}`}>
                      {currentTask.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{currentTask.assignedTo || 'Unassigned'}</span>
                  </div>
                  
                  {currentTask.deadline && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(new Date(currentTask.deadline))}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comments ({currentTask.comments.length})</span>
                </h4>
                
                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={commentForm.author}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, author: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentForm.content}
                          onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                          className="input-field flex-1"
                          required
                        />
                        <button
                          type="submit"
                          className="btn-primary px-4"
                          disabled={isSubmitting || !commentForm.content?.trim() || !commentForm.author?.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                
                {/* Comments List */}
                <div className="space-y-4">
                  {currentTask.comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                  ) : (
                    currentTask.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {getInitials(comment.author || 'Unknown')}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{comment.author || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{formatDateTime(new Date(comment.createdAt))}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCommentDelete(comment.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-700 mt-3">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

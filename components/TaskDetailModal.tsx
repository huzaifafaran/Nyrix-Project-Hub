import { useState, useEffect } from 'react';
import { X, Edit, Trash2, MessageCircle, Send, Calendar, User, CheckSquare } from 'lucide-react';
import { Task, Comment, CommentFormData } from '@/types';
import { updateTask, deleteTask, addComment, deleteComment, getTasksWithComments } from '@/utils/supabase-storage';
import { formatDate, formatDateTime, getPriorityColor, getStatusColor, getInitials } from '@/utils/helpers';
import { TEAM_MEMBERS } from '@/lib/team-members';
import { sendCommentNotificationEmail, sendTagNotificationEmail } from '@/lib/email-service';
import { parseTagsFromContent } from '@/utils/tag-parser';

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
    tags: [],
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
      // Parse tags from comment content
      const tags = parseTagsFromContent(commentForm.content);
      
      const newComment = await addComment({
        taskId: task.id,
        content: commentForm.content,
        author: commentForm.author,
        tags: tags,
      });
      
      if (!newComment) {
        throw new Error('Failed to add comment');
      }
      
      // Send email notification to task assignee if they exist
      if (currentTask.assignedTo && currentTask.assignedTo !== commentForm.author) {
        try {
          const assigneeMember = TEAM_MEMBERS.find(member => member.email === currentTask.assignedTo);
          const commentAuthorMember = TEAM_MEMBERS.find(member => member.email === commentForm.author);
          
          if (assigneeMember && commentAuthorMember) {
            await sendCommentNotificationEmail(
              assigneeMember.email,
              assigneeMember.name,
              currentTask.title,
              'Project', // We'll need to get the actual project name
              commentAuthorMember.name,
              commentForm.content
            );
          }
        } catch (emailError) {
          console.warn('Failed to send comment notification email:', emailError);
        }
      }
      
      // Send tag notifications to all tagged users
      for (const tagEmail of tags) {
        try {
          const taggedMember = TEAM_MEMBERS.find(member => member.email === tagEmail);
          const commentAuthorMember = TEAM_MEMBERS.find(member => member.email === commentForm.author);
          
          if (taggedMember && commentAuthorMember && tagEmail !== commentForm.author) {
            await sendTagNotificationEmail(
              taggedMember.email,
              taggedMember.name,
              currentTask.title,
              'Project', // We'll need to get the actual project name
              commentAuthorMember.name,
              commentForm.content
            );
          }
        } catch (emailError) {
          console.warn('Failed to send tag notification email:', emailError);
        }
      }
      
      setCommentForm({ content: '', author: '', tags: [] });
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
                  <select
                    value={editForm?.assignedTo || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, assignedTo: e.target.value } : null)}
                    className="input-field"
                    required
                  >
                    <option value="">Select team member</option>
                    {TEAM_MEMBERS.map((member) => (
                      <option key={member.id} value={member.email}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
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
                      <select
                        value={commentForm.author}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, author: e.target.value }))}
                        className="input-field"
                        required
                      >
                        <option value="">Select team member</option>
                        {TEAM_MEMBERS.map((member) => (
                          <option key={member.id} value={member.email}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Add a comment... Use @username to tag team members"
                            value={commentForm.content}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                            className="input-field w-full"
                            required
                          />
                          {/* Tag suggestions */}
                          {commentForm.content.includes('@') && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                              {TEAM_MEMBERS
                                .filter(member => 
                                  member.id.toLowerCase().includes(
                                    commentForm.content.substring(
                                      commentForm.content.lastIndexOf('@') + 1
                                    ).toLowerCase()
                                  ) ||
                                  member.name.toLowerCase().includes(
                                    commentForm.content.substring(
                                      commentForm.content.lastIndexOf('@') + 1
                                    ).toLowerCase()
                                  )
                                )
                                .map((member) => (
                                  <button
                                    key={member.id}
                                    type="button"
                                    onClick={() => {
                                      const beforeTag = commentForm.content.substring(
                                        0,
                                        commentForm.content.lastIndexOf('@')
                                      );
                                      const afterTag = commentForm.content.substring(
                                        commentForm.content.lastIndexOf('@') + 
                                        commentForm.content.substring(
                                          commentForm.content.lastIndexOf('@') + 1
                                        ).indexOf(' ') + 1
                                      );
                                      const newContent = beforeTag + '@' + member.id + ' ' + afterTag;
                                      setCommentForm(prev => ({ ...prev, content: newContent }));
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2"
                                  >
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">
                                      {member.initials}
                                    </div>
                                    <span className="font-medium">{member.name}</span>
                                    <span className="text-gray-500 text-sm">@{member.id}</span>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="btn-primary px-4"
                          disabled={isSubmitting || !commentForm.content?.trim() || !commentForm.author?.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Tag help text */}
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Type @ followed by a team member's name to tag them (e.g., @huzaifa, @sarim)
                      </p>
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
                        <p className="text-gray-700 mt-3" dangerouslySetInnerHTML={{ 
                          __html: comment.content.replace(
                            /@(\w+)/g,
                            (match, username) => {
                              const member = TEAM_MEMBERS.find(m => 
                                m.id.toLowerCase() === username.toLowerCase() ||
                                m.name.toLowerCase() === username.toLowerCase()
                              );
                              
                              if (member) {
                                return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">@${member.name}</span>`;
                              }
                              
                              return match;
                            }
                          )
                        }} />
                        {/* Show tags if any */}
                        {comment.tags && comment.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {comment.tags.map((tag, index) => {
                              const member = TEAM_MEMBERS.find(m => m.email === tag);
                              return member ? (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                  Tagged: {member.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
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

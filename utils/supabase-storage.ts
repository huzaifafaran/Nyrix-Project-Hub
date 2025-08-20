import { supabase } from '@/lib/supabase';
import { Project, Task, Comment, ProjectFormData } from '@/types';

// Projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(project => ({
      ...project,
      createdAt: new Date(project.created_at),
      updatedAt: new Date(project.updated_at),
      tasks: [] // Will be populated separately
    })) || [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

export const saveProjects = async (projects: Project[]): Promise<void> => {
  // This function is not needed with Supabase as data is saved directly
  console.log('saveProjects not needed with Supabase');
};

export const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: project.name,
        description: project.description,
        status: project.status
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      tasks: []
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};



export const updateProject = async (projectId: string, updates: Partial<ProjectFormData>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
        description: updates.description,
        status: updates.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(task => ({
      ...task,
      projectId: task.project_id,
      assignedTo: task.assigned_to,
      deadline: task.deadline ? new Date(task.deadline) : null,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
      comments: [] // Will be populated separately
    })) || [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  // This function is not needed with Supabase as data is saved directly
  console.log('saveTasks not needed with Supabase');
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Task> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigned_to: task.assignedTo,
        deadline: task.deadline
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      projectId: data.project_id,
      deadline: data.deadline ? new Date(data.deadline) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      comments: []
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const getTasksWithComments = async (): Promise<Task[]> => {
  try {
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (tasksError) throw tasksError;

    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (commentsError) throw commentsError;

    return tasks?.map(task => ({
      ...task,
      projectId: task.project_id,
      assignedTo: task.assigned_to,
      deadline: task.deadline ? new Date(task.deadline) : null,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
      comments: comments?.filter(comment => comment.task_id === task.id).map(comment => ({
        ...comment,
        taskId: comment.task_id,
        createdAt: new Date(comment.created_at)
      })) || []
    })) || [];
  } catch (error) {
    console.error('Error loading tasks with comments:', error);
    return [];
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assigned_to: updates.assignedTo,
        deadline: updates.deadline
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      projectId: data.project_id,
      assignedTo: data.assigned_to,
      deadline: data.deadline ? new Date(data.deadline) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      comments: []
    };
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

// Comments
export const getComments = async (): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(comment => ({
      ...comment,
      taskId: comment.task_id,
      createdAt: new Date(comment.created_at)
    })) || [];
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
};

export const saveComments = async (comments: Comment[]): Promise<void> => {
  // This function is not needed with Supabase as data is saved directly
  console.log('saveComments not needed with Supabase');
};

export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        task_id: comment.taskId,
        author: comment.author,
        content: comment.content
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      taskId: data.task_id,
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

export const deleteCommentsForTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('task_id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting comments for task:', error);
    return false;
  }
};

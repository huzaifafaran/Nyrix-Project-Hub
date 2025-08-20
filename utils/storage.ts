import { Project, Task, Comment } from '@/types';

// Local storage keys
const PROJECTS_KEY = 'project-management-projects';
const TASKS_KEY = 'project-management-tasks';
const COMMENTS_KEY = 'project-management-comments';

// Projects
export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (!stored) return [];
    
    const projects = JSON.parse(stored);
    return projects.map((project: any) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects:', error);
  }
};

export const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>): Project => {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  };
  
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
};

export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  saveProjects(projects);
  return projects[index];
};

export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length === projects.length) return false;
  
  saveProjects(filtered);
  return true;
};

// Tasks
export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    return tasks.map((task: any) => ({
      ...task,
      deadline: task.deadline ? new Date(task.deadline) : null,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const getTasksWithComments = (): Task[] => {
  const tasks = getTasks();
  const comments = getComments();
  
  return tasks.map(task => ({
    ...task,
    comments: comments.filter(comment => comment.taskId === task.id)
  }));
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  saveTasks(tasks);
  return tasks[index];
};

export const updateTaskWithComments = (id: string, updates: Partial<Task>): Task | null => {
  const tasks = getTasks();
  const comments = getComments();
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  saveTasks(tasks);
  
  // Return task with comments
  return {
    ...tasks[index],
    comments: comments.filter(c => c.taskId === id)
  };
};

export const deleteTask = (id: string): boolean => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  
  if (filtered.length === tasks.length) return false;
  
  saveTasks(filtered);
  
  // Also delete associated comments
  deleteCommentsForTask(id);
  
  return true;
};

// Comments
export const getComments = (): Comment[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (!stored) return [];
    
    const comments = JSON.parse(stored);
    return comments.map((comment: any) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
    }));
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
};

export const saveComments = (comments: Comment[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  } catch (error) {
    console.error('Error saving comments:', error);
  }
};

export const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
  const comments = getComments();
  const newComment: Comment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  
  comments.push(newComment);
  saveComments(comments);
  return newComment;
};

export const deleteComment = (id: string): boolean => {
  const comments = getComments();
  const filtered = comments.filter(c => c.id !== id);
  
  if (filtered.length === comments.length) return false;
  
  saveComments(filtered);
  return true;
};

export const deleteCommentsForTask = (taskId: string): boolean => {
  const comments = getComments();
  const filtered = comments.filter(c => c.taskId !== taskId);
  
  if (filtered.length === comments.length) return false;
  
  saveComments(filtered);
  return true;
};

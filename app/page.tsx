'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderOpen, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { Project, Task } from '@/types';
import { getProjects, getTasksWithComments } from '@/utils/supabase-storage';
import { formatDate, isOverdue } from '@/utils/helpers';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import TaskList from '@/components/TaskList';
import DashboardStats from '@/components/DashboardStats';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedProjects = await getProjects();
      const storedTasks = await getTasksWithComments();
      
      // Link tasks to projects
      const projectsWithTasks = storedProjects.map(project => ({
        ...project,
        tasks: storedTasks.filter(task => task.projectId === project.id)
      }));
      
      setProjects(projectsWithTasks);
      setTasks(storedTasks);
    } catch (error) {
      console.error('Error loading data:', error);
      setProjects([]);
      setTasks([]);
    }
  };

  const handleProjectCreated = async () => {
    setIsCreateModalOpen(false);
    try {
      await loadData();
    } catch (error) {
      console.error('Error reloading data after project creation:', error);
    }
  };

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleProjectUpdated = async () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
    try {
      await loadData();
    } catch (error) {
      console.error('Error reloading data after project update:', error);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
              <TaskList 
          project={selectedProject}
          onBack={handleBackToDashboard}
          onTaskUpdate={async () => await loadData()}
        />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
                             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Nyrix Project Hub</h1>
                 <p className="text-sm text-gray-500">Streamline your workflow, amplify your success</p>
               </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <DashboardStats projects={projects} tasks={tasks} />

        {/* Projects Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Nyrix Project Hub!</h3>
              <p className="text-gray-500 mb-2">Get started by creating your first project</p>
              <p className="text-xs text-primary-600 mb-6">Organize, track, and collaborate with ease</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectSelect(project)}
                  onEdit={handleProjectEdit}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={editingProject}
        onProjectUpdated={handleProjectUpdated}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Nyrix Project Hub</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Streamline your workflow, amplify your success</p>
            <p className="text-xs text-gray-400">© 2025 Nyrix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

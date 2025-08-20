'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderOpen, CheckCircle, Clock, Users, TrendingUp, Menu } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Nyrix Project Hub</h1>
                <p className="text-xs sm:text-sm text-gray-500">Streamline your workflow, amplify your success</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Nyrix</h1>
              </div>
            </div>

            {/* Create Project Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-3 py-4">
          <div className="flex flex-col space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{tasks.length}</span> total task{tasks.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Dashboard Stats */}
        <DashboardStats projects={projects} tasks={tasks} />

        {/* Projects Section */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Your Projects</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Welcome to Nyrix Project Hub!</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-2">Get started by creating your first project</p>
              <p className="text-xs text-primary-600 mb-4 sm:mb-6">Organize, track, and collaborate with ease</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        project={editingProject}
        onClose={() => setIsEditModalOpen(false)}
        onProjectUpdated={handleProjectUpdated}
      />
    </div>
  );
}

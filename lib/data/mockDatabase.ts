import { create } from "zustand"
import { persist } from "zustand/middleware"
import { portfolioData } from "./portfolioData"

// Types for our database entities
export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  sourceUrl: string
  demoUrl: string
  image: string
}

// Mock database state
interface MockDatabaseState {
  projects: Project[]
  addProject: (project: Omit<Project, "id">) => Project
  updateProject: (id: string, project: Partial<Project>) => Project | null
  deleteProject: (id: string) => boolean
  getProject: (id: string) => Project | null
  getAllProjects: () => Project[]
}

// Create a store for our mock database with persistence
export const useMockDatabase = create<MockDatabaseState>()(
  persist(
    (set, get) => ({
      // Initialize with data from portfolioData
      projects: [...portfolioData.projects],

      // Add a new project
      addProject: (project) => {
        const id = generateId(project.name)
        const newProject = { ...project, id }

        set((state) => ({
          projects: [...state.projects, newProject],
        }))

        return newProject
      },

      // Update an existing project
      updateProject: (id, updates) => {
        const project = get().getProject(id)
        if (!project) return null

        const updatedProject = { ...project, ...updates }

        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        }))

        return updatedProject
      },

      // Delete a project
      deleteProject: (id) => {
        const exists = get().getProject(id) !== null

        if (exists) {
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
          }))
          return true
        }

        return false
      },

      // Get a project by ID
      getProject: (id) => {
        return get().projects.find((p) => p.id === id) || null
      },

      // Get all projects
      getAllProjects: () => {
        return get().projects
      },
    }),
    {
      name: "mock-database",
    },
  ),
)

// Helper function to generate an ID from a name
function generateId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Add a random suffix to ensure uniqueness
  const randomSuffix = Math.floor(Math.random() * 10000)
  return `${slug}-${randomSuffix}`
}

// Export a database interface for easy access
export const mockDb = {
  projects: {
    add: useMockDatabase.getState().addProject,
    update: useMockDatabase.getState().updateProject,
    delete: useMockDatabase.getState().deleteProject,
    get: useMockDatabase.getState().getProject,
    getAll: useMockDatabase.getState().getAllProjects,
  },
}

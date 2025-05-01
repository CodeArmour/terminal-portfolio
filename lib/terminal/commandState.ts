import { create } from "zustand"
import { mockDb } from "@/lib/data/mockDatabase"

// Define the possible command states
export type CommandStateType = "idle" | "add_project" | "edit_project" | "delete_project"

// Define the steps for adding a project
export type AddProjectStep = "name" | "description" | "technologies" | "source_url" | "demo_url" | "image"

// Define the steps for editing a project
export type EditProjectStep = "select_project" | "select_field" | "edit_field"

// Define the steps for deleting a project
export type DeleteProjectStep = "select_project" | "confirm"

// Define the command state
interface CommandState {
  // Current command state
  state: CommandStateType
  // Current step in the add project flow
  addProjectStep: AddProjectStep
  // Current step in the edit project flow
  editProjectStep: EditProjectStep
  // Current step in the delete project flow
  deleteProjectStep: DeleteProjectStep
  // Temporary storage for project data
  projectData: {
    id?: string
    name: string
    description: string
    technologies: string[]
    sourceUrl: string
    demoUrl: string
    image: string
  }
  // Field being edited
  editField: string
  // Set the command state
  setState: (state: CommandStateType) => void
  // Set the add project step
  setAddProjectStep: (step: AddProjectStep) => void
  // Set the edit project step
  setEditProjectStep: (step: EditProjectStep) => void
  // Set the delete project step
  setDeleteProjectStep: (step: DeleteProjectStep) => void
  // Update project data
  updateProjectData: (data: Partial<CommandState["projectData"]>) => void
  // Set the field being edited
  setEditField: (field: string) => void
  // Reset the command state
  reset: () => void
}

// Initial project data
const initialProjectData = {
  name: "",
  description: "",
  technologies: [],
  sourceUrl: "",
  demoUrl: "",
  image: "",
}

// Create the command state store
export const useCommandState = create<CommandState>((set) => ({
  state: "idle",
  addProjectStep: "name",
  editProjectStep: "select_project",
  deleteProjectStep: "select_project",
  projectData: { ...initialProjectData },
  editField: "",

  setState: (state) => set({ state }),

  setAddProjectStep: (step) => set({ addProjectStep: step }),

  setEditProjectStep: (step) => set({ editProjectStep: step }),

  setDeleteProjectStep: (step) => set({ deleteProjectStep: step }),

  updateProjectData: (data) =>
    set((state) => ({
      projectData: { ...state.projectData, ...data },
    })),

  setEditField: (field) => set({ editField: field }),

  reset: () =>
    set({
      state: "idle",
      addProjectStep: "name",
      editProjectStep: "select_project",
      deleteProjectStep: "select_project",
      projectData: { ...initialProjectData },
      editField: "",
    }),
}))

// Helper function to get all project IDs
export function getAllProjectIds(): string[] {
  return mockDb.projects.getAll().map((project) => project.id)
}

// Helper function to get project by ID
export function getProjectById(id: string) {
  return mockDb.projects.get(id)
}

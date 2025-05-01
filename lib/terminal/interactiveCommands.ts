import type React from "react"
import type { useCommandState, AddProjectStep, EditProjectStep, DeleteProjectStep } from "./commandState"
import { mockDb } from "@/lib/data/mockDatabase"
import { getAllProjectIds, getProjectById } from "./commandState"

// Result type for interactive commands
interface InteractiveCommandResult {
  complete: boolean
  prompt?: string // Add a prompt field for the next input
}

// Handle interactive commands
export async function handleInteractiveCommand(
  input: string,
  commandState: ReturnType<typeof useCommandState>,
  addOutput: (content: string | React.ReactNode, type?: string) => void,
): Promise<InteractiveCommandResult> {
  const { state } = commandState

  // Handle add project command
  if (state === "add_project") {
    return handleAddProject(input, commandState, addOutput)
  }

  // Handle edit project command
  if (state === "edit_project") {
    return handleEditProject(input, commandState, addOutput)
  }

  // Handle delete project command
  if (state === "delete_project") {
    return handleDeleteProject(input, commandState, addOutput)
  }

  return { complete: true }
}

// Get the prompt text for each step of project creation
function getPromptForStep(step: AddProjectStep): string {
  switch (step) {
    case "name":
      return "project name (must not be empty):"
    case "description":
      return "project description (must not be empty):"
    case "technologies":
      return "technologies (comma-separated list):"
    case "source_url":
      return "source code URL:"
    case "demo_url":
      return "live demo URL:"
    case "image":
      return "image URL (or type 'default' for placeholder):"
    default:
      return "input:"
  }
}

// Get the prompt text for each step of project editing
function getPromptForEditStep(step: EditProjectStep, editField = ""): string {
  switch (step) {
    case "select_project":
      return "project ID to edit:"
    case "select_field":
      return "field to edit (name, description, technologies, source_url, demo_url, image):"
    case "edit_field":
      return `new value for ${editField}:`
    default:
      return "input:"
  }
}

// Get the prompt text for each step of project deletion
function getPromptForDeleteStep(step: DeleteProjectStep): string {
  switch (step) {
    case "select_project":
      return "project ID to delete:"
    case "confirm":
      return "confirm deletion (yes/no):"
    default:
      return "input:"
  }
}

// Handle add project command
async function handleAddProject(
  input: string,
  commandState: ReturnType<typeof useCommandState>,
  addOutput: (content: string | React.ReactNode, type?: string) => void,
): Promise<InteractiveCommandResult> {
  const { addProjectStep, projectData, updateProjectData, setAddProjectStep, reset } = commandState

  // Handle cancel command
  if (input.trim().toLowerCase() === "cancel") {
    addOutput("Project creation cancelled.")
    reset()
    return { complete: true }
  }

  // Handle each step of the add project flow
  switch (addProjectStep) {
    case "name":
      if (!input.trim()) {
        addOutput("Project name cannot be empty. Please try again.", "error")
        return { complete: false, prompt: getPromptForStep(addProjectStep) }
      }

      updateProjectData({ name: input.trim() })
      setAddProjectStep("description")

      return { complete: false, prompt: getPromptForStep("description") }

    case "description":
      if (!input.trim()) {
        addOutput("Project description cannot be empty. Please try again.", "error")
        return { complete: false, prompt: getPromptForStep(addProjectStep) }
      }

      updateProjectData({ description: input.trim() })
      setAddProjectStep("technologies")

      return { complete: false, prompt: getPromptForStep("technologies") }

    case "technologies":
      if (!input.trim()) {
        addOutput("Technologies cannot be empty. Please enter at least one technology.", "error")
        return { complete: false, prompt: getPromptForStep(addProjectStep) }
      }

      const technologies = input
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean)

      updateProjectData({ technologies })
      setAddProjectStep("source_url")

      return { complete: false, prompt: getPromptForStep("source_url") }

    case "source_url":
      if (!input.trim()) {
        addOutput("Source URL cannot be empty. Please enter a URL.", "error")
        return { complete: false, prompt: getPromptForStep(addProjectStep) }
      }

      updateProjectData({ sourceUrl: input.trim() })
      setAddProjectStep("demo_url")

      return { complete: false, prompt: getPromptForStep("demo_url") }

    case "demo_url":
      if (!input.trim()) {
        addOutput("Demo URL cannot be empty. Please enter a URL.", "error")
        return { complete: false, prompt: getPromptForStep(addProjectStep) }
      }

      updateProjectData({ demoUrl: input.trim() })
      setAddProjectStep("image")

      return { complete: false, prompt: getPromptForStep("image") }

    case "image":
      let imageUrl = input.trim()

      if (!imageUrl) {
        addOutput("Image URL cannot be empty. Please enter a URL or type 'default'.", "error")
        return { complete: false, prompt: getPromptForStep(addProjectStep) }
      }

      // Use a placeholder image if user types 'default'
      if (imageUrl.toLowerCase() === "default") {
        imageUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(projectData.name)}`
      }

      updateProjectData({ image: imageUrl })

      // Create the project in the mock database
      try {
        const newProject = mockDb.projects.add({
          name: projectData.name,
          description: projectData.description,
          technologies: projectData.technologies,
          sourceUrl: projectData.sourceUrl,
          demoUrl: projectData.demoUrl,
          image: imageUrl,
        })

        // Show success message with project details
        addOutput(
          `
<div class="bg-green-900/30 border border-green-500 p-4 rounded-md">
  <h3 class="text-xl font-bold text-green-400 mb-2">Project Added Successfully</h3>
  <div class="grid grid-cols-2 gap-2 mb-4">
    <div class="text-gray-400">Name:</div>
    <div class="text-white">${newProject.name}</div>
    <div class="text-gray-400">ID:</div>
    <div class="text-white">${newProject.id}</div>
  </div>
  <p class="text-white">Project has been added to the database.</p>
  <p class="text-slate-400 mt-2">You can view it with: cd projects/${newProject.id}</p>
</div>
        `,
          "html",
        )

        // Reset the command state
        reset()
        return { complete: true }
      } catch (error) {
        addOutput(`Error adding project: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
        reset()
        return { complete: true }
      }

    default:
      addOutput("Unknown step in project creation.", "error")
      reset()
      return { complete: true }
  }
}

// Handle edit project command
async function handleEditProject(
  input: string,
  commandState: ReturnType<typeof useCommandState>,
  addOutput: (content: string | React.ReactNode, type?: string) => void,
): Promise<InteractiveCommandResult> {
  const { editProjectStep, projectData, updateProjectData, setEditProjectStep, setEditField, editField, reset } =
    commandState

  // Handle cancel command
  if (input.trim().toLowerCase() === "cancel") {
    addOutput("Project editing cancelled.")
    reset()
    return { complete: true }
  }

  // Handle each step of the edit project flow
  switch (editProjectStep) {
    case "select_project":
      const projectId = input.trim()

      if (!projectId) {
        addOutput("Project ID cannot be empty. Please try again.", "error")
        return { complete: false, prompt: getPromptForEditStep(editProjectStep) }
      }

      // Check if project exists
      const project = getProjectById(projectId)
      if (!project) {
        // Show available projects
        const availableProjects = getAllProjectIds()
        addOutput(
          `Project with ID "${projectId}" not found. Available projects: ${availableProjects.join(", ")}`,
          "error",
        )
        return { complete: false, prompt: getPromptForEditStep(editProjectStep) }
      }

      // Store project data
      updateProjectData({
        id: project.id,
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        sourceUrl: project.sourceUrl,
        demoUrl: project.demoUrl,
        image: project.image,
      })

      // Show project details
      addOutput(
        `
<div class="bg-blue-900/30 border border-blue-500 p-4 rounded-md">
  <h3 class="text-xl font-bold text-blue-400 mb-2">Editing Project: ${project.name}</h3>
  <div class="grid grid-cols-2 gap-2 mb-4">
    <div class="text-gray-400">ID:</div>
    <div class="text-white">${project.id}</div>
    <div class="text-gray-400">Name:</div>
    <div class="text-white">${project.name}</div>
    <div class="text-gray-400">Description:</div>
    <div class="text-white">${project.description}</div>
    <div class="text-gray-400">Technologies:</div>
    <div class="text-white">${project.technologies.join(", ")}</div>
    <div class="text-gray-400">Source URL:</div>
    <div class="text-white">${project.sourceUrl}</div>
    <div class="text-gray-400">Demo URL:</div>
    <div class="text-white">${project.demoUrl}</div>
  </div>
</div>
        `,
        "html",
      )

      setEditProjectStep("select_field")
      return { complete: false, prompt: getPromptForEditStep("select_field") }

    case "select_field":
      const field = input.trim().toLowerCase()
      const validFields = ["name", "description", "technologies", "source_url", "demo_url", "image"]

      if (!validFields.includes(field)) {
        addOutput(`Invalid field: "${field}". Please choose from: ${validFields.join(", ")}`, "error")
        return { complete: false, prompt: getPromptForEditStep(editProjectStep) }
      }

      setEditField(field)
      setEditProjectStep("edit_field")
      return { complete: false, prompt: getPromptForEditStep("edit_field", field) }

    case "edit_field":
      const newValue = input.trim()

      if (!newValue) {
        addOutput("Value cannot be empty. Please try again.", "error")
        return { complete: false, prompt: getPromptForEditStep(editProjectStep, editField) }
      }

      // Update the project data based on the field
      if (editField === "technologies") {
        const techArray = newValue
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean)

        updateProjectData({ technologies: techArray })
      } else if (editField === "name") {
        updateProjectData({ name: newValue })
      } else if (editField === "description") {
        updateProjectData({ description: newValue })
      } else if (editField === "source_url") {
        updateProjectData({ sourceUrl: newValue })
      } else if (editField === "demo_url") {
        updateProjectData({ demoUrl: newValue })
      } else if (editField === "image") {
        let imageUrl = newValue
        if (imageUrl.toLowerCase() === "default") {
          imageUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(projectData.name)}`
        }
        updateProjectData({ image: imageUrl })
      }

      // Update the project in the database
      try {
        if (!projectData.id) {
          throw new Error("Project ID is missing")
        }

        const updatedProject = mockDb.projects.update(projectData.id, {
          name: projectData.name,
          description: projectData.description,
          technologies: projectData.technologies,
          sourceUrl: projectData.sourceUrl,
          demoUrl: projectData.demoUrl,
          image: projectData.image,
        })

        if (!updatedProject) {
          throw new Error("Failed to update project")
        }

        // Show success message
        addOutput(
          `
<div class="bg-green-900/30 border border-green-500 p-4 rounded-md">
  <h3 class="text-xl font-bold text-green-400 mb-2">Project Updated Successfully</h3>
  <div class="grid grid-cols-2 gap-2 mb-4">
    <div class="text-gray-400">Field:</div>
    <div class="text-white">${editField}</div>
    <div class="text-gray-400">New Value:</div>
    <div class="text-white">${editField === "technologies" ? projectData.technologies.join(", ") : newValue}</div>
  </div>
  <p class="text-white">Project "${updatedProject.name}" has been updated.</p>
  <p class="text-slate-400 mt-2">You can view it with: cd projects/${updatedProject.id}</p>
</div>
          `,
          "html",
        )

        // Reset the command state
        reset()
        return { complete: true }
      } catch (error) {
        addOutput(`Error updating project: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
        reset()
        return { complete: true }
      }

    default:
      addOutput("Unknown step in project editing.", "error")
      reset()
      return { complete: true }
  }
}

// Handle delete project command
async function handleDeleteProject(
  input: string,
  commandState: ReturnType<typeof useCommandState>,
  addOutput: (content: string | React.ReactNode, type?: string) => void,
): Promise<InteractiveCommandResult> {
  const { deleteProjectStep, projectData, updateProjectData, setDeleteProjectStep, reset } = commandState

  // Handle cancel command
  if (input.trim().toLowerCase() === "cancel") {
    addOutput("Project deletion cancelled.")
    reset()
    return { complete: true }
  }

  // Handle each step of the delete project flow
  switch (deleteProjectStep) {
    case "select_project":
      const projectId = input.trim()

      if (!projectId) {
        addOutput("Project ID cannot be empty. Please try again.", "error")
        return { complete: false, prompt: getPromptForDeleteStep(deleteProjectStep) }
      }

      // Check if project exists
      const project = getProjectById(projectId)
      if (!project) {
        // Show available projects
        const availableProjects = getAllProjectIds()
        addOutput(
          `Project with ID "${projectId}" not found. Available projects: ${availableProjects.join(", ")}`,
          "error",
        )
        return { complete: false, prompt: getPromptForDeleteStep(deleteProjectStep) }
      }

      // Store project data
      updateProjectData({
        id: project.id,
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        sourceUrl: project.sourceUrl,
        demoUrl: project.demoUrl,
        image: project.image,
      })

      // Show project details and ask for confirmation
      addOutput(
        `
<div class="bg-red-900/30 border border-red-500 p-4 rounded-md">
  <h3 class="text-xl font-bold text-red-400 mb-2">Delete Project: ${project.name}</h3>
  <div class="grid grid-cols-2 gap-2 mb-4">
    <div class="text-gray-400">ID:</div>
    <div class="text-white">${project.id}</div>
    <div class="text-gray-400">Name:</div>
    <div class="text-white">${project.name}</div>
    <div class="text-gray-400">Description:</div>
    <div class="text-white">${project.description}</div>
  </div>
  <p class="text-red-300 font-bold">Are you sure you want to delete this project? This action cannot be undone.</p>
</div>
        `,
        "html",
      )

      setDeleteProjectStep("confirm")
      return { complete: false, prompt: getPromptForDeleteStep("confirm") }

    case "confirm":
      const confirmation = input.trim().toLowerCase()

      if (confirmation !== "yes" && confirmation !== "no") {
        addOutput('Please type "yes" to confirm deletion or "no" to cancel.', "error")
        return { complete: false, prompt: getPromptForDeleteStep(deleteProjectStep) }
      }

      if (confirmation === "no") {
        addOutput("Project deletion cancelled.")
        reset()
        return { complete: true }
      }

      // Delete the project
      try {
        if (!projectData.id) {
          throw new Error("Project ID is missing")
        }

        const success = mockDb.projects.delete(projectData.id)

        if (!success) {
          throw new Error("Failed to delete project")
        }

        // Show success message
        addOutput(
          `
<div class="bg-green-900/30 border border-green-500 p-4 rounded-md">
  <h3 class="text-xl font-bold text-green-400 mb-2">Project Deleted Successfully</h3>
  <p class="text-white">Project "${projectData.name}" has been deleted.</p>
</div>
          `,
          "html",
        )

        // Reset the command state
        reset()
        return { complete: true }
      } catch (error) {
        addOutput(`Error deleting project: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
        reset()
        return { complete: true }
      }

    default:
      addOutput("Unknown step in project deletion.", "error")
      reset()
      return { complete: true }
  }
}

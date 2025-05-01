import type React from "react"
import { portfolioData } from "@/lib/data/portfolioData"
import { getCommand, getCommandsByCategory } from "@/lib/terminal/commands"
import { asciiArt } from "@/lib/terminal/asciiArt"
import { auth } from "@/lib/auth/mockAuth"
import { mockDb } from "@/lib/data/mockDatabase"
import { useCommandState, getAllProjectIds } from "@/lib/terminal/commandState"
import { useTerminalStore } from "@/lib/store/terminalStore"

// Update the CommandResult interface to include the path
interface CommandResult {
  output: string | React.ReactNode
  type?: string
  newPath?: string
  adminStatus?: boolean
  closeTerminal?: boolean
}

// Get theme colors for command output
function getThemeColors() {
  // Get the current theme from the terminal store
  const theme = useTerminalStore.getState().theme

  // Import theme colors from ThemeContext
  const themeColorMap = {
    dark: {
      primary: "text-[#00b4d8]",
      secondary: "text-gray-300",
      accent: "text-[#00b4d8]",
      bg: "bg-[#1e1e1e]",
      border: "border-gray-800",
      success: "text-green-400",
      error: "text-red-400",
      warning: "text-yellow-400",
      commandBg: "bg-[#1e1e1e]",
      commandBorder: "border-gray-800",
      successBg: "bg-green-900/30",
      successBorder: "border-green-500",
      errorBg: "bg-red-900/30",
      errorBorder: "border-red-500",
      infoBg: "bg-blue-900/30",
      infoBorder: "border-blue-500",
    },
    light: {
      primary: "text-[#0077b6]",
      secondary: "text-gray-700",
      accent: "text-[#0077b6]",
      bg: "bg-gray-50",
      border: "border-gray-300",
      success: "text-green-600",
      error: "text-red-600",
      warning: "text-yellow-600",
      commandBg: "bg-gray-50",
      commandBorder: "border-gray-300",
      successBg: "bg-green-100",
      successBorder: "border-green-500",
      errorBg: "bg-red-100",
      errorBorder: "border-red-500",
      infoBg: "bg-blue-100",
      infoBorder: "border-blue-500",
    },
    retro: {
      primary: "text-green-500",
      secondary: "text-green-400",
      accent: "text-green-500",
      bg: "bg-[#0a0a0a]",
      border: "border-green-900",
      success: "text-green-500",
      error: "text-red-500",
      warning: "text-yellow-500",
      commandBg: "bg-[#0a0a0a]",
      commandBorder: "border-green-900",
      successBg: "bg-green-900/30",
      successBorder: "border-green-500",
      errorBg: "bg-red-900/30",
      errorBorder: "border-red-500",
      infoBg: "bg-[#0a0a0a]",
      infoBorder: "border-green-500",
    },
    synthwave: {
      primary: "text-[#f72585]",
      secondary: "text-[#4cc9f0]",
      accent: "text-[#f72585]",
      bg: "bg-[#1e1e2e]",
      border: "border-[#6f42c1]",
      success: "text-[#4cc9f0]",
      error: "text-[#f72585]",
      warning: "text-[#ff9e00]",
      commandBg: "bg-[#1e1e2e]",
      commandBorder: "border-[#6f42c1]",
      successBg: "bg-[#4cc9f0]/20",
      successBorder: "border-[#4cc9f0]",
      errorBg: "bg-[#f72585]/20",
      errorBorder: "border-[#f72585]",
      infoBg: "bg-[#6f42c1]/20",
      infoBorder: "border-[#6f42c1]",
    },
    hacker: {
      primary: "text-green-500",
      secondary: "text-green-400",
      accent: "text-green-500",
      bg: "bg-[#0a0a0a]",
      border: "border-green-900",
      success: "text-green-500",
      error: "text-red-500",
      warning: "text-yellow-500",
      commandBg: "bg-[#0a0a0a]",
      commandBorder: "border-green-900",
      successBg: "bg-green-900/30",
      successBorder: "border-green-500",
      errorBg: "bg-red-900/30",
      errorBorder: "border-red-500",
      infoBg: "bg-[#0a0a0a]",
      infoBorder: "border-green-500",
    },
    ocean: {
      primary: "text-[#64ffda]",
      secondary: "text-blue-300",
      accent: "text-[#64ffda]",
      bg: "bg-[#112240]",
      border: "border-[#64ffda]",
      success: "text-[#64ffda]",
      error: "text-red-400",
      warning: "text-yellow-400",
      commandBg: "bg-[#112240]",
      commandBorder: "border-[#64ffda]",
      successBg: "bg-[#64ffda]/20",
      successBorder: "border-[#64ffda]",
      errorBg: "bg-red-900/30",
      errorBorder: "border-red-500",
      infoBg: "bg-blue-900/30",
      infoBorder: "border-[#64ffda]",
    },
    dracula: {
      primary: "text-[#bd93f9]",
      secondary: "text-[#f8f8f2]",
      accent: "text-[#ff79c6]",
      bg: "bg-[#44475a]",
      border: "border-[#bd93f9]",
      success: "text-[#50fa7b]",
      error: "text-[#ff5555]",
      warning: "text-[#f1fa8c]",
      commandBg: "bg-[#44475a]",
      commandBorder: "border-[#bd93f9]",
      successBg: "bg-[#50fa7b]/20",
      successBorder: "border-[#50fa7b]",
      errorBg: "bg-[#ff5555]/20",
      errorBorder: "border-[#ff5555]",
      infoBg: "bg-[#bd93f9]/20",
      infoBorder: "border-[#bd93f9]",
    },
    nord: {
      primary: "text-[#88c0d0]",
      secondary: "text-[#eceff4]",
      accent: "text-[#88c0d0]",
      bg: "bg-[#3b4252]",
      border: "border-[#88c0d0]",
      success: "text-[#a3be8c]",
      error: "text-[#bf616a]",
      warning: "text-[#ebcb8b]",
      commandBg: "bg-[#3b4252]",
      commandBorder: "border-[#88c0d0]",
      successBg: "bg-[#a3be8c]/20",
      successBorder: "border-[#a3be8c]",
      errorBg: "bg-[#bf616a]/20",
      errorBorder: "border-[#bf616a]",
      infoBg: "bg-[#88c0d0]/20",
      infoBorder: "border-[#88c0d0]",
    },
  }

  // Return colors for the current theme, fallback to dark theme
  return themeColorMap[theme] || themeColorMap.dark
}

// Main command handler
export async function executeCommand(input: string, currentPath: string, isAdmin: boolean): Promise<CommandResult> {
  const args = input.trim().split(/\s+/)
  const commandName = args[0].toLowerCase()

  // Handle empty command
  if (!commandName) {
    return { output: "" }
  }

  // Get command definition
  const command = getCommand(commandName)

  // If command not found
  if (!command) {
    return { output: `command not found: ${commandName}`, type: "error" }
  }

  // Check if command requires admin
  if (command.requiresAdmin && !isAdmin) {
    return { output: "Permission denied: Admin access required.", type: "error" }
  }

  // Execute command based on name
  switch (command.name) {
    case "help":
      return handleHelp(isAdmin)
    case "clear":
      return { output: "clear" } // Special case handled by Terminal component
    case "ls":
      return handleLs(currentPath, args[1])
    case "pwd":
      return handlePwd(currentPath)
    case "cd":
      return handleCd(currentPath, args[1])
    case "cat":
      return handleCat(currentPath, args[1])
    case "open":
      return handleOpen(currentPath, args[1])
    case "theme":
      if (args[1] === "ls" || args[1] === "list") {
        return handleThemeList()
      } else if (args[1] === "set") {
        return handleThemeSet(args[2])
      } else {
        return { output: "Usage: theme ls | theme set <name>", type: "error" }
      }
    case "themes":
      return handleThemeList() // Keep the 'themes' command as an alias
    case "whoami":
      return handleWhoami()
    case "login":
      return handleLogin(args[1], args[2])
    case "logout":
      return handleLogout()
    case "date":
      return handleDate()
    case "banner":
      return { output: asciiArt }
    case "exit":
      return { output: "Closing terminal...", closeTerminal: true }
    case "add":
      return handleAdd(args[1], args.slice(2).join(" "))
    case "edit":
      return handleEdit(args[1], args.slice(2).join(" "))
    case "delete":
      return handleDelete(args[1], args.slice(2).join(" "))
    case "matrix":
      return { output: "Starting Matrix mode...\n\nJust kidding! But that would be cool, right?", type: "system" }
    case "sudo":
      return {
        output:
          args[1] === "hire-me"
            ? "Excellent choice! Sending job offer...\n\nJust kidding, but I am available for work! Check out my contact info."
            : "Permission denied: Nice try!",
        type: "system",
      }
    default:
      return { output: `command not found: ${commandName}`, type: "error" }
  }
}

// Help command
function handleHelp(isAdmin: boolean): CommandResult {
  const colors = getThemeColors()

  const coreCommands = getCommandsByCategory("core")
    .filter((cmd) => !cmd.requiresAdmin || isAdmin)
    .map(
      (cmd) =>
        `<div><span class="${colors.primary}">${cmd.usage}</span> <span class="${colors.secondary}">- ${cmd.description}</span></div>`,
    )
    .join("")

  const extendedCommands = getCommandsByCategory("extended")
    .filter((cmd) => !cmd.requiresAdmin || isAdmin)
    .map(
      (cmd) =>
        `<div><span class="${colors.primary}">${cmd.usage}</span> <span class="${colors.secondary}">- ${cmd.description}</span></div>`,
    )
    .join("")

  const adminCommands = isAdmin
    ? getCommandsByCategory("admin")
        .map(
          (cmd) =>
            `<div><span class="${colors.primary}">${cmd.usage}</span> <span class="${colors.secondary}">- ${cmd.description}</span></div>`,
        )
        .join("")
    : ""

  const output = `
<div class="space-y-4">
  <div>
    <h3 class="${colors.secondary} font-bold mb-2">CORE COMMANDS:</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
      ${coreCommands}
    </div>
  </div>
  
  <div>
    <h3 class="${colors.secondary} font-bold mb-2">EXTENDED COMMANDS:</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
      ${extendedCommands}
    </div>
  </div>
  
  ${
    isAdmin
      ? `
  <div>
    <h3 class="${colors.secondary} font-bold mb-2">ADMIN COMMANDS:</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
      ${adminCommands}
    </div>
  </div>
  `
      : `
  <div>
    <div><span class="${colors.primary}">login admin</span> - Log in as admin</div>
  </div>
  `
  }
  
  <div>
    <h3 class="${colors.secondary} font-bold mb-2">EASTER EGGS:</h3>
    <div>Try to find them! Hint: Try <span class="${colors.primary}">matrix</span> or <span class="${colors.primary}">sudo hire-me</span></div>
  </div>
</div>
`

  return { output, type: "html" }
}

// Whoami command - updated to use auth
async function handleWhoami(): Promise<CommandResult> {
  const colors = getThemeColors()
  const user = await auth.getUser()

  if (user) {
    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">User Information</h3>
  <div class="grid grid-cols-2 gap-2">
    <div class="${colors.secondary}">Name:</div>
    <div class="text-white">${user.name}</div>
    <div class="${colors.secondary}">Email:</div>
    <div class="text-white">${user.email}</div>
    <div class="${colors.secondary}">Role:</div>
    <div class="text-white">${user.role}</div>
  </div>
</div>
      `,
      type: "html",
    }
  }

  return { output: "guest" }
}

// Login command - updated to use auth
async function handleLogin(username?: string, password?: string): Promise<CommandResult> {
  const colors = getThemeColors()

  if (!username || !password) {
    return { output: "Usage: login <username> <password>", type: "error" }
  }

  const result = await auth.signIn(username, password)

  if (result.success) {
    return {
      output: `
<div class="${colors.successBg} ${colors.successBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">Access Granted</h3>
  <p class="text-white">Admin access granted. You now have access to admin commands.</p>
  <p class="${colors.secondary} mt-2">Type 'help' to see available admin commands.</p>
</div>
      `,
      type: "html",
      adminStatus: true,
    }
  }

  return {
    output: `
<div class="${colors.errorBg} ${colors.errorBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.error} mb-2">Access Denied</h3>
  <p class="text-white">Invalid credentials. Access denied.</p>
</div>
    `,
    type: "html",
  }
}

// Logout command - updated to use auth
async function handleLogout(): Promise<CommandResult> {
  const colors = getThemeColors()
  auth.signOut()

  return {
    output: `
<div class="${colors.infoBg} ${colors.infoBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.primary} mb-2">Logged Out</h3>
  <p class="text-white">You have been successfully logged out.</p>
</div>
    `,
    type: "html",
    adminStatus: false,
  }
}

// PWD command
function handlePwd(currentPath: string): CommandResult {
  return { output: currentPath }
}

// Date command
function handleDate(): CommandResult {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }
  return { output: now.toLocaleDateString(undefined, options) }
}

// List directory contents - updated to use mockDb
async function handleLs(currentPath: string, targetPath?: string): Promise<CommandResult> {
  const colors = getThemeColors()
  const path = resolvePath(currentPath, targetPath)

  // Root directory
  if (path === "/") {
    return {
      output: `
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
  <div class="flex items-center">
    <span class="${colors.primary} mr-2">📁</span>
    <span class="${colors.primary}">about/</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.primary} mr-2">📁</span>
    <span class="${colors.primary}">projects/</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.primary} mr-2">📁</span>
    <span class="${colors.primary}">skills/</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.primary} mr-2">📁</span>
    <span class="${colors.primary}">contact/</span>
  </div>
</div>
      `,
      type: "html",
    }
  }

  // About section
  if (path === "/about") {
    return {
      output: `
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">info.txt</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">experience.txt</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">education.txt</span>
  </div>
</div>
      `,
      type: "html",
    }
  }

  // Projects section - updated to use mockDb
  if (path === "/projects") {
    // Get all projects from the mock database
    const projects = mockDb.projects.getAll()

    const projectsList = projects
      .map(
        (project) => `
    <div class="flex flex-col ${colors.bg} rounded-lg p-3 border ${colors.border} hover:shadow-md transition-all">
      <div class="flex items-center mb-2">
        <span class="${colors.primary} mr-2">📁</span>
        <span class="${colors.primary} font-bold">${project.id}/</span>
      </div>
      <div class="text-xs ${colors.secondary} truncate">${project.description.substring(0, 60)}${project.description.length > 60 ? "..." : ""}</div>
      <div class="mt-2 flex flex-wrap gap-1">
        ${project.technologies
          .slice(0, 3)
          .map(
            (tech) => `<span class="px-1.5 py-0.5 text-xs rounded ${colors.commandBg} ${colors.accent}">${tech}</span>`,
          )
          .join("")}
        ${project.technologies.length > 3 ? `<span class="px-1.5 py-0.5 text-xs rounded ${colors.commandBg} ${colors.secondary}">+${project.technologies.length - 3}</span>` : ""}
      </div>
    </div>
  `,
      )
      .join("")

    return {
      output: `
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  ${projectsList || `<div class="${colors.secondary}">No projects found.</div>`}
</div>
    `,
      type: "html",
    }
  }

  // Individual project - updated to use mockDb
  if (path.startsWith("/projects/")) {
    const projectId = path.split("/")[2]
    const project = mockDb.projects.get(projectId)

    if (project) {
      return {
        output: `
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">info.txt</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.success} mr-2">🔗</span>
    <span class="${colors.success}">demo.link</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.success} mr-2">🔗</span>
    <span class="${colors.success}">source.link</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">image.jpg</span>
  </div>
</div>
        `,
        type: "html",
      }
    }
  }

  // Skills section
  if (path === "/skills") {
    return {
      output: `
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">technical.txt</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">soft.txt</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">tools.txt</span>
  </div>
</div>
      `,
      type: "html",
    }
  }

  // Contact section
  if (path === "/contact") {
    return {
      output: `
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">email.txt</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.warning} mr-2">📄</span>
    <span class="text-white">social.txt</span>
  </div>
  <div class="flex items-center">
    <span class="${colors.success} mr-2">🔗</span>
    <span class="${colors.success}">form.link</span>
  </div>
</div>
      `,
      type: "html",
    }
  }

  return { output: "Directory not found.", type: "error" }
}

// Change directory
function handleCd(currentPath: string, targetPath?: string): CommandResult {
  if (!targetPath) {
    return { output: "", newPath: "/" }
  }

  const newPath = resolvePath(currentPath, targetPath)

  // Check if path exists
  if (isValidPath(newPath)) {
    return { output: "", newPath }
  }

  return { output: `cd: ${targetPath}: No such directory`, type: "error" }
}

// Display file contents - updated to use mockDb for projects
async function handleCat(currentPath: string, fileName?: string): Promise<CommandResult> {
  const colors = getThemeColors()

  if (!fileName) {
    return { output: "Usage: cat <filename>", type: "error" }
  }

  const path = currentPath === "/" ? currentPath : `${currentPath}/`

  // About files
  if (path === "/about/" && fileName === "info.txt") {
    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">${portfolioData.about.name} - ${portfolioData.about.title}</h3>
  <p class="text-white">${portfolioData.about.summary}</p>
</div>
      `,
      type: "html",
    }
  }

  if (path === "/about/" && fileName === "experience.txt") {
    const experienceItems = portfolioData.about.experience
      .map(
        (exp) => `
      <div class="mb-4">
        <h4 class="font-bold ${colors.warning}">${exp.role} at ${exp.company}</h4>
        <p class="${colors.secondary}">${exp.period}</p>
        <p class="text-white mt-1">${exp.description}</p>
      </div>
    `,
      )
      .join("")

    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-4">Professional Experience</h3>
  ${experienceItems}
</div>
      `,
      type: "html",
    }
  }

  if (path === "/about/" && fileName === "education.txt") {
    const educationItems = portfolioData.about.education
      .map(
        (edu) => `
      <div class="mb-2">
        <h4 class="font-bold ${colors.warning}">${edu.degree}</h4>
        <p class="text-white">${edu.institution} (${edu.year})</p>
      </div>
    `,
      )
      .join("")

    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-4">Education</h3>
  ${educationItems}
</div>
      `,
      type: "html",
    }
  }

  // Project files - updated to use mockDb
  if (path.startsWith("/projects/")) {
    const projectId = path.split("/")[2]
    const project = mockDb.projects.get(projectId)

    if (project && fileName === "info.txt") {
      const technologies = project.technologies
        .map(
          (tech) =>
            `<span class="inline-block ${colors.bg} ${colors.primary} px-2 py-1 rounded text-xs mr-2 mb-2 border ${colors.border}">${tech}</span>`,
        )
        .join("")

      return {
        output: `
<div class="${colors.commandBg} rounded-lg overflow-hidden border ${colors.border} shadow-lg">
  <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
    <div class="absolute inset-0 bg-opacity-60 bg-black flex items-center justify-center">
      <h2 class="text-2xl font-bold text-white">${project.name}</h2>
    </div>
  </div>
  <div class="p-5">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
        <span class="w-3 h-3 rounded-full bg-green-500"></span>
      </div>
      <div class="${colors.secondary} text-sm">Project ID: ${project.id}</div>
    </div>
    
    <p class="text-white mb-6 leading-relaxed">${project.description}</p>
    
    <div class="mb-6">
      <h4 class="font-bold ${colors.warning} mb-3 flex items-center">
        <span class="mr-2">🛠️</span>Technologies
      </h4>
      <div class="flex flex-wrap">
        ${technologies}
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-3 mt-6">
      <a href="${project.demoUrl}" target="_blank" class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-center font-medium inline-flex items-center justify-center">
        <span class="mr-2">🚀</span> Live Demo
      </a>
      <a href="${project.sourceUrl}" target="_blank" class="flex-1 ${colors.bg} hover:bg-opacity-80 text-white px-4 py-2 rounded-lg border ${colors.border} text-center font-medium inline-flex items-center justify-center">
        <span class="mr-2">💻</span> Source Code
      </a>
    </div>
  </div>
  <div class="px-5 py-3 ${colors.bg} border-t ${colors.border} text-xs ${colors.secondary}">
    <div class="flex justify-between">
      <span>Type <code class="font-mono ${colors.primary}">cat image.jpg</code> to view project image</span>
      <span>Created: ${new Date().toLocaleDateString()}</span>
    </div>
  </div>
</div>
      `,
        type: "html",
      }
    }

    // Display project image
    if (project && fileName === "image.jpg") {
      return {
        output: `
<div class="${colors.commandBg} rounded-lg overflow-hidden border ${colors.border} shadow-lg">
  <div class="p-4 border-b ${colors.border}">
    <h3 class="text-xl font-bold ${colors.success}">${project.name} - Preview</h3>
  </div>
  <div class="p-4 flex justify-center">
    <div class="relative group">
      <img src="${project.image}" alt="${project.name}" class="max-w-full rounded-md border ${colors.border} shadow-md transition-all duration-300 group-hover:shadow-lg" />
      <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end justify-center p-4">
        <div class="text-white text-center">
          <div class="font-bold">${project.name}</div>
          <div class="text-sm">${project.technologies.slice(0, 3).join(", ")}${project.technologies.length > 3 ? "..." : ""}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="px-4 py-3 ${colors.bg} border-t ${colors.border} text-xs ${colors.secondary} flex justify-between">
    <span>Image preview</span>
    <a href="${project.demoUrl}" target="_blank" class="${colors.primary} hover:underline">Visit live project →</a>
  </div>
</div>
      `,
        type: "html",
      }
    }
  }

  // Skills files
  if (path === "/skills/" && fileName === "technical.txt") {
    const skills = portfolioData.skills.technical
      .map(
        (skill) =>
          `<span class="inline-block ${colors.bg} ${colors.primary} px-2 py-1 rounded text-xs mr-2 mb-2">${skill}</span>`,
      )
      .join("")

    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-4">Technical Skills</h3>
  <div class="flex flex-wrap">
    ${skills}
  </div>
</div>
      `,
      type: "html",
    }
  }

  if (path === "/skills/" && fileName === "soft.txt") {
    const skills = portfolioData.skills.soft
      .map(
        (skill) =>
          `<span class="inline-block ${colors.bg} ${colors.success} px-2 py-1 rounded text-xs mr-2 mb-2">${skill}</span>`,
      )
      .join("")

    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-4">Soft Skills</h3>
  <div class="flex flex-wrap">
    ${skills}
  </div>
</div>
    `,
      type: "html",
    }
  }

  if (path === "/skills/" && fileName === "tools.txt") {
    const tools = portfolioData.skills.tools
      .map(
        (tool) =>
          `<span class="inline-block ${colors.bg} ${colors.accent} px-2 py-1 rounded text-xs mr-2 mb-2">${tool}</span>`,
      )
      .join("")

    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-4">Tools & Technologies</h3>
  <div class="flex flex-wrap">
    ${tools}
  </div>
</div>
      `,
      type: "html",
    }
  }

  // Contact files
  if (path === "/contact/" && fileName === "email.txt") {
    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">Email Contact</h3>
  <a href="mailto:${portfolioData.contact.email}" class="${colors.primary} hover:underline">${portfolioData.contact.email}</a>
</div>
      `,
      type: "html",
    }
  }

  if (path === "/contact/" && fileName === "social.txt") {
    const socialLinks = Object.entries(portfolioData.contact.social)
      .map(
        ([platform, url]) => `
      <a href="${url}" target="_blank" class="flex items-center hover:${colors.bg} p-2 rounded transition-colors">
        <span class="w-6 h-6 ${colors.bg} rounded-full flex items-center justify-center mr-2">${platform[0].toUpperCase()}</span>
        <span class="text-white">${platform}:</span>
        <span class="${colors.primary} ml-2">${url.replace("https://", "")}</span>
      </a>
    `,
      )
      .join("")

    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-4">Social Media</h3>
  <div class="space-y-2">
    ${socialLinks}
  </div>
</div>
      `,
      type: "html",
    }
  }

  return { output: `cat: ${fileName}: No such file`, type: "error" }
}

// Open a file or project - updated to use mockDb
async function handleOpen(currentPath: string, target?: string): Promise<CommandResult> {
  const colors = getThemeColors()

  if (!target) {
    return { output: "Usage: open <file/project>", type: "error" }
  }

  const path = currentPath === "/" ? currentPath : `${currentPath}/`

  // Handle project demo
  if (path.startsWith("/projects/") && target === "demo.link") {
    const projectId = path.split("/")[2]
    const project = mockDb.projects.get(projectId)

    if (project && project.demoUrl) {
      return {
        output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">Opening Demo</h3>
  <p class="text-white mb-4">Opening demo for ${project.name}...</p>
  <a href="${project.demoUrl}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center">
    <span class="mr-2">🔗</span> Open Demo
  </a>
</div>
        `,
        type: "html",
      }
    }
  }

  // Handle project source
  if (path.startsWith("/projects/") && target === "source.link") {
    const projectId = path.split("/")[2]
    const project = mockDb.projects.get(projectId)

    if (project && project.sourceUrl) {
      return {
        output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">Opening Source Code</h3>
  <p class="text-white mb-4">Opening source code for ${project.name}...</p>
  <a href="${project.sourceUrl}" target="_blank" class="${colors.bg} hover:bg-opacity-80 text-white px-4 py-2 rounded inline-flex items-center">
    <span class="mr-2">💻</span> View Source Code
  </a>
</div>
        `,
        type: "html",
      }
    }
  }

  // Handle contact form
  if (path === "/contact/" && target === "form.link") {
    return {
      output: `
<div class="${colors.commandBg} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">Contact Form</h3>
  <p class="text-white mb-4">Opening contact form...</p>
  <a href="#contact" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center">
    <span class="mr-2">📝</span> Go to Contact Form
  </a>
</div>
      `,
      type: "html",
    }
  }

  return { output: `open: ${target}: No such file or link`, type: "error" }
}

// Handle theme set command
function handleThemeSet(themeName?: string): CommandResult {
  if (!themeName) {
    return { output: "Usage: theme set <name>", type: "error" }
  }

  const validThemes = ["dark", "light", "retro", "synthwave", "hacker", "ocean", "dracula", "nord"]

  if (validThemes.includes(themeName)) {
    return {
      output: `Theme set to ${themeName}. The entire portfolio will now use this theme.`,
    }
  } else {
    return {
      output: `Invalid theme: ${themeName}. Available themes: dark, light, retro, synthwave, hacker, ocean, dracula, nord`,
      type: "error",
    }
  }
}

// Handle theme list command
function handleThemeList(): CommandResult {
  const colors = getThemeColors()

  return {
    output: `
<div class="space-y-4">
  <h2 class="${colors.success} text-xl font-bold">Available Themes</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Dark Theme -->
    <div class="bg-[#121212] border border-gray-800 rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-[#00b4d8] font-bold">Dark</h3>
        <button class="bg-[#00b4d8] text-black px-3 py-1 rounded-md text-sm hover:bg-[#0096c7] transition-colors" 
                onclick="window.applyTheme && window.applyTheme('dark')">
          Apply
        </button>
      </div>
      <p class="text-gray-300">Modern dark theme with teal accents</p>
    </div>
    
    <!-- Light Theme -->
    <div class="bg-white border border-gray-300 rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-[#0077b6] font-bold">Light</h3>
        <button class="bg-[#0077b6] text-white px-3 py-1 rounded-md text-sm hover:bg-[#023e8a] transition-colors"
                onclick="window.applyTheme && window.applyTheme('light')">
          Apply
        </button>
      </div>
      <p class="text-gray-700">Clean light theme with blue accents</p>
    </div>
    
    <!-- Retro Theme -->
    <div class="bg-black border border-green-900 rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-green-500 font-bold">Retro</h3>
        <button class="bg-green-500 text-black px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                onclick="window.applyTheme && window.applyTheme('retro')">
          Apply
        </button>
      </div>
      <p class="text-green-400">Classic green on black terminal</p>
    </div>
    
    <!-- Synthwave Theme -->
    <div class="bg-[#1a1a2e] border border-[#6f42c1] rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-[#f72585] font-bold">Synthwave</h3>
        <button class="bg-[#f72585] text-white px-3 py-1 rounded-md text-sm hover:bg-[#b5179e] transition-colors"
                onclick="window.applyTheme && window.applyTheme('synthwave')">
          Apply
        </button>
      </div>
      <p class="text-[#4cc9f0]">Neon colors on dark background</p>
    </div>
    
    <!-- Hacker Theme -->
    <div class="bg-black border border-green-900 rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-green-500 font-bold">Hacker</h3>
        <button class="bg-green-500 text-black px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                onclick="window.applyTheme && window.applyTheme('hacker')">
          Apply
        </button>
      </div>
      <p class="text-green-400">Matrix-inspired hacker theme</p>
    </div>
    
    <!-- Ocean Theme -->
    <div class="bg-[#0a192f] border border-[#64ffda] rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-[#64ffda] font-bold">Ocean</h3>
        <button class="bg-[#64ffda] text-[#0a192f] px-3 py-1 rounded-md text-sm hover:bg-[#5cebcb] transition-colors"
                onclick="window.applyTheme && window.applyTheme('ocean')">
          Apply
        </button>
      </div>
      <p class="text-blue-300">Calming blue ocean theme</p>
    </div>
    
    <!-- Dracula Theme -->
    <div class="bg-[#282a36] border border-[#bd93f9] rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-[#bd93f9] font-bold">Dracula</h3>
        <button class="bg-[#bd93f9] text-[#282a36] px-3 py-1 rounded-md text-sm hover:bg-[#a87df8] transition-colors"
                onclick="window.applyTheme && window.applyTheme('dracula')">
          Apply
        </button>
      </div>
      <p class="text-[#f8f8f2]">Popular dark theme with purple accents</p>
    </div>
    
    <!-- Nord Theme -->
    <div class="bg-[#2e3440] border border-[#88c0d0] rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-[#88c0d0] font-bold">Nord</h3>
        <button class="bg-[#88c0d0] text-[#2e3440] px-3 py-1 rounded-md text-sm hover:bg-[#81a1c1] transition-colors"
                onclick="window.applyTheme && window.applyTheme('nord')">
          Apply
        </button>
      </div>
      <p class="text-[#eceff4]">Arctic, north-bluish color palette</p>
    </div>
  </div>
</div>
    `,
    type: "html",
  }
}

// Admin commands - updated to use interactive flow
async function handleAdd(type?: string, name?: string): Promise<CommandResult> {
  const colors = getThemeColors()

  if (!type) {
    return { output: "Usage: add <type> <name>", type: "error" }
  }

  const isUserAdmin = await auth.isAdmin()
  if (!isUserAdmin) {
    return { output: "Permission denied: Admin access required.", type: "error" }
  }

  // Handle add project command
  if (type.toLowerCase() === "project") {
    // Reset any existing state first
    useCommandState.getState().reset()
    // Then start the interactive add project flow
    useCommandState.getState().setState("add_project")

    return {
      output: `
<div class="${colors.infoBg} ${colors.infoBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.primary} mb-2">Add New Project</h3>
  <p class="text-white">You'll be guided through creating a new project.</p>
  <p class="${colors.secondary} mt-2">Type 'cancel' at any point to abort.</p>
</div>
      `,
      type: "html",
    }
  }

  // Handle other add commands
  return {
    output: `
<div class="${colors.successBg} ${colors.successBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.success} mb-2">Item Added</h3>
  <p class="text-white">Added new ${type}: ${name || "Unnamed"}</p>
  <p class="${colors.secondary} mt-2">(This is a simulation - in a real app, this would add to your database)</p>
</div>
    `,
    type: "html",
  }
}

async function handleEdit(type?: string, name?: string): Promise<CommandResult> {
  const colors = getThemeColors()

  if (!type) {
    return { output: "Usage: edit <type> <name>", type: "error" }
  }

  const isUserAdmin = await auth.isAdmin()
  if (!isUserAdmin) {
    return { output: "Permission denied: Admin access required.", type: "error" }
  }

  // Handle edit project command
  if (type.toLowerCase() === "project") {
    // Reset any existing state first
    useCommandState.getState().reset()
    // Then start the interactive edit project flow
    useCommandState.getState().setState("edit_project")

    // Get available projects
    const availableProjects = getAllProjectIds()

    return {
      output: `
<div class="${colors.infoBg} ${colors.infoBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.primary} mb-2">Edit Project</h3>
  <p class="text-white">You'll be guided through editing a project.</p>
  <p class="${colors.secondary} mt-2">Available projects: ${availableProjects.join(", ")}</p>
  <p class="${colors.secondary}">Type 'cancel' at any point to abort.</p>
</div>
      `,
      type: "html",
    }
  }

  // Handle other edit commands
  return {
    output: `
<div class="${colors.infoBg} ${colors.infoBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.primary} mb-2">Item Edited</h3>
  <p class="text-white">Edited ${type}: ${name || "Unnamed"}</p>
  <p class="${colors.secondary} mt-2">(This is a simulation - in a real app, this would open an editor)</p>
</div>
    `,
    type: "html",
  }
}

async function handleDelete(type?: string, name?: string): Promise<CommandResult> {
  const colors = getThemeColors()

  if (!type) {
    return { output: "Usage: delete <type> <name>", type: "error" }
  }

  const isUserAdmin = await auth.isAdmin()
  if (!isUserAdmin) {
    return { output: "Permission denied: Admin access required.", type: "error" }
  }

  // Handle delete project command
  if (type.toLowerCase() === "project") {
    // Reset any existing state first
    useCommandState.getState().reset()
    // Then start the interactive delete project flow
    useCommandState.getState().setState("delete_project")

    // Get available projects
    const availableProjects = getAllProjectIds()

    return {
      output: `
<div class="${colors.errorBg} ${colors.errorBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.error} mb-2">Delete Project</h3>
  <p class="text-white">You'll be guided through deleting a project.</p>
  <p class="${colors.secondary} mt-2">Available projects: ${availableProjects.join(", ")}</p>
  <p class="${colors.secondary}">Type 'cancel' at any point to abort.</p>
</div>
      `,
      type: "html",
    }
  }

  // Handle other delete commands
  return {
    output: `
<div class="${colors.errorBg} ${colors.errorBorder} p-4 rounded-md">
  <h3 class="text-xl font-bold ${colors.error} mb-2">Item Deleted</h3>
  <p class="text-white">Deleted ${type}: ${name || "Unnamed"}</p>
  <p class="${colors.secondary} mt-2">(This is a simulation - in a real app, this would remove from your database)</p>
</div>
    `,
    type: "html",
  }
}

// Helper functions
function resolvePath(currentPath: string, targetPath?: string): string {
  if (!targetPath) return currentPath

  // Absolute path
  if (targetPath.startsWith("/")) {
    return normalizePath(targetPath)
  }

  // Parent directory
  if (targetPath === "..") {
    const parts = currentPath.split("/").filter(Boolean)
    return parts.length === 0 ? "/" : `/${parts.slice(0, -1).join("/")}`
  }

  // Current directory
  if (targetPath === "." || targetPath === "./") {
    return currentPath
  }

  // Relative path
  const base = currentPath === "/" ? "" : currentPath
  return normalizePath(`${base}/${targetPath}`)
}

function normalizePath(path: string): string {
  // Remove trailing slash except for root
  return path === "/" ? "/" : path.replace(/\/$/, "")
}

function isValidPath(path: string): boolean {
  // Root is always valid
  if (path === "/") return true

  const validPaths = ["/about", "/projects", "/skills", "/contact"]

  // Check main sections
  if (validPaths.includes(path)) return true

  // Check project paths - updated to use mockDb
  if (path.startsWith("/projects/")) {
    const projectId = path.split("/")[2]
    return mockDb.projects.get(projectId) !== null
  }

  return false
}

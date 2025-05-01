// Command types
export type CommandCategory = "core" | "extended" | "admin" | "easter-egg"

export interface CommandDefinition {
  name: string
  description: string
  usage: string
  category: CommandCategory
  requiresAdmin?: boolean
  examples?: string[]
  aliases?: string[]
}

// Define all commands
export const commands: CommandDefinition[] = [
  // Core (Standalone) Commands
  {
    name: "help",
    description: "Lists available commands",
    usage: "help",
    category: "core",
    examples: ["help"],
  },
  {
    name: "clear",
    description: "Clears the terminal",
    usage: "clear",
    category: "core",
    examples: ["clear"],
  },
  {
    name: "ls",
    description: "Lists folders/files in current directory",
    usage: "ls [path]",
    category: "core",
    examples: ["ls", "ls /projects"],
  },
  {
    name: "pwd",
    description: "Shows current path",
    usage: "pwd",
    category: "core",
    examples: ["pwd"],
  },
  {
    name: "whoami",
    description: "Displays current user (visitor/admin)",
    usage: "whoami",
    category: "core",
    examples: ["whoami"],
  },
  {
    name: "login",
    description: "Logs in as admin",
    usage: "login <username> <password>",
    category: "core",
    examples: ["login admin password"],
  },
  {
    name: "logout",
    description: "Logs out admin",
    usage: "logout",
    category: "core",
    requiresAdmin: true,
    examples: ["logout"],
  },
  {
    name: "theme",
    description: "Manages terminal themes",
    usage: "theme [list|set <name>]",
    category: "core",
    examples: ["theme", "theme list", "theme set dark"],
  },
  {
    name: "themes",
    description: "Shows visual theme browser",
    usage: "themes",
    category: "core",
    aliases: ["theme list"],
    examples: ["themes"],
  },
  {
    name: "date",
    description: "Shows current date/time",
    usage: "date",
    category: "core",
    examples: ["date"],
  },
  {
    name: "banner",
    description: "Re-renders ASCII art title",
    usage: "banner",
    category: "core",
    examples: ["banner"],
  },
  {
    name: "exit",
    description: "Hides the terminal overlay",
    usage: "exit",
    category: "core",
    examples: ["exit"],
  },

  // Extended (Contextual) Commands
  {
    name: "cd",
    description: "Navigates into a section folder",
    usage: "cd <path>",
    category: "extended",
    examples: ["cd projects", "cd ..", "cd /"],
  },
  {
    name: "cat",
    description: "Outputs file content",
    usage: "cat <file>",
    category: "extended",
    examples: ["cat about.txt", "cat info.txt"],
  },
  {
    name: "open",
    description: "Opens URL or file",
    usage: "open <item>",
    category: "extended",
    examples: ["open demo.link", "open source.link", "open form.link"],
  },

  // Admin Commands
  {
    name: "add",
    description: "Admin adds a new item",
    usage: "add <type> <name>",
    category: "admin",
    requiresAdmin: true,
    examples: ["add project my-project", "add skill React"],
  },
  {
    name: "edit",
    description: "Edits a section or item",
    usage: "edit <type> <name>",
    category: "admin",
    requiresAdmin: true,
    examples: ["edit project my-project", "edit about"],
  },
  {
    name: "delete",
    description: "Removes an item",
    usage: "delete <type> <name>",
    category: "admin",
    requiresAdmin: true,
    examples: ["delete project my-project", "delete skill React"],
  },

  // Easter Egg Commands
  {
    name: "matrix",
    description: "Starts Matrix mode",
    usage: "matrix",
    category: "easter-egg",
    examples: ["matrix"],
  },
  {
    name: "sudo",
    description: "Runs command with admin privileges",
    usage: "sudo <command>",
    category: "easter-egg",
    examples: ["sudo hire-me"],
  },
]

// Helper function to get command by name
export function getCommand(name: string): CommandDefinition | undefined {
  // First try to find exact match
  let command = commands.find((cmd) => cmd.name === name)

  // If not found, try to find by alias
  if (!command) {
    command = commands.find((cmd) => cmd.aliases?.includes(name))
  }

  return command
}

// Helper function to get commands by category
export function getCommandsByCategory(category: CommandCategory): CommandDefinition[] {
  return commands.filter((cmd) => cmd.category === category)
}

// Helper function to get all available commands
export function getAllCommands(isAdmin = false): CommandDefinition[] {
  if (isAdmin) {
    return commands
  } else {
    return commands.filter((cmd) => !cmd.requiresAdmin)
  }
}

"use client"

import type React from "react"

import Image from "next/image"
import { ExternalLink, Github, Terminal, Code, Star, Eye, Calendar, Loader2 } from "lucide-react"
import { portfolioData } from "@/lib/data/portfolioData"
import { useTheme } from "@/lib/context/ThemeContext"
import { useState, useMemo, useEffect } from "react"
import Pagination from "@/components/ui/pagination"
import { useInView } from "@/hooks/use-in-view"
import TypingEffect from "@/components/ui/typingEffect"
import TerminalCommand from "@/components/ui/terminalCommand"

export default function Projects() {
  const { colors, theme } = useTheme()
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilterOutput, setShowFilterOutput] = useState(false)
  const projectsPerPage = 3
  const headerRef = useInView<HTMLDivElement>({ threshold: 0.3 })
  const filterRef = useInView<HTMLDivElement>({ threshold: 0.5 })

  // Get unique categories from projects
  const allTechnologies = portfolioData.projects.flatMap((project) => project.technologies)
  const categories = Array.from(new Set(allTechnologies))
    .sort((a, b) => {
      // Sort by frequency (most used technologies first)
      const countA = allTechnologies.filter((tech) => tech === a).length
      const countB = allTechnologies.filter((tech) => tech === b).length
      return countB - countA
    })
    .slice(0, 6)

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    return activeFilter === "all"
      ? portfolioData.projects
      : portfolioData.projects.filter((project) => project.technologies.includes(activeFilter))
  }, [activeFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter])

  // Handle filter change with loading animation
  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return

    setIsLoading(true)
    setShowFilterOutput(true)

    // Simulate loading for a more realistic terminal experience
    setTimeout(() => {
      setActiveFilter(filter)
      setIsLoading(false)
    }, 600)
  }

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to the top of the projects section
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Generate a random date in the last year for "last updated"
  const getRandomDate = () => {
    const today = new Date()
    const pastDate = new Date(today.setMonth(today.getMonth() - Math.floor(Math.random() * 12)))
    return pastDate.toLocaleDateString()
  }

  return (
    <section id="projects" className={`py-20 ${colors.card}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div
          ref={headerRef.ref}
          className={`text-center mb-12 transition-all duration-700 ${
            headerRef.isInView ? "opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className={`text-4xl font-bold mb-4 ${colors.text}`}>
            <span className="relative inline-block">
              <span data-text="Projects" className={`${Math.random() > 0.7 ? "animate-glitch" : ""}`}>
                Projects
              </span>
            </span>
          </h2>
          <p className={`${colors.secondary} max-w-2xl mx-auto`}>
            Explore my recent work. Each project is a unique piece of development, designed with passion and coded with
            precision.
          </p>

          {/* Terminal-styled filter tabs */}
          <div
            ref={filterRef.ref}
            className={`mt-8 p-4 ${colors.background} rounded-lg border ${colors.border} inline-block mx-auto transition-all duration-500 ${
              filterRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center mb-2">
              <div className="flex space-x-1.5 mr-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-xs">
                <span className={colors.secondary}>filter</span>
                <span className={colors.primary}>@</span>
                <span className={colors.text}>projects</span>
              </div>
            </div>

            <TerminalCommand
              command={`filter --type ${activeFilter}`}
              output={showFilterOutput ? `Found ${filteredProjects.length} projects matching criteria` : undefined}
              className="mb-3"
              autoType={false}
            />

            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className={`${colors.primary} animate-spin mr-2`} size={16} />
                <span className={`${colors.secondary} terminal-loading`}>Processing</span>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2 font-mono">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    activeFilter === "all"
                      ? `${colors.buttonBg} ${colors.buttonText}`
                      : `${colors.card} ${colors.text} hover:opacity-80`
                  }`}
                >
                  <span className={colors.secondary}>$</span> all
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`px-3 py-1 rounded-md text-sm transition-all ${
                      activeFilter === category
                        ? `${colors.buttonBg} ${colors.buttonText}`
                        : `${colors.card} ${colors.text} hover:opacity-80`
                    }`}
                  >
                    <span className={colors.secondary}>$</span> {category.toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project count and page info */}
        <div className={`flex justify-between items-center mb-6 ${colors.text}`}>
          <div className="text-sm font-mono">
            <span className={colors.secondary}>found:</span>{" "}
            <span className={colors.primary}>{filteredProjects.length}</span>{" "}
            <span className={colors.secondary}>projects</span>
          </div>
          <div className="text-sm font-mono">
            <span className={colors.secondary}>page:</span> <span className={colors.primary}>{currentPage}</span>
            <span className={colors.secondary}>/</span>
            <span className={colors.primary}>{totalPages}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project, index) => {
            // Create staggered animation delay
            const animationDelay = index * 150
            // const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

            return (
              <ProjectItem
                key={project.id}
                project={project}
                index={index}
                hoveredProject={hoveredProject}
                setHoveredProject={setHoveredProject}
                colors={colors}
                theme={theme}
                getRandomDate={getRandomDate}
              />
            )
          })}
        </div>

        {/* No projects message */}
        {currentProjects.length === 0 && (
          <div
            className={`text-center py-16 ${colors.background} rounded-lg border ${colors.border} shadow-md animate-fade-in`}
          >
            <div className="text-6xl mb-4">¯\_(ツ)_/¯</div>
            <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>No projects found</h3>
            <p className={`${colors.secondary} mb-6`}>Try changing your filter criteria</p>
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-md ${colors.buttonBg} ${colors.buttonText} hover:opacity-90 transition-colors`}
            >
              Show All Projects
            </button>
          </div>
        )}

        {/* Terminal-styled pagination */}
        {totalPages > 1 && (
          <div className="mt-12 animate-fade-in" style={{ animationDelay: "800ms" }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredProjects.length}
              itemsPerPage={projectsPerPage}
              currentItemCount={currentProjects.length}
            />
          </div>
        )}

        {/* View all projects button */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: "1000ms" }}>
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-6 py-3 rounded-lg ${colors.buttonBg} ${colors.buttonText} hover:opacity-90 transition-colors inline-flex items-center group`}
          >
            <span>View All Projects</span>
            <ExternalLink size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}

interface ProjectItemProps {
  project: (typeof portfolioData.projects)[0]
  index: number
  hoveredProject: string | null
  setHoveredProject: (projectId: string | null) => void
  colors: ReturnType<typeof useTheme>["colors"]
  theme: ReturnType<typeof useTheme>["theme"]
  getRandomDate: () => string
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  index,
  hoveredProject,
  setHoveredProject,
  colors,
  theme,
  getRandomDate,
}) => {
  const animationDelay = index * 150
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`group ${colors.background} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border ${colors.border} relative ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
      style={{
        transitionDelay: `${animationDelay}ms`,
        transform: isInView ? "translateY(0)" : "translateY(20px)",
      }}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      {/* Terminal-like header */}
      <div className={`px-4 py-2 ${colors.card} border-b ${colors.border} flex items-center`}>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="mx-auto font-mono text-xs truncate">
          <span className={colors.secondary}>project:</span>
          <span className={colors.primary}>/</span>
          <span className={colors.text}>{project.id}</span>
        </div>
      </div>

      {/* Project image with overlay */}
      <div className="h-48 relative overflow-hidden">
        <Image
          src={project.image || `/placeholder.svg?height=192&width=384&query=${project.name}`}
          alt={project.name}
          width={384}
          height={192}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

        {/* Project name and tech badges */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-xl font-bold mb-2 drop-shadow-md">
            <TypingEffect text={project.name} delay={animationDelay + 300} speed={30} />
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-md bg-black bg-opacity-70 text-white border border-gray-700 shadow-sm animate-fade-in"
                style={{ animationDelay: `${animationDelay + 500 + index * 100}ms` }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span
                className="px-2 py-0.5 text-xs rounded-md bg-black bg-opacity-70 text-white border border-gray-700 animate-fade-in"
                style={{ animationDelay: `${animationDelay + 800}ms` }}
              >
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center gap-4 transition-all duration-300 ${
            hoveredProject === project.id ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:scale-110"
          >
            <Eye size={20} />
          </a>
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full ${
              theme === "light" ? "bg-gray-800" : "bg-gray-700"
            } flex items-center justify-center text-white hover:bg-gray-600 transition-all shadow-lg transform hover:scale-110`}
          >
            <Github size={20} />
          </a>
        </div>
      </div>

      {/* Project content */}
      <div className="p-5">
        {/* Project metadata */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className={`flex items-center ${colors.accent}`}>
            <Star size={14} className="mr-1" />
            <span>{Math.floor(Math.random() * 100) + 10}</span>
          </div>
          <div className={`flex items-center ${colors.secondary}`}>
            <Calendar size={14} className="mr-1" />
            <span>{project.date}</span>
          </div>
        </div>

        {/* Project description */}
        <div className={`${colors.text} mb-4 line-clamp-3 text-sm`}>
          <p>{project.description}</p>
        </div>

        {/* Technology tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 text-xs rounded-md ${colors.card} ${colors.accent} border ${colors.border} shadow-sm animate-fade-in`}
              style={{ animationDelay: `${animationDelay + 600 + index * 100}ms` }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span
              className={`px-2 py-0.5 text-xs rounded-md ${colors.card} ${colors.secondary} border ${colors.border} animate-fade-in`}
              style={{ animationDelay: `${animationDelay + 1000}ms` }}
            >
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Action links */}
        <div className="flex justify-between mt-4 border-t border-dashed pt-3 text-sm">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center ${colors.primary} hover:underline transition-colors group`}
          >
            <ExternalLink size={16} className="mr-1.5 group-hover:translate-x-0.5 transition-transform" />
            Live Demo
          </a>
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center ${colors.text} hover:${colors.primary} transition-colors group`}
          >
            <Code size={16} className="mr-1.5 group-hover:translate-x-0.5 transition-transform" />
            Source Code
          </a>
        </div>
      </div>

      {/* Terminal-like footer */}
      <div className={`px-4 py-2 ${colors.card} text-xs ${colors.secondary} border-t ${colors.border} font-mono`}>
        <div className="flex items-center">
          <Terminal size={12} className="mr-2" />
          <span className={colors.secondary}>$</span>
          <span className={`ml-1 ${colors.primary}`}>cd</span>
          <span className={`ml-1 ${colors.text}`}>projects/{project.id}</span>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
        <div
          className={`absolute transform rotate-45 translate-x-4 -translate-y-1 w-16 text-center py-1 ${colors.buttonBg} ${colors.buttonText} text-xs font-medium shadow-md`}
        >
          {project.id.includes("ai") ? "AI" : project.id.includes("app") ? "App" : "Web"}
        </div>
      </div>
    </div>
  )
}

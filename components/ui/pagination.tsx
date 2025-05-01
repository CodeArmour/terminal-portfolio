"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "@/lib/context/ThemeContext"
import { useState } from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
  currentItemCount: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  currentItemCount,
}: PaginationProps) {
  const { colors } = useTheme()
  const [isChanging, setIsChanging] = useState(false)

  // Generate page numbers for pagination
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = startItem + currentItemCount - 1

  // Handle page change with animation
  const handlePageClick = (page: number) => {
    if (page === currentPage) return

    setIsChanging(true)
    setTimeout(() => {
      onPageChange(page)
      setIsChanging(false)
    }, 300)
  }

  return (
    <div
      className={`${colors.background} border ${colors.border} rounded-lg overflow-hidden shadow-md mx-auto max-w-md transition-all duration-300 ${isChanging ? "opacity-70" : "opacity-100"}`}
    >
      <div className={`${colors.card} px-4 py-2 border-b ${colors.border} flex items-center`}>
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="mx-auto font-mono text-sm">
          <span className={colors.secondary}>pagination</span>
          <span className={colors.primary}>@</span>
          <span className={colors.text}>projects</span>
        </div>
      </div>

      <div className="p-4 font-mono">
        <div className="flex items-center justify-center space-x-1">
          <span className={`${colors.secondary} mr-2`}>$</span>
          <span className={colors.primary}>navigate</span>
          <span className={colors.text}> --page </span>
          <div className="flex items-center">
            <button
              onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : `hover:${colors.bg} hover:bg-opacity-30`
              } transition-transform hover:-translate-x-0.5`}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} className={currentPage === 1 ? colors.secondary : colors.primary} />
            </button>

            {/* Page numbers */}
            <div className="flex items-center">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageClick(number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-300 ${
                    currentPage === number
                      ? `${colors.buttonBg} ${colors.buttonText} scale-110`
                      : `${colors.text} hover:${colors.bg} hover:bg-opacity-30`
                  }`}
                  aria-label={`Page ${number}`}
                  aria-current={currentPage === number ? "page" : undefined}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : `hover:${colors.bg} hover:bg-opacity-30`
              } transition-transform hover:translate-x-0.5`}
              aria-label="Next page"
            >
              <ChevronRight size={18} className={currentPage === totalPages ? colors.secondary : colors.primary} />
            </button>
          </div>
        </div>
      </div>

      <div className={`${colors.card} px-4 py-2 border-t ${colors.border} text-xs ${colors.secondary}`}>
        <div className="flex justify-between">
          <span>
            Showing page {currentPage} of {totalPages}
          </span>
          <span>
            {startItem}-{endItem} of {totalItems} projects
          </span>
        </div>
      </div>
    </div>
  )
}

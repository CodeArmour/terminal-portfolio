"use client"

import { portfolioData } from "@/lib/data/portfolioData"
import { useTheme } from "@/lib/context/ThemeContext"

export default function Skills() {
  const { colors } = useTheme()

  return (
    <section id="skills" className={`py-20 ${colors.background}`}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className={`text-3xl font-bold mb-12 text-center ${colors.text}`}>Skills</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${colors.text}`}>
              <span
                className={`w-8 h-8 rounded-full ${colors.card} flex items-center justify-center mr-2 ${colors.primary}`}
              >
                <span className="text-lg">💻</span>
              </span>
              Technical
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.technical.map((skill, index) => (
                <span key={index} className={`px-3 py-1 rounded-full ${colors.card} ${colors.primary} text-sm`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${colors.text}`}>
              <span
                className={`w-8 h-8 rounded-full ${colors.card} flex items-center justify-center mr-2 ${colors.primary}`}
              >
                <span className="text-lg">🤝</span>
              </span>
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.soft.map((skill, index) => (
                <span key={index} className={`px-3 py-1 rounded-full ${colors.card} ${colors.primary} text-sm`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${colors.text}`}>
              <span
                className={`w-8 h-8 rounded-full ${colors.card} flex items-center justify-center mr-2 ${colors.primary}`}
              >
                <span className="text-lg">🛠️</span>
              </span>
              Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.tools.map((tool, index) => (
                <span key={index} className={`px-3 py-1 rounded-full ${colors.card} ${colors.primary} text-sm`}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={`mt-12 p-6 ${colors.card} rounded-xl`}>
          <h3 className={`text-xl font-semibold mb-4 ${colors.text}`}>Terminal Skills Explorer</h3>
          <p className={`${colors.text} mb-4`}>
            Want to see more details about my skills? Try these commands in the terminal:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className={`p-3 ${colors.background} rounded-lg font-mono text-sm ${colors.text}`}>
              cd skills
              <br />
              cat technical.txt
            </div>
            <div className={`p-3 ${colors.background} rounded-lg font-mono text-sm ${colors.text}`}>
              cd skills
              <br />
              cat soft.txt
            </div>
            <div className={`p-3 ${colors.background} rounded-lg font-mono text-sm ${colors.text}`}>
              cd skills
              <br />
              cat tools.txt
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

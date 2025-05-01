"use client"

import { portfolioData } from "@/lib/data/portfolioData"
import { useTheme } from "@/lib/context/ThemeContext"
import FadeInView from "@/components/ui/FadeInView"
import TypedText from "@/components/ui/typedText"

export default function About() {
  const { colors } = useTheme()

  return (
    <section id="about" className={`py-20 ${colors.background}`}>
      <div className="max-w-4xl mx-auto px-4">
        <FadeInView>
          <h2 className={`text-3xl font-bold mb-8 text-center ${colors.text}`}>
            <TypedText text="About Me" speed={1000} />
          </h2>
        </FadeInView>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <FadeInView delay={200}>
              <p className={`text-lg ${colors.text}`}>{portfolioData.about.summary}</p>

              <h3 className={`text-xl font-semibold mt-8 ${colors.primary}`}>Experience</h3>
              <div className="space-y-4">
                {portfolioData.about.experience.map((exp, index) => (
                  <FadeInView key={index} delay={300 + index * 200} direction="left">
                    <div className={`border-l-2 ${colors.border} pl-4`}>
                      <h4 className={`font-medium ${colors.text}`}>{exp.role}</h4>
                      <p className={`text-sm ${colors.secondary}`}>
                        {exp.company} | {exp.period}
                      </p>
                      <p className={`mt-2 ${colors.text}`}>{exp.description}</p>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </FadeInView>
          </div>

          <div>
            <FadeInView delay={400} direction="right">
              <h3 className={`text-xl font-semibold mb-4 ${colors.primary}`}>Education</h3>
              <div className="space-y-4">
                {portfolioData.about.education.map((edu, index) => (
                  <FadeInView key={index} delay={500 + index * 150}>
                    <div className={`p-4 ${colors.card} rounded-lg`}>
                      <h4 className={`font-medium ${colors.text}`}>{edu.degree}</h4>
                      <p className={`text-sm ${colors.secondary}`}>
                        {edu.institution} | {edu.year}
                      </p>
                    </div>
                  </FadeInView>
                ))}
              </div>

              <FadeInView delay={700}>
                <h3 className={`text-xl font-semibold mt-8 mb-4 ${colors.primary}`}>Terminal Tip</h3>
                <div className={`p-4 ${colors.card} rounded-lg`}>
                  <p className={`text-sm ${colors.text}`}>
                    Try typing <code className={`${colors.card} px-1 py-0.5 rounded ${colors.accent}`}>cd about</code>{" "}
                    in the terminal, then{" "}
                    <code className={`${colors.card} px-1 py-0.5 rounded ${colors.accent}`}>ls</code> to explore more
                    about me!
                  </p>
                </div>
              </FadeInView>
            </FadeInView>
          </div>
        </div>
      </div>
    </section>
  )
}

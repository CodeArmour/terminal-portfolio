"use client";

import { portfolioData } from "@/lib/data/portfolioData";
import { useTheme } from "@/lib/context/ThemeContext";
import FadeInView from "../ui/FadeInView";
import { useInView } from "@/hooks/use-in-view";
import { useEffect, useState } from "react";

export default function Skills() {
  const terminalRef = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [terminalText, setTerminalText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const { colors } = useTheme();

  // Terminal typing effect
  useEffect(() => {
    if (!terminalRef.isInView) return;

    const commands = [
      "cd skills",
      "ls",
      "Found: technical.txt soft.txt tools.txt",
      "cat technical.txt",
      "Loading skills...",
    ];

    let fullText = "";
    let currentCommandIndex = 0;
    let currentCharIndex = 0;
    let timeout: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentCommandIndex >= commands.length) {
        setShowCursor(false);
        return;
      }

      const currentCommand = commands[currentCommandIndex];

      if (currentCharIndex < currentCommand.length) {
        fullText += currentCommand[currentCharIndex];
        setTerminalText(fullText);
        currentCharIndex++;
        timeout = setTimeout(typeNextChar, 50);
      } else {
        fullText += "\n$ ";
        setTerminalText(fullText);
        currentCommandIndex++;
        currentCharIndex = 0;
        timeout = setTimeout(typeNextChar, 500);
      }
    };

    timeout = setTimeout(typeNextChar, 1000);

    return () => clearTimeout(timeout);
  }, [terminalRef.isInView]);

  return (
    <section id="skills" className={`py-20 ${colors.background}`}>
      <div className="max-w-4xl mx-auto px-4">
      <FadeInView>
          <h2 className={`text-3xl font-bold mb-12 text-center ${colors.text}`}>
            <span className={`${Math.random() > 0.7 ? "animate-glitch" : ""}`} data-text="Skills">
              Skills
            </span>
          </h2>
        </FadeInView>

        <div className="grid md:grid-cols-3 gap-8">

        <FadeInView delay={200} direction="up">
          <div>
            <h3
              className={`text-xl font-semibold mb-4 flex items-center ${colors.text}`}
            >
              <span
                className={`w-8 h-8 rounded-full ${colors.card} flex items-center justify-center mr-2 ${colors.primary}`}
              >
                <span className="text-lg">💻</span>
              </span>
              Technical
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.technical.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full ${colors.card} ${colors.primary} text-sm`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          </FadeInView>

          <FadeInView delay={500} direction="up">
          <div>
            <h3
              className={`text-xl font-semibold mb-4 flex items-center ${colors.text}`}
            >
              <span
                className={`w-8 h-8 rounded-full ${colors.card} flex items-center justify-center mr-2 ${colors.primary}`}
              >
                <span className="text-lg">🤝</span>
              </span>
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.soft.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full ${colors.card} ${colors.primary} text-sm`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          </FadeInView>

          <FadeInView delay={800} direction="up">
          <div>
            <h3
              className={`text-xl font-semibold mb-4 flex items-center ${colors.text}`}
            >
              <span
                className={`w-8 h-8 rounded-full ${colors.card} flex items-center justify-center mr-2 ${colors.primary}`}
              >
                <span className="text-lg">🛠️</span>
              </span>
              Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.tools.map((tool, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full ${colors.card} ${colors.primary} text-sm`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          </FadeInView>
        </div>
        {/* Terminal Skills Explorer */}
        <FadeInView delay={1000} direction="up">
          <div
            className={`mt-12 p-6 ${colors.card} rounded-xl`}
            ref={terminalRef.ref}
          >
            <h3 className={`text-xl font-semibold mb-4 ${colors.text}`}>
              Terminal Skills Explorer
            </h3>
            <p className={`${colors.text} mb-4`}>
              Want to see more details about my skills? Try these commands in
              the terminal:
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div
                className={`p-3 ${colors.background} rounded-lg font-mono text-sm ${colors.text}`}
              >
                cd skills
                <br />
                cat technical.txt
              </div>
              <div
                className={`p-3 ${colors.background} rounded-lg font-mono text-sm ${colors.text}`}
              >
                cd skills
                <br />
                cat soft.txt
              </div>
              <div
                className={`p-3 ${colors.background} rounded-lg font-mono text-sm ${colors.text}`}
              >
                cd skills
                <br />
                cat tools.txt
              </div>
            </div>

            {/* Animated terminal output */}
            <div
              className={`mt-4 p-3 ${colors.background} rounded-lg font-mono text-sm ${colors.text} h-32 overflow-hidden`}
            >
              <div className="flex items-center mb-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-2 text-xs opacity-70">terminal</div>
              </div>
              <div className="whitespace-pre-line">
                $ {terminalText}
                {showCursor && (
                  <span className="inline-block w-2 h-4 bg-current animate-blink ml-0.5"></span>
                )}
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

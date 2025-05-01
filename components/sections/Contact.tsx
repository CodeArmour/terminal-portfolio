"use client"

import { Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { portfolioData } from "@/lib/data/portfolioData"
import { useTheme } from "@/lib/context/ThemeContext"

export default function Contact() {
  const { colors } = useTheme()

  return (
    <section id="contact" className={`py-20 ${colors.card}`}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className={`text-3xl font-bold mb-12 text-center ${colors.text}`}>Get In Touch</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className={`text-xl font-semibold mb-6 ${colors.text}`}>Contact Information</h3>

            <div className="space-y-4">
              <a
                href={`mailto:${portfolioData.contact.email}`}
                className={`flex items-center p-4 ${colors.background} rounded-lg hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${colors.card} flex items-center justify-center mr-4 ${colors.primary}`}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <p className={`text-sm ${colors.secondary}`}>Email</p>
                  <p className={`font-medium ${colors.text}`}>{portfolioData.contact.email}</p>
                </div>
              </a>

              <a
                href={portfolioData.contact.social.GitHub}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-4 ${colors.background} rounded-lg hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${colors.card} flex items-center justify-center mr-4 ${colors.text}`}
                >
                  <Github size={20} />
                </div>
                <div>
                  <p className={`text-sm ${colors.secondary}`}>GitHub</p>
                  <p className={`font-medium ${colors.text}`}>github.com/Omar</p>
                </div>
              </a>

              <a
                href={portfolioData.contact.social.LinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-4 ${colors.background} rounded-lg hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${colors.card} flex items-center justify-center mr-4 ${colors.primary}`}
                >
                  <Linkedin size={20} />
                </div>
                <div>
                  <p className={`text-sm ${colors.secondary}`}>LinkedIn</p>
                  <p className={`font-medium ${colors.text}`}>linkedin.com/in/Omar</p>
                </div>
              </a>

              <a
                href={portfolioData.contact.social.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-4 ${colors.background} rounded-lg hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${colors.card} flex items-center justify-center mr-4 ${colors.primary}`}
                >
                  <Instagram size={20} />
                </div>
                <div>
                  <p className={`text-sm ${colors.secondary}`}>Instagram</p>
                  <p className={`font-medium ${colors.text}`}>Instagram.com/Omar</p>
                </div>
              </a>
            </div>

            <div className={`mt-8 p-4 ${colors.background} rounded-lg`}>
              <p className={`${colors.text} text-sm`}>
                Terminal tip: Try{" "}
                <code className={`${colors.card} px-1 py-0.5 rounded ${colors.accent}`}>cd contact</code> and then{" "}
                <code className={`${colors.card} px-1 py-0.5 rounded ${colors.accent}`}>cat social.txt</code> to see all
                my social links!
              </p>
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-6 ${colors.text}`}>Send a Message</h3>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-1 ${colors.text}`}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.background} focus:ring-2 focus:ring-${colors.primary} focus:border-transparent outline-none transition-all ${colors.text}`}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1 ${colors.text}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.background} focus:ring-2 focus:ring-${colors.primary} focus:border-transparent outline-none transition-all ${colors.text}`}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-1 ${colors.text}`}>
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.background} focus:ring-2 focus:ring-${colors.primary} focus:border-transparent outline-none transition-all ${colors.text}`}
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className={`w-full px-6 py-3 ${colors.buttonBg} ${colors.buttonText} rounded-lg hover:opacity-90 transition-colors`}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

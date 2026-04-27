import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { useNavigate } from 'react-router'
import { useLanguage } from '../contexts/LanguageContext'

import TypewriterText from './TypewriterText'
import asciiLogo from '../assets/ASCII art/message.txt?raw'

export default function Hero() {
    const navigate = useNavigate()
    const { t, language } = useLanguage()
    const [cvUrl, setCvUrl] = useState(null)

    useEffect(() => {
        const fetchCv = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/Resume?lang=${language}`)
                if (res.ok) {
                    const data = await res.json()
                    setCvUrl(data.fileUrl)
                }
            } catch (err) {
                // Ignore silent fail
            }
        }
        fetchCv()
    }, [language])

    // Função para o botão principal rolar até os projetos
    const scrollToProjects = () => {
        const element = document.getElementById('projetos')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden">

            {/* Efeito de luz (Glow) de fundo mais intenso */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-6xl z-10">

                {/* Lado Esquerdo: Textos e Botões */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center md:items-start text-center md:text-left flex-1"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="px-4 py-2 mb-6 bg-brand-900 border border-brand-700 rounded-full text-sm md:text-base text-gray-300 font-medium shadow-lg inline-block"
                    >
                        <TypewriterText text="🚀 Welcome to My Code Realm </>" speed={6} delay={100} />
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-tight text-white">
                        <TypewriterText text={t('hero_greeting')} speed={8} delay={200} /> <br className="hidden md:block" />
                        <span className="text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-brand-600 block sm:inline-block">
                            João Arthur
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-gray-400 max-w-lg mb-8 leading-relaxed h-auto md:h-auto">
                        {t('hero_description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-wrap">
                        <button
                            onClick={scrollToProjects}
                            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-base transition-all shadow-[0_0_20px_rgba(37,106,94,0.3)] hover:shadow-[0_0_30px_rgba(37,106,94,0.6)] cursor-pointer"
                        >
                            {t('hero_btn_projects')}
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            className="px-6 py-3 bg-brand-900 border border-brand-900 hover:bg-brand-800 hover:border-brand-500/50 hover:text-brand-300 text-gray-300 rounded-xl font-bold text-base transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            {t('hero_btn_blog')}
                        </button>
                        {cvUrl && (
                            <button
                                onClick={() => navigate('/preview', { state: { title: language === 'pt' ? 'Currículo' : 'Resume', url: cvUrl } })}
                                className="px-6 py-3 bg-brand-900 border border-brand-700 hover:bg-brand-700 hover:text-white text-brand-300 rounded-xl font-bold text-base transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                                {t('hero_btn_cv')}
                            </button>
                        )}
                        <a
                            href="https://github.com/sertoriel"
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-3 bg-[#010302] border border-brand-800 hover:bg-brand-900 text-gray-400 hover:text-white rounded-xl font-bold text-base transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            GitHub
                        </a>
                    </div>
                </motion.div>

                {/* Lado Direito: Ghostty Terminal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="w-full max-w-lg lg:w-[500px] flex-shrink-0 relative flex flex-col z-10"
                >
                    {/* Glow Atrás do Terminal */}
                    <div className="absolute inset-0 bg-brand-500/20 blur-[80px] rounded-full pointer-events-none"></div>

                    {/* Ghostty App Container */}
                    <div className="w-full bg-[#1e2029]/80 backdrop-blur-xl border border-brand-700/40 rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-stretch z-10">
                        {/* Title Bar MacOS Style */}
                        <div className="bg-[#14151b] px-4 py-3 flex items-center gap-2 border-b border-brand-800 border-opacity-50 select-none">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
                            </div>
                            <div className="flex-1 text-center text-xs text-gray-500 tracking-wider font-bold truncate">
                                ghostty — visitor@sertoriel-portfolio:~
                            </div>
                        </div>

                        {/* Console Body */}
                        <div className="px-5 py-6 overflow-x-hidden min-h-[300px] flex flex-col justify-center items-center">
                            {/* Arte ASCII Injetada */}
                            <pre className="text-[3.5px] sm:text-[4.5px] leading-[1.1] text-brand-400 text-center select-none" style={{ textShadow: "0 0 5px rgba(101,175,157,0.5)" }}>
                                {asciiLogo}
                            </pre>

                            {/* Linha Falsa de Execução de Prompt */}
                            <div className="mt-6 flex gap-2 font-mono text-xs w-full text-brand-300">
                                <span className="text-brand-500">➜</span>
                                <span>~</span>
                                <TypewriterText text="./start_backend_engine.sh && npm run dev" speed={25} delay={3200} className="text-gray-200" />
                            </div>
                            <div className="flex gap-2 font-mono text-xs w-full text-brand-300 mt-1">
                                <span className="text-brand-700 invisible">➜</span>
                                <span className="invisible">~</span>
                                <TypewriterText text="SUCCESS: Dev Environment Initialized!" speed={10} delay={4500} className="text-brand-500" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Efeito de gradiente na base pra misturar com a próxima seção removido para Global Background */}
        </section>
    )
}
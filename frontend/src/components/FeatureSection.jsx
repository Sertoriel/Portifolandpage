import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router'
import Lottie from 'lottie-react'
import { useLanguage } from '../contexts/LanguageContext'

import Error404 from '../assets/Error404.json'

export default function FeatureSection() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    const navigate = useNavigate()
    const { t, language } = useLanguage()

    useEffect(() => {
        fetch('http://localhost:5000/api/Projects')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProjects(data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error("Erro ao buscar projetos:", error)
                setErrorMsg("Não foi possível conectar à API.")
                setIsLoading(false)
            })
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
    }

    // --- TRAVAS DE SEGURANÇA ---
    if (isLoading) {
        return <div className="w-full min-h-screen flex items-center justify-center bg-transparent text-white z-20 relative">{t('feat_loading')}</div>
    }

    if (errorMsg !== "") {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-transparent z-20 relative text-white">
                <h2 className="text-3xl font-bold text-red-500 mb-4">{t('feat_error')}</h2>
                <p className="text-gray-400">{errorMsg}</p>
            </div>
        )
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-transparent z-20 relative text-white">
                <h2 className="text-3xl text-white mb-4">{t('feat_empty')}</h2>
                <p className="text-gray-400">{t('feat_empty_desc')}</p>
            </div>
        )
    }

    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-transparent relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="max-w-3xl text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {t('feat_title')} <span className="text-brand-500">{t('feat_title_span')}</span>
                </h2>
                <p className="text-lg text-gray-400">
                    {t('feat_desc')}
                </p>
            </motion.div>

            <div className="relative w-full max-w-4xl flex items-center justify-center">
                <button
                    onClick={prevSlide}
                    className="absolute left-0 z-30 p-3 bg-brand-900 border border-brand-700 rounded-full text-white hover:bg-brand-800 hover:scale-110 transition-all cursor-pointer shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div className="w-full overflow-hidden px-12 md:px-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                            className={`bg-brand-900/50 border ${projects[currentIndex].bgBorderClass} backdrop-blur-sm rounded-3xl p-8 md:p-12 w-full flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl`}
                        >
                            <div className="flex-1">
                                <span className={`text-sm font-bold tracking-wider uppercase ${projects[currentIndex].colorClass}`}>
                                    {language === 'en' && projects[currentIndex].categoryEn ? projects[currentIndex].categoryEn : projects[currentIndex].category}
                                </span>
                                <h3 className="text-3xl font-bold text-white mt-2 mb-4">
                                    {language === 'en' && projects[currentIndex].titleEn ? projects[currentIndex].titleEn : projects[currentIndex].title}
                                </h3>
                                <p className="text-gray-400 mb-6 line-clamp-3">
                                    {language === 'en' && projects[currentIndex].shortDescriptionEn ? projects[currentIndex].shortDescriptionEn : projects[currentIndex].shortDescription}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {projects[currentIndex].techs.map((tech, index) => (
                                        <span key={index} className="px-3 py-1 bg-brand-800 border border-brand-700 rounded-full text-xs text-gray-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/projeto/${projects[currentIndex].id}`)}
                                className="w-full md:w-1/2 h-48 md:h-64 border border-brand-700 rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg"
                            >
                                {projects[currentIndex].thumbnailUrl ? (
                                    <img
                                        src={projects[currentIndex].thumbnailUrl}
                                        alt={`Capa do projeto ${projects[currentIndex].title}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-brand-800 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm group-hover:text-brand-400 transition-colors">
                                            <Lottie
                                                animationData={Error404}
                                                loop={true}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-white font-bold text-sm flex items-center gap-2">
                                        {t('feat_explore')} <span className="text-brand-400">→</span>
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    onClick={nextSlide}
                    className="absolute right-0 z-30 p-3 bg-brand-900 border border-brand-700 rounded-full text-white hover:bg-brand-800 hover:scale-110 transition-all cursor-pointer shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            <div className="flex gap-2 mt-8">
                {projects.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-brand-500 w-8" : "bg-brand-700 hover:bg-gray-500"}`}
                    />
                ))}
            </div>
        </section>
    )
}
import { useParams, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

export default function ProjectDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [project, setProject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    const { t, language } = useLanguage()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/Projects/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Projeto não encontrado");
                }
                return response.json();
            })
            .then(data => {
                setProject(data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error("Erro:", error)
                setErrorMsg("Não foi possível carregar os detalhes do projeto.")
                setIsLoading(false)
            })
    }, [id])

    if (isLoading) {
        return <div className="w-full min-h-screen bg-transparent flex items-center justify-center text-white">{t('proj_details_loading')}</div>
    }

    if (errorMsg !== "" || !project) {
        return (
            <div className="w-full min-h-screen bg-transparent flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl font-bold text-red-500 mb-4">Erro</h2>
                <p className="text-gray-400">{errorMsg || t('proj_details_error')}</p>
                <button onClick={() => navigate(-1)} className="mt-8 text-brand-400 hover:underline cursor-pointer">←</button>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-transparent text-white p-8 md:p-16 font-sans">
            <Navbar />

            <button
                onClick={() => navigate(-1)}
                className="mt-20 mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
                {t('proj_details_back')}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <span className={`font-bold tracking-wider uppercase ${project.colorClass || 'text-brand-400'}`}>
                    {language === 'en' && project.categoryEn ? project.categoryEn : project.category}
                </span>

                <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-6">
                    {language === 'en' && project.titleEn ? project.titleEn : project.title}
                </h1>

                <div className="bg-brand-900 border border-brand-800 rounded-2xl p-8 shadow-2xl">

                    <article className="prose prose-invert prose-brand max-w-none mb-8 text-gray-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {language === 'en' && project.fullDescriptionEn ? project.fullDescriptionEn : project.fullDescription}
                        </ReactMarkdown>
                    </article>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-brand-800">
                        {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-colors cursor-pointer">
                                {t('proj_details_repo')}
                            </a>
                        )}
                        {project.downloadLink && (
                            <a href={project.downloadLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-brand-800 hover:bg-brand-700 border border-brand-700 text-white font-bold rounded-lg transition-colors cursor-pointer">
                                {t('proj_details_download')}
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
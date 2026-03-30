import { useParams, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/Navbar'

export default function ProjectDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [project, setProject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        fetch(`http://localhost:5000/api/Projects/${id}`)
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
        return <div className="w-full min-h-screen bg-[#0b0c10] flex items-center justify-center text-white">Carregando documentação...</div>
    }

    if (errorMsg !== "" || !project) {
        return (
            <div className="w-full min-h-screen bg-[#0b0c10] flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl font-bold text-red-500 mb-4">Erro</h2>
                <p className="text-gray-400">{errorMsg || "Projeto não encontrado."}</p>
                <button onClick={() => navigate(-1)} className="mt-8 text-blue-400 hover:underline cursor-pointer">← Voltar</button>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-[#0b0c10] text-white p-8 md:p-16 font-sans">
            <Navbar />

            <button
                onClick={() => navigate(-1)}
                className="mt-20 mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
                ← Voltar para o Portfólio
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <span className={`font-bold tracking-wider uppercase ${project.colorClass || 'text-blue-400'}`}>
                    {project.category}
                </span>

                <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-6">
                    {project.title}
                </h1>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

                    <article className="prose prose-invert prose-blue max-w-none mb-8 text-gray-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {project.fullDescription}
                        </ReactMarkdown>
                    </article>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-800">
                        {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer">
                                Acessar Repositório (GitHub)
                            </a>
                        )}
                        {project.downloadLink && (
                            <a href={project.downloadLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold rounded-lg transition-colors cursor-pointer">
                                Baixar Build / Executável
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
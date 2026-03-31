import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/Navbar'

export default function BlogPostView() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        // Se o usuário estiver logado, ele consegue ler os próprios rascunhos.
        const token = localStorage.getItem('portfolio_token') || ''
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

        fetch(`http://localhost:5000/api/Blog/${slug}`, { headers })
            .then(res => {
                if (!res.ok) throw new Error("Publicação não encontrada.")
                return res.json()
            })
            .then(data => {
                setPost(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err)
                setErrorMsg(err.message)
                setIsLoading(false)
            })
    }, [slug])

    if (isLoading) return <div className="min-h-screen bg-transparent text-gray-500 flex justify-center items-center">Buscando do repositório...</div>

    if (errorMsg || !post) return (
        <div className="min-h-screen bg-transparent flex flex-col justify-center items-center gap-4">
            <h1 className="text-2xl font-bold text-red-500">404</h1>
            <p className="text-gray-400">{errorMsg}</p>
            <Link to="/blog" className="text-brand-400 hover:text-brand-300 transition-colors">Voltar aos Arquivos</Link>
        </div>
    )

    return (
        <div className="w-full min-h-screen bg-transparent text-gray-300 font-sans selection:bg-brand-500/30">
            <Navbar />
            
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-gray-300 transition-colors mb-10">
                    ← cd ..
                </Link>

                <motion.article 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <header className="mb-12 border-b border-gray-800 pb-8 text-center md:text-left">
                        {post.isDraft && (
                            <div className="mb-4">
                                <span className="inline-block bg-yellow-900/40 border border-yellow-700/50 text-yellow-500 text-xs tracking-wider uppercase font-bold px-3 py-1 rounded-sm">
                                    [ RASCUNHO INTERNO ]
                                </span>
                            </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-brand-400 font-mono text-sm opacity-80">
                            <time>
                                {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: 'long', year: 'numeric'
                                })}
                            </time>
                            <span className="text-gray-700">/</span>
                            <span>{Math.max(1, Math.ceil(post.content.length / 800))} min read</span>
                        </div>
                    </header>

                    {/* A tipografia Typography no seu esplendor máximo: */}
                    <div className="prose prose-invert prose-brand max-w-none prose-p:leading-loose prose-pre:bg-[#07080b] prose-pre:border prose-pre:border-gray-800 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline prose-md">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </motion.article>
            </main>
        </div>
    )
}

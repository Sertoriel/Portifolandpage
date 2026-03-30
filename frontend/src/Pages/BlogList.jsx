import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

export default function BlogList() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:5000/api/Blog')
            .then(res => res.json())
            .then(data => {
                setPosts(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err)
                setIsLoading(false)
            })
    }, [])

    return (
        <div className="w-full min-h-screen bg-[#0b0c10] text-gray-300 font-sans">
            <Navbar />
            
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-16">
                <header className="mb-12 border-b border-gray-800 pb-6">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Arquivos</h1>
                    <p className="text-gray-400">Estudos, reflexões profundas e arquitetura de software.</p>
                </header>

                {isLoading ? (
                    <div className="animate-pulse space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-800/40 rounded-lg"></div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <p className="text-gray-500 italic">Nenhuma publicação encontrada no momento.</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post, index) => (
                            <motion.article 
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group block p-5 md:p-6 -mx-4 rounded-xl hover:bg-gray-800/30 transition-colors"
                            >
                                <Link to={`/blog/${post.slug}`}>
                                    <div className="flex flex-col gap-1 cursor-pointer">
                                        <div className="flex items-center gap-3 text-sm text-brand-400 font-mono mb-1">
                                            <span>
                                                {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-gray-500">{Math.max(1, Math.ceil(post.content.length / 800))} min de leitura</span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-100 group-hover:text-brand-300 transition-colors leading-snug">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
                                            {post.summary}
                                        </p>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'
import TypewriterText from '../components/TypewriterText'
import Lottie from 'lottie-react'
import codingIcon from '../assets/Codinganimation.json'

const generateSlug = (children) => {
    const text = Array.isArray(children) 
        ? children.map(c => typeof c === 'string' ? c : c?.props?.children).join('')
        : String(children);
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')       
        .replace(/[^\w\-]+/g, '')   
        .replace(/\-\-+/g, '-')     
        .replace(/^-+/, '')         
        .replace(/-+$/, '');        
}

export default function BlogPostView() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    const [tocItems, setTocItems] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [hasPeeked, setHasPeeked] = useState(false)
    const lottieRef = useRef(null)

    const { t, language } = useLanguage()

    useEffect(() => {
        const t1 = setTimeout(() => setHasPeeked(true), 1200)
        const t2 = setTimeout(() => setHasPeeked(false), 2400)
        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, [])

    useEffect(() => {
        if (!post) return;
        const currentContent = language === 'en' && post.contentEn ? post.contentEn : post.content;
        const headers = [];
        const regex = /^(#{1,3})\s+(.*)$/gm;
        let match;
        while ((match = regex.exec(currentContent)) !== null) {
            // Remove markdown formatters like ** bold from text before showing in ToC
            const cleanText = match[2].replace(/[\*\_]/g, '');
            headers.push({
                level: match[1].length,
                text: cleanText,
                id: generateSlug(cleanText)
            });
        }
        setTocItems(headers);
    }, [post, language]);

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
            if (window.innerWidth < 1024) {
               setIsSidebarOpen(false);
            }
        }
    };

    useEffect(() => {
        // Se o usuário estiver logado, ele consegue ler os próprios rascunhos.
        const token = localStorage.getItem('portfolio_token') || ''
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

        fetch(`${import.meta.env.VITE_API_URL}/Blog/${slug}`, { headers })
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

    if (isLoading) return <div className="min-h-screen bg-transparent text-gray-500 flex justify-center items-center">{t('blog_post_loading')}</div>

    if (errorMsg || !post) return (
        <div className="min-h-screen bg-transparent flex flex-col justify-center items-center gap-4">
            <h1 className="text-2xl font-bold text-red-500">404</h1>
            <p className="text-gray-400">{errorMsg || t('blog_post_error')}</p>
            <Link to="/blog" className="text-brand-400 hover:text-brand-300 transition-colors">{t('blog_post_back')}</Link>
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
                    <header className="mb-12 border-b border-brand-800 pb-8 text-center md:text-left">
                        {post.isDraft && (
                            <div className="mb-4">
                                <span className="inline-block bg-yellow-900/40 border border-yellow-700/50 text-yellow-500 text-xs tracking-wider uppercase font-bold px-3 py-1 rounded-sm">
                                    [ RASCUNHO INTERNO ]
                                </span>
                            </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            <TypewriterText text={language === 'en' && post.titleEn ? post.titleEn : post.title} speed={25} />
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-brand-400 font-mono text-sm opacity-80">
                            <time>
                                {new Date(post.publishedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
                                    day: '2-digit', month: 'long', year: 'numeric'
                                })}
                            </time>
                            <span className="text-brand-700">/</span>
                            <span>{Math.max(1, Math.ceil(post.content.length / 800))} min read</span>
                        </div>
                    </header>

                    {/* A tipografia Typography no seu esplendor máximo: */}
                    <div className="prose prose-invert prose-brand max-w-none prose-p:leading-loose prose-pre:bg-[#07080b] prose-pre:border prose-pre:border-brand-800 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline prose-md">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({node, children, ...props}) => <h1 id={generateSlug(children)} {...props}>{children}</h1>,
                                h2: ({node, children, ...props}) => <h2 id={generateSlug(children)} {...props}>{children}</h2>,
                                h3: ({node, children, ...props}) => <h3 id={generateSlug(children)} {...props}>{children}</h3>
                            }}
                        >
                            {language === 'en' && post.contentEn ? post.contentEn : post.content}
                        </ReactMarkdown>
                    </div>
                </motion.article>
            </main>

            {/* Sidebar Toggle Button (Coding Program) */}
            {tocItems.length > 0 && (
                <button
                    onClick={() => {
                        setIsSidebarOpen(!isSidebarOpen);
                        lottieRef.current?.goToAndPlay(0, true);
                    }}
                    className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-24 h-24 z-[70] flex items-center justify-center transition-transform hover:-translate-y-1 cursor-pointer"
                >
                    <div className="w-full h-full drop-shadow-[0_0_25px_rgba(101,175,157,0.8)]">
                        <Lottie lottieRef={lottieRef} animationData={codingIcon} loop={false} className="w-full h-full" />
                    </div>
                </button>
            )}

            {/* Backdrop invisible helper for closing sidebar on mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-[55] lg:hidden"
                ></div>
            )}

            {/* Sidebar Panel Table of Contents */}
            {tocItems.length > 0 && (
                <aside className={`fixed top-0 right-0 h-full w-72 lg:w-80 bg-[#07080b]/95 backdrop-blur-xl border-l border-brand-800 shadow-2xl z-[60] transform transition-transform duration-500 ease-spring flex flex-col ${isSidebarOpen ? 'translate-x-0' : (hasPeeked ? 'translate-x-[90%]' : 'translate-x-full')}`}>
                    <div className="h-28 flex items-end px-6 pb-6 border-b border-brand-800/40">
                        <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                            <span className="text-brand-500">☰</span> {t('blog_toc_title')}
                        </h3>
                    </div> 

                    <nav className="flex-1 overflow-y-auto px-6 py-6 pb-24 flex flex-col gap-4 relative z-50 pointer-events-auto">
                        <p className="text-gray-500 text-xs italic mb-2 border-b border-brand-800/30 pb-4">{t('blog_on_this_page')}...</p>
                        {tocItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleScrollTo(item.id)}
                                className={`text-left text-sm font-mono hover:text-brand-400 transition-colors cursor-pointer group flex items-start pointer-events-auto
                                    ${item.level === 1 ? 'text-white font-bold mt-2' : ''}
                                    ${item.level === 2 ? 'text-gray-300 ml-4' : ''}
                                    ${item.level === 3 ? 'text-gray-500 ml-8 text-xs' : ''}
                                `}
                            >
                                <span className="opacity-0 group-hover:opacity-100 text-brand-500 transition-opacity mr-2 flex-shrink-0">→</span>
                                <span className="-ml-4 group-hover:ml-0 transition-all">{item.text}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
            )}
        </div>
    )
}

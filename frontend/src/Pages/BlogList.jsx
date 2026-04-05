import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'
import TypewriterText from '../components/TypewriterText'
import Lottie from 'lottie-react'
import codingIcon from '../assets/Codinganimation.json'

export default function BlogList() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
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

    const filteredPosts = posts.filter(post => {
        if (!searchTerm.trim()) return true;
        const s = searchTerm.toLowerCase();
        const title = (language === 'en' && post.titleEn ? post.titleEn : post.title).toLowerCase();
        const desc = (language === 'en' && post.summaryEn ? post.summaryEn : post.summary).toLowerCase();
        return title.includes(s) || desc.includes(s);
    });

    const groupedPosts = filteredPosts.reduce((acc, post) => {
        const date = new Date(post.publishedAt);
        const monthYearRaw = date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { year: 'numeric', month: 'long' });
        // Formato para maiúscula: "Abril de 2026", "April 2026", garantindo consistência
        const capitalized = monthYearRaw.charAt(0).toUpperCase() + monthYearRaw.slice(1);

        if (!acc[capitalized]) acc[capitalized] = [];
        acc[capitalized].push(post);
        return acc;
    }, {});

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

    return (
        <div className="w-full min-h-screen bg-transparent text-gray-300 font-sans">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-16">
                <header className="mb-12 border-b border-brand-800 pb-6">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        <TypewriterText text={t('blog_title')} speed={15} />
                    </h1>
                    <p className="text-gray-400">{t('blog_desc')}</p>
                </header>

                {isLoading ? (
                    <div className="animate-pulse space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-brand-800/40 rounded-lg"></div>
                        ))}
                    </div>
                ) : Object.keys(groupedPosts).length === 0 ? (
                    <p className="text-gray-500 italic">{posts.length === 0 ? t('blog_empty') : "Nenhum artigo encontrado."}</p>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(groupedPosts).map(([monthYear, groupPosts]) => (
                            <section key={monthYear} id={`group-${monthYear.replace(/\s+/g, '-')}`}>
                                <h2 className="text-2xl font-bold font-mono tracking-tight text-brand-400 mb-6 border-b border-brand-800/50 pb-2">
                                    <span className="opacity-50 mr-2">#</span>{monthYear}
                                </h2>
                                <div className="space-y-4">
                                    {groupPosts.map((post, index) => (
                                        <motion.article
                                            key={post.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group block p-5 md:p-6 -mx-4 rounded-xl hover:bg-brand-800/30 transition-colors"
                                        >
                                            <Link to={`/blog/${post.slug}`}>
                                                <div className="flex flex-col gap-1 cursor-pointer">
                                                    <div className="flex items-center gap-3 text-sm text-brand-400 font-mono mb-1">
                                                        <span>
                                                            {new Date(post.publishedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
                                                                day: '2-digit', month: 'short', year: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className="text-gray-600">•</span>
                                                        <span className="text-gray-500">{Math.max(1, Math.ceil(post.content.length / 800))} min {language === 'en' ? 'read' : 'de leitura'}</span>
                                                    </div>
                                                    <h2 className="text-xl md:text-2xl font-bold text-gray-100 group-hover:text-brand-300 transition-colors leading-snug">
                                                        <TypewriterText text={language === 'en' && post.titleEn ? post.titleEn : post.title} speed={25} />
                                                    </h2>
                                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
                                                        {language === 'en' && post.summaryEn ? post.summaryEn : post.summary}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* Sidebar Toggle Button (Coding Program) */}
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

            {/* Backdrop invisible helper for closing sidebar on mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-[55] lg:hidden"
                ></div>
            )}

            {/* Sidebar Panel On This Page */}
            <aside className={`fixed top-0 right-0 h-full w-72 lg:w-80 bg-[#07080b]/95 backdrop-blur-xl border-l border-brand-800 shadow-2xl z-[60] transform transition-transform duration-500 ease-spring flex flex-col ${isSidebarOpen ? 'translate-x-0' : (hasPeeked ? 'translate-x-[90%]' : 'translate-x-full')}`}>
                <div className="h-28 flex items-end px-6 pb-2">
                    <h3 className="text-xl font-bold tracking-tight text-white">
                        {t('blog_on_this_page')}
                    </h3>
                </div>

                <div className="px-6 py-6 border-b border-brand-800/40">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('blog_search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#101513] border border-brand-800 focus:border-brand-500 rounded-lg px-4 py-2.5 pl-10 text-sm text-gray-200 outline-none transition-colors"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            🔍
                        </span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-6 py-6 pb-24 flex flex-col gap-4 relative z-50 pointer-events-auto">
                    {Object.keys(groupedPosts).length === 0 ? (
                        <p className="text-xs text-gray-600 font-mono italic">No results matches.</p>
                    ) : (
                        Object.keys(groupedPosts).map(monthYear => (
                            <button
                                key={monthYear}
                                onClick={() => handleScrollTo(`group-${monthYear.replace(/\s+/g, '-')}`)}
                                className="text-left text-sm font-mono text-gray-400 hover:text-brand-400 transition-colors cursor-pointer group flex flex-col pointer-events-auto"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="opacity-0 group-hover:opacity-100 text-brand-500 transition-opacity">→</span>
                                    {monthYear}
                                </span>
                                <span className="pl-6 text-xs text-gray-600 opacity-60">
                                    {groupedPosts[monthYear].length} post(s)
                                </span>
                            </button>
                        ))
                    )}
                </nav>
            </aside>
        </div>
    )
}

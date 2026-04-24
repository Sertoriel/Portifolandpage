import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router'
import logo from '../assets/ST.png'
import { useLanguage } from '../contexts/LanguageContext'
import TranslateButton from './TranslateButton'

export default function Navbar() {
    const { t } = useLanguage()
    const location = useLocation()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isHome = location.pathname === '/'

    const scrollToSection = (id) => {
        setIsMenuOpen(false) // Close menu on click
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4"
        >
            <div className="max-w-7xl mx-auto bg-brand-900/40 backdrop-blur-md border border-brand-700/50 rounded-2xl px-4 md:px-6 py-3 shadow-lg">
                
                {/* Linha Principal (Top Bar) */}
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg md:text-xl font-bold text-white tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity">
                        <img src={logo} alt='StLogo' className='w-6 h-6 md:w-8 md:h-8 object-contain' />
                        Sertori<p className="text-brand-500">.dev</p>
                    </Link>

                    {/* Botões Mobile (Tradutor + Hamburger) */}
                    <div className="md:hidden flex items-center gap-3">
                        <TranslateButton />
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none p-1 cursor-pointer"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Elementos Desktop (Ocultos no Mobile) */}
                    <div className="hidden md:flex items-center justify-end gap-6 flex-1">
                        {/* Links Centrais Desktop */}
                        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                            {isHome ? (
                                <>
                                    <button onClick={() => scrollToSection('hero')} className="hover:text-brand-400 transition-colors cursor-pointer">{t('nav_home')}</button>
                                    <button onClick={() => scrollToSection('projetos')} className="hover:text-brand-400 transition-colors cursor-pointer">{t('nav_projects')}</button>
                                    <button onClick={() => scrollToSection('contato')} className="hover:text-brand-400 transition-colors cursor-pointer">{t('nav_contact')}</button>
                                </>
                            ) : (
                                <Link to="/" className="hover:text-brand-400 transition-colors cursor-pointer">{t('nav_back_home')}</Link>
                            )}
                        </div>

                        {/* Botões Direita Desktop */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/blog')}
                                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,134,95,0.4)] hover:shadow-[0_0_25px_rgba(37,106,94,0.6)] cursor-pointer whitespace-nowrap"
                            >
                                {t('nav_articles_btn')}
                            </button>
                            <TranslateButton />
                        </div>
                    </div>
                </div>

                {/* Dropdown Menu Mobile */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden mt-4 pt-4 border-t border-brand-700/50 flex flex-col gap-2"
                        >
                            {isHome ? (
                                <>
                                    <button onClick={() => scrollToSection('hero')} className="text-left text-gray-300 hover:text-white font-medium py-3 px-2 rounded-lg hover:bg-brand-800/30 transition-colors cursor-pointer">{t('nav_home')}</button>
                                    <button onClick={() => scrollToSection('projetos')} className="text-left text-gray-300 hover:text-white font-medium py-3 px-2 rounded-lg hover:bg-brand-800/30 transition-colors cursor-pointer">{t('nav_projects')}</button>
                                    <button onClick={() => scrollToSection('contato')} className="text-left text-gray-300 hover:text-white font-medium py-3 px-2 rounded-lg hover:bg-brand-800/30 transition-colors cursor-pointer">{t('nav_contact')}</button>
                                </>
                            ) : (
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-left text-gray-300 hover:text-white font-medium py-3 px-2 rounded-lg hover:bg-brand-800/30 transition-colors cursor-pointer">{t('nav_back_home')}</Link>
                            )}
                            
                            <button
                                onClick={() => { setIsMenuOpen(false); navigate('/blog'); }}
                                className="w-full mt-2 px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,134,95,0.4)] cursor-pointer text-center"
                            >
                                {t('nav_articles_btn')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.nav>
    )
}
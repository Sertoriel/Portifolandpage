import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router' // Correção sutil no import do react-router-dom
import { useNavigate } from 'react-router' // Adicionado para navegar para o admin
import logo from '../assets/ST.png'
import { useLanguage } from '../contexts/LanguageContext'
import TranslateButton from './TranslateButton'

export default function Navbar() {
    const { t } = useLanguage()
    const location = useLocation()
    const navigate = useNavigate()
    const isHome = location.pathname === '/'

    const scrollToSection = (id) => {
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
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between bg-brand-900/40 backdrop-blur-md border border-brand-700/50 rounded-2xl px-4 md:px-6 py-2 md:py-3 shadow-lg gap-y-3">

                {/* Esquerda: Logo */}
                <Link to="/" className="text-lg md:text-xl font-bold text-white tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity">
                    <img
                        src={logo}
                        alt='StLogo'
                        className='w-6 h-6 md:w-8 md:h-8 object-contain'
                    />
                    Sertori<p className="text-brand-500">.dev</p>
                </Link>

                {/* Direita: Botões Principais (Artigos + Idioma) */}
                <div className="flex items-center gap-2 md:gap-4 order-2 md:order-3">
                    <button
                        onClick={() => navigate('/blog')}
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs md:text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,134,95,0.4)] hover:shadow-[0_0_25px_rgba(37,106,94,0.6)] cursor-pointer whitespace-nowrap"
                    >
                        {t('nav_articles_btn')}
                    </button>
                    <TranslateButton />
                </div>

                {/* Centro: Links de Navegação (Desce pro rodapé no mobile para não sumir) */}
                <div className="flex items-center gap-4 md:gap-8 text-xs md:text-sm font-medium text-gray-300 w-full md:w-auto order-3 md:order-2 overflow-x-auto whitespace-nowrap pb-1 md:pb-0 justify-center md:justify-start">
                    {isHome ? (
                        <>
                            <button onClick={() => scrollToSection('hero')} className="hover:text-brand-400 transition-colors cursor-pointer shrink-0">{t('nav_home')}</button>
                            <button onClick={() => scrollToSection('projetos')} className="hover:text-brand-400 transition-colors cursor-pointer shrink-0">{t('nav_projects')}</button>
                            <button onClick={() => scrollToSection('contato')} className="hover:text-brand-400 transition-colors cursor-pointer shrink-0">{t('nav_contact')}</button>
                        </>
                    ) : (
                        <Link to="/" className="hover:text-brand-400 transition-colors cursor-pointer shrink-0">{t('nav_back_home')}</Link>
                    )}
                </div>

            </div>
        </motion.nav>
    )
}
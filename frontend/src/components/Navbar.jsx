import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router' // Correção sutil no import do react-router-dom
import { useNavigate } from 'react-router' // Adicionado para navegar para o admin
import logo from '../assets/ST.png'

export default function Navbar() {
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
            className="fixed top-0 left-0 w-full z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl px-6 py-3 shadow-lg">

                <Link to="/" className="text-xl font-bold text-white tracking-wider flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img
                        src={logo}
                        alt='StLogo'
                        className='w-8 h-8 object-contain'
                    />
                    Sertori<span className="text-blue-500">.dev</span>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                        {isHome ? (
                            <>
                                <button onClick={() => scrollToSection('hero')} className="hover:text-blue-400 transition-colors cursor-pointer">Início</button>
                                <button onClick={() => scrollToSection('projetos')} className="hover:text-blue-400 transition-colors cursor-pointer">Projetos</button>
                            </>
                        ) : (
                            <Link to="/" className="hover:text-blue-400 transition-colors cursor-pointer">Voltar para a Home</Link>
                        )}
                    </div>

                    {/* O seu botão agora leva para a área de Login/Admin */}
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] cursor-pointer"
                    >
                        Admin
                    </button>
                </div>

            </div>
        </motion.nav>
    )
}
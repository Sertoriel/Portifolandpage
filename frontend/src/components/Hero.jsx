import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { useNavigate } from 'react-router'

/* Animations */
import AIanimation from '../assets/AI.json'

export default function Hero() {
    const navigate = useNavigate()

    // Função para o botão principal rolar até os projetos
    const scrollToProjects = () => {
        const element = document.getElementById('projetos')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden">

            {/* Efeito de luz (Glow) de fundo mais intenso */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-6xl z-10">

                {/* Lado Esquerdo: Textos e Botões */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center md:items-start text-center md:text-left flex-1"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="px-4 py-2 mb-6 bg-gray-900 border border-gray-700 rounded-full text-sm md:text-base text-gray-300 font-medium shadow-lg inline-block"
                    >
                        🚀 Welcome to the Backend & Game Dev realm
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-tight text-white">
                        Olá, eu sou <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-brand-600">
                            João Arthur
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-lg mb-8 leading-relaxed">
                        Software Engineer especializado em lógicas complexas e arquiteturas escaláveis. Desenvolvendo ferramentas sólidas e universos de jogos interativos.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            onClick={scrollToProjects}
                            className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,106,94,0.3)] hover:shadow-[0_0_30px_rgba(37,106,94,0.6)] cursor-pointer"
                        >
                            Explorar Projetos ↓
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            className="px-8 py-4 bg-gray-900 border border-brand-900 hover:bg-gray-800 hover:border-brand-500/50 hover:text-brand-300 text-gray-300 rounded-xl font-bold text-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            Ler Artigos 📝
                        </button>
                        <a
                            href="https://github.com/sertoriel"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-4 bg-[#0b0c10] border border-gray-800 hover:bg-gray-900 text-gray-400 hover:text-white rounded-xl font-bold text-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            GitHub
                        </a>
                    </div>
                </motion.div>

                {/* Lado Direito: A sua animação Lottie */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] flex-shrink-0 relative flex items-center justify-center z-10"
                >
                    {/* Um glow leve só atrás da animação */}
                    <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full"></div>

                    <Lottie
                        animationData={AIanimation}
                        loop={true}
                        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 0px 20px rgba(79,134,95,0.4))' }}
                    />
                </motion.div>
            </div>

            {/* Efeito de gradiente na base pra misturar com a próxima seção removido para Global Background */}
        </section>
    )
}
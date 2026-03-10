import { motion } from 'framer-motion'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full py-8 border-t border-gray-800 bg-[#07080b] relative z-20">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-gray-500 text-sm text-center md:text-left"
                >
                    <p>© {currentYear} João Arthur. Todos os direitos reservados.</p>
                    <p className="mt-1">Desenvolvido com React, Tailwind e .NET 10.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex gap-6"
                >
                    {/* Substitua os '#' pelos seus links reais */}
                    <a href="#" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors font-bold tracking-wider text-sm uppercase">
                        GitHub
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors font-bold tracking-wider text-sm uppercase">
                        LinkedIn
                    </a>
                    <a href="mailto:seuemail@exemplo.com" className="text-gray-400 hover:text-blue-400 transition-colors font-bold tracking-wider text-sm uppercase">
                        Email
                    </a>
                </motion.div>

            </div>
        </footer>
    )
}
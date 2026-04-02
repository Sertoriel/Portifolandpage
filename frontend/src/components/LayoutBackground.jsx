import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import DotsAnimation from '../assets/Dotsdancing.json'

export default function LayoutBackground() {
    return (
        <div className="fixed inset-0 w-full h-full z-[-1] bg-[#010302] overflow-hidden pointer-events-none">
            {/* Lottie Animation at opacity-30, inverted because the dots are black */}
            {/* Lado Esquerdo - Lottie Animation que desvanece pra direita e pra baixo */}
            <div className="absolute top-0 bottom-0 left-0 w-[40%] md:w-[35%] opacity-5 invert mix-blend-screen overflow-hidden pointer-events-none flex items-start justify-start [mask-image:radial-gradient(ellipse_at_top_left,black_40%,transparent_80%)]">
                <Lottie
                    animationData={DotsAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Lado Direito - Lottie Animation que desvanece pra esquerda e pra baixo */}
            <div className="absolute top-0 bottom-0 right-0 w-[40%] md:w-[35%] opacity-5 invert mix-blend-screen overflow-hidden pointer-events-none flex items-start justify-end [mask-image:radial-gradient(ellipse_at_top_right,black_40%,transparent_80%)]">
                <Lottie
                    animationData={DotsAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Overlay Gradient to darken it slightly so it stays subtle (atenuação máxima 60%) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#010302]/30 to-[#010302]/60"></div>

            {/* Global background glow (brand colors) spread out */}
            <div className="absolute top-[10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-600/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-500/10 blur-[150px] rounded-full"></div>
            <div className="absolute top-[60%] left-[20%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-brand-700/5 blur-[120px] rounded-full"></div>
        </div>
    )
}

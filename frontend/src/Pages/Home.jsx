// src/pages/Home.jsx
import Hero from '../components/Hero'
import FeatureSection from '../components/FeatureSection'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer' // <-- Não esqueça de importar o arquivo que criamos na mensagem anterior

export default function Home() {
    return (
        <div className="w-full min-h-screen bg-[#0b0c10] overflow-hidden font-sans">
            <Navbar />

            <div id="hero">
                <Hero />
            </div>

            <div id="projetos">
                <FeatureSection />
            </div>

            {/* O Footer entra logo abaixo dos projetos */}
            <Footer />
        </div>
    )
}
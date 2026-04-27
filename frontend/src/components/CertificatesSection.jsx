import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router'
import { useLanguage } from '../contexts/LanguageContext'

const CategoryCarousel = ({ category, certs, navigate, t }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => setCurrentIndex((prev) => (prev === certs.length - 1 ? 0 : prev + 1))
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? certs.length - 1 : prev - 1))

    if (!certs || certs.length === 0) return null

    const cert = certs[currentIndex]

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b border-brand-800 pb-2">
                <h3 className="text-2xl font-bold text-brand-300">{category}</h3>
                {certs.length > 1 && (
                    <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-2 bg-brand-900 border border-brand-700 rounded-full text-brand-400 hover:text-white hover:bg-brand-700 transition-colors shadow-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={nextSlide} className="p-2 bg-brand-900 border border-brand-700 rounded-full text-brand-400 hover:text-white hover:bg-brand-700 transition-colors shadow-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="relative w-full flex items-center pb-4 pt-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full"
                    >
                        <div className="bg-brand-900/40 backdrop-blur-md border border-brand-700/50 rounded-2xl p-6 shadow-lg hover:border-brand-500 transition-colors flex flex-row items-center justify-between group gap-4">
                            <div className="flex flex-col flex-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">{cert.platform}</span>
                                <h4 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-brand-300 transition-colors">{cert.title}</h4>
                                {cert.issueDate && (
                                    <p className="text-sm text-gray-500 mt-2 mb-2">
                                        Emitido: {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div 
                                onClick={() => navigate('/preview', { state: { title: cert.title, url: cert.fileUrl } })}
                                className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-brand-700/50 relative group/cert cursor-pointer shadow-[0_0_15px_rgba(37,106,94,0.3)] hover:shadow-[0_0_25px_rgba(79,134,95,0.6)] transition-all"
                            >
                                {cert.fileUrl ? (
                                    <img 
                                        src={cert.fileUrl.replace('/upload/fl_attachment/', '/upload/').replace('.pdf', '.jpg')} 
                                        alt="Mini Preview" 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/cert:scale-110"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-brand-800 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">PDF</span>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2">
                                    <svg className="w-8 h-8 text-brand-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    <span className="text-white font-bold text-xs text-center uppercase tracking-wider">{t('cert_view')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {certs.length > 1 && (
                <div className="flex justify-center gap-2 mt-2">
                    {certs.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-brand-500" : "w-2 bg-brand-800 hover:bg-gray-500"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CertificatesSection() {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/Certificate`)
                if (res.ok) {
                    const data = await res.json()
                    setCertificates(data)
                }
            } catch (error) {
                console.error("Erro ao carregar certificados")
            } finally {
                setLoading(false)
            }
        }
        fetchCerts()
    }, [])

    if (loading || certificates.length === 0) return null

    // Agrupamento por Categoria
    const groupedByCategory = certificates.reduce((acc, cert) => {
        const cat = cert.category || 'Outros'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(cert)
        return acc
    }, {})

    return (
        <section className="w-full py-20 px-6 md:px-12 flex flex-col items-center justify-center relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-6xl z-10"
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-brand-600">{t('cert_title')}</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('cert_desc')}
                    </p>
                </div>

                <div className="flex flex-col gap-12">
                    {Object.entries(groupedByCategory).map(([category, certs]) => (
                        <CategoryCarousel key={category} category={category} certs={certs} navigate={navigate} t={t} />
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

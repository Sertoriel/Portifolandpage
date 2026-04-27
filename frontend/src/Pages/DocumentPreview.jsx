import { useLocation, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function DocumentPreview() {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { title, url } = location.state || {}

    // Redireciona para a home caso o usuário caia aqui diretamente sem passar um documento
    useEffect(() => {
        if (!url) {
            navigate('/')
        }
    }, [url, navigate])

    if (!url) return null

    // Converte a URL do PDF do Cloudinary para uma imagem JPG gerando a thumbnail mágica
    const previewImageUrl = url.replace('/upload/fl_attachment/', '/upload/').replace('.pdf', '.jpg')

    return (
        <div className="min-h-screen bg-transparent text-white flex flex-col font-sans relative z-10">
            {/* Minimal Header */}
            <header className="w-full py-4 px-6 border-b border-brand-800/50 flex justify-between items-center bg-brand-900/40 backdrop-blur-md sticky top-0 z-50">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer font-bold"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('preview_back')}
                </button>
                <h1 className="text-xl font-bold text-brand-300 truncate max-w-[200px] sm:max-w-md">{title || 'Documento'}</h1>
                <a 
                    href={url}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(79,134,95,0.4)] cursor-pointer flex items-center gap-2"
                >
                    <span className="hidden sm:inline">{t('preview_download')}</span>
                    <span className="sm:hidden">{t('preview_download_mobile')}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>
            </header>

            {/* Document Viewer */}
            <main className="flex-1 flex justify-center items-start p-4 sm:p-8 overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl bg-[#010302]/80 border border-brand-700/50 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center"
                >
                    <img 
                        src={previewImageUrl} 
                        alt={title}
                        className="w-full h-auto object-contain max-h-[80vh]"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.innerHTML = `<div class="p-12 text-center text-gray-400">${t('preview_error')}</div>`;
                        }}
                    />
                </motion.div>
            </main>
        </div>
    )
}

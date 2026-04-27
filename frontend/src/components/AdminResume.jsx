import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AdminResume() {
    const [status, setStatus] = useState({ loading: false, message: '', type: '' })
    const [filePt, setFilePt] = useState(null)
    const [fileEn, setFileEn] = useState(null)
    const [currentLinks, setCurrentLinks] = useState({ PT: null, EN: null })

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            const resPt = await fetch(`${import.meta.env.VITE_API_URL}/Resume?lang=PT`)
            const dataPt = resPt.ok ? await resPt.json() : null

            const resEn = await fetch(`${import.meta.env.VITE_API_URL}/Resume?lang=EN`)
            const dataEn = resEn.ok ? await resEn.json() : null

            setCurrentLinks({
                PT: dataPt?.fileUrl || null,
                EN: dataEn?.fileUrl || null
            })
        } catch (error) {
            console.error('Error fetching resumes:', error)
        }
    }

    const handleUpload = async (lang, file) => {
        if (!file) return

        setStatus({ loading: true, message: `Fazendo upload do currículo ${lang}...`, type: 'info' })

        const payload = new FormData()
        payload.append('language', lang)
        payload.append('file', file)

        try {
            const token = localStorage.getItem('portfolio_token')
            const res = await fetch(`${import.meta.env.VITE_API_URL}/Resume/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: payload
            })

            if (res.ok) {
                setStatus({ loading: false, message: `Currículo ${lang} atualizado com sucesso!`, type: 'success' })
                fetchResumes()
            } else {
                const err = await res.text()
                setStatus({ loading: false, message: `Erro ao enviar: ${err}`, type: 'error' })
            }
        } catch (error) {
            console.error(error)
            setStatus({ loading: false, message: 'Falha na conexão.', type: 'error' })
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold mb-6">Gestão de Currículos (PDFs)</h2>

            {status.message && (
                <div className={`p-4 mb-6 rounded-lg font-bold ${status.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : status.type === 'error' ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-brand-900/50 text-brand-400 border border-brand-800'}`}>
                    {status.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PT-BR */}
                <div className="bg-brand-900 border border-brand-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-2">Currículo PT-BR</h3>
                    {currentLinks.PT ? (
                        <a href={currentLinks.PT} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline text-sm mb-4 block">
                            Ver PDF Atual
                        </a>
                    ) : (
                        <p className="text-gray-500 text-sm mb-4">Nenhum PDF enviado ainda.</p>
                    )}

                    <div className="flex flex-col gap-4">
                        <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={(e) => setFilePt(e.target.files[0])}
                            className="bg-brand-800 border border-brand-700 rounded-lg p-2 text-white text-sm" 
                        />
                        <button 
                            onClick={() => handleUpload('PT', filePt)}
                            disabled={!filePt || status.loading}
                            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold transition-all disabled:opacity-50"
                        >
                            Upload PT-BR
                        </button>
                    </div>
                </div>

                {/* EN */}
                <div className="bg-blue-900/40 border border-blue-800/50 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-blue-200 mb-2">Curriculum EN</h3>
                    {currentLinks.EN ? (
                        <a href={currentLinks.EN} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline text-sm mb-4 block">
                            View Current PDF
                        </a>
                    ) : (
                        <p className="text-gray-500 text-sm mb-4">No PDF uploaded yet.</p>
                    )}

                    <div className="flex flex-col gap-4">
                        <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={(e) => setFileEn(e.target.files[0])}
                            className="bg-brand-800 border border-brand-700 rounded-lg p-2 text-white text-sm" 
                        />
                        <button 
                            onClick={() => handleUpload('EN', fileEn)}
                            disabled={!fileEn || status.loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all disabled:opacity-50"
                        >
                            Upload ENG
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

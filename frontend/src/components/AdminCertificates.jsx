import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AdminCertificates() {
    const [status, setStatus] = useState({ loading: false, message: '', type: '' })
    const [certificates, setCertificates] = useState([])

    const [formData, setFormData] = useState({
        title: '',
        platform: '',
        category: '',
        issueDate: '',
        file: null
    })

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/Certificate`)
            if (res.ok) {
                const data = await res.json()
                setCertificates(data)
            }
        } catch (error) {
            console.error('Error fetching certs:', error)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.file) {
            setStatus({ loading: false, message: 'É obrigatório enviar uma imagem ou PDF.', type: 'error' })
            return
        }

        setStatus({ loading: true, message: 'Processando upload...', type: 'info' })

        const payload = new FormData()
        payload.append('title', formData.title)
        payload.append('platform', formData.platform)
        payload.append('category', formData.category)
        if (formData.issueDate) payload.append('issueDate', formData.issueDate)
        payload.append('file', formData.file)

        try {
            const token = localStorage.getItem('portfolio_token')
            const res = await fetch(`${import.meta.env.VITE_API_URL}/Certificate`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: payload
            })

            if (res.ok) {
                setStatus({ loading: false, message: 'Certificado cadastrado!', type: 'success' })
                setFormData({ title: '', platform: '', category: '', issueDate: '', file: null })
                fetchCertificates()
            } else {
                setStatus({ loading: false, message: 'Erro ao cadastrar.', type: 'error' })
            }
        } catch (error) {
            setStatus({ loading: false, message: 'Falha na conexão.', type: 'error' })
        }
    }

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Apagar certificado: ${title}?`)) return

        try {
            const token = localStorage.getItem('portfolio_token')
            const res = await fetch(`${import.meta.env.VITE_API_URL}/Certificate/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                fetchCertificates()
            }
        } catch (error) {
            console.error('Delete error', error)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold mb-6">Gestão de Certificados</h2>

            {status.message && (
                <div className={`p-4 mb-6 rounded-lg font-bold ${status.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : status.type === 'error' ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-brand-900/50 text-brand-400 border border-brand-800'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-brand-900 border border-brand-800 rounded-2xl p-6 shadow-lg flex flex-col gap-6 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-300">Título do Curso/Certificado *</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="bg-brand-800 rounded p-3 focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-300">Plataforma (Ex: Alura, Udemy) *</label>
                        <input required type="text" name="platform" value={formData.platform} onChange={handleChange} className="bg-brand-800 rounded p-3 focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-300">Categoria (Ex: Backend, Cloud) *</label>
                        <input required type="text" name="category" value={formData.category} onChange={handleChange} className="bg-brand-800 rounded p-3 focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-300">Data de Emissão</label>
                        <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="bg-brand-800 rounded p-3 focus:outline-none text-gray-200" style={{ colorScheme: 'dark' }} />
                    </div>
                </div>

                <div className="flex flex-col gap-2 border border-brand-700 p-4 rounded-xl">
                    <label className="text-sm font-bold text-purple-300">Arquivo (Imagem ou PDF) *</label>
                    <input 
                        required
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} 
                        className="text-sm"
                    />
                </div>

                <button type="submit" disabled={status.loading} className="py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-bold shadow-lg disabled:opacity-50">
                    {status.loading ? 'Enviando...' : 'Adicionar Certificado'}
                </button>
            </form>

            <h3 className="text-xl font-bold mb-4">Certificados Cadastrados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map(cert => (
                    <div key={cert.id} className="bg-brand-900 border border-brand-800 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                            <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">{cert.category}</span>
                            <h4 className="text-lg font-bold text-white mt-1 line-clamp-2">{cert.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{cert.platform}</p>
                            {cert.issueDate && <p className="text-xs text-gray-500 mt-1">Emitido: {new Date(cert.issueDate).toLocaleDateString()}</p>}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                                Ver Arquivo
                            </a>
                            <button onClick={() => handleDelete(cert.id, cert.title)} className="text-sm text-red-400 hover:text-red-300">
                                Apagar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

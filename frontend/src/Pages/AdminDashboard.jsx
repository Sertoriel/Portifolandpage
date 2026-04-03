import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'
import AdminBlog from '../components/AdminBlog'

export default function AdminDashboard() {
    const navigate = useNavigate()

    const [projectsList, setProjectsList] = useState([]) // Lista de projetos cadastrados
    const [editingId, setEditingId] = useState(null) // Controla se estamos criando ou editando
    
    // Controlador das Tabs do super Painel Administrativo
    const [activeTab, setActiveTab] = useState('projects') // 'projects' ou 'blog'

    const [formData, setFormData] = useState({
        title: '', category: '', shortDescription: '', fullDescription: '',
        titleEn: '', categoryEn: '', shortDescriptionEn: '', fullDescriptionEn: '',
        techs: '', thumbnailUrl: '', githubLink: '', downloadLink: '', image: null
    })

    const [status, setStatus] = useState({ loading: false, message: '', type: '' })

    // 1. Barreira de Entrada e Busca Inicial dos Projetos
    useEffect(() => {
        const token = localStorage.getItem('portfolio_token')
        if (!token) {
            navigate('/login')
            return
        }
        fetchProjects() // Busca os projetos para montar a tabela
    }, [navigate])

    // Função para buscar os projetos e atualizar a lista na tela
    const fetchProjects = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/Projects')
            if (res.ok) {
                const data = await res.json()
                setProjectsList(data)
            }
        } catch (err) {
            console.error("Erro ao carregar lista", err)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // 2. Função de Salvar (Multipart Form)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, message: 'Processando (incluindo upload se anexado)...', type: 'info' })

        // Migramos para FormData nativo do Javascript
        const payload = new FormData()
        
        // Empacotando os textos! ID manda se estivermos editando
        if (editingId) payload.append('Id', editingId)
        payload.append('Title', formData.title)
        payload.append('Category', formData.category)
        payload.append('ShortDescription', formData.shortDescription)
        payload.append('FullDescription', formData.fullDescription)
        // Textos em inglês
        if (formData.titleEn) payload.append('TitleEn', formData.titleEn)
        if (formData.categoryEn) payload.append('CategoryEn', formData.categoryEn)
        if (formData.shortDescriptionEn) payload.append('ShortDescriptionEn', formData.shortDescriptionEn)
        if (formData.fullDescriptionEn) payload.append('FullDescriptionEn', formData.fullDescriptionEn)

        payload.append('Techs', formData.techs) // Envia a string crua para o .NET fazer o split

        if (formData.githubLink) payload.append('GithubLink', formData.githubLink)
        if (formData.downloadLink) payload.append('DownloadLink', formData.downloadLink)
        if (formData.thumbnailUrl) payload.append('ThumbnailUrl', formData.thumbnailUrl)
        
        // Se há um arquivo fisicamente anexado...
        if (formData.image) {
            payload.append('Image', formData.image)
        }

        try {
            const token = localStorage.getItem('portfolio_token')

            const url = editingId
                ? `http://localhost:5000/api/Projects/${editingId}`
                : 'http://localhost:5000/api/Projects'

            const method = editingId ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                headers: {
                    // CUIDADO: Quando mandamos File+Texto, não podemos setar 'Content-Type': 'application/json' 
                    // e nem multipart manual. O browser faz a boundary magic automaticamente para a gente!
                    'Authorization': `Bearer ${token}`
                },
                body: payload
            })

            if (response.ok) {
                setStatus({ loading: false, message: editingId ? 'Projeto atualizado!' : 'Projeto criado!', type: 'success' })
                cancelEdit() // Limpa o form
                fetchProjects() // Atualiza a tabela abaixo para mostrar o resultado novo
            } else {
                setStatus({ loading: false, message: 'Erro ao salvar. Verifique o console.', type: 'error' })
            }
        } catch (error) {
            console.error(error)
            setStatus({ loading: false, message: 'Falha na conexão.', type: 'error' })
        }
    }

    // Tradutor Mágico
    const handleAutoTranslate = async () => {
        const token = localStorage.getItem('portfolio_token')
        setStatus({ loading: true, message: 'Traduzindo com a IA (Google Translate)... aguarde!', type: 'info' })
        try {
            const translateField = async (text) => {
                if (!text) return ''
                const res = await fetch('http://localhost:5000/api/Translation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ text })
                })
                if (res.ok) {
                    const data = await res.json()
                    return data.translatedText
                }
                return text // fallback para o original caso a api falhe localmente
            }

            const transTitle = await translateField(formData.title)
            const transCat = await translateField(formData.category)
            const transShort = await translateField(formData.shortDescription)
            const transFull = await translateField(formData.fullDescription)

            setFormData((prev) => ({
                ...prev,
                titleEn: transTitle,
                categoryEn: transCat,
                shortDescriptionEn: transShort,
                fullDescriptionEn: transFull
            }))
            setStatus({ loading: false, message: 'Sucesso! Campos preenchidos automaticamente.', type: 'success' })
        } catch (error) {
            console.error(error)
            setStatus({ loading: false, message: 'Erro na tradução.', type: 'error' })
        }
    }

    // 3. Função de Deletar
    const handleDelete = async (id, title) => {
        const confirmDelete = window.confirm(`Tem certeza que deseja apagar o projeto "${title}"?`)
        if (!confirmDelete) return

        try {
            const token = localStorage.getItem('portfolio_token')
            const response = await fetch(`http://localhost:5000/api/Projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                fetchProjects() // Atualiza a lista tirando o projeto apagado
                if (editingId === id) cancelEdit() // Se estava editando o projeto que acabou de apagar, limpa o form
            } else {
                alert("Erro ao apagar projeto.")
            }
        } catch (error) {
            console.error("Erro no delete:", error)
        }
    }

    // 4. Prepara o form para edição
    const startEdit = (project) => {
        setEditingId(project.id)
        setFormData({
            title: project.title,
            category: project.category,
            shortDescription: project.shortDescription,
            fullDescription: project.fullDescription,
            titleEn: project.titleEn || '',
            categoryEn: project.categoryEn || '',
            shortDescriptionEn: project.shortDescriptionEn || '',
            fullDescriptionEn: project.fullDescriptionEn || '',
            techs: project.techs.join(', '), // Transforma o Array de volta em String para o input
            thumbnailUrl: project.thumbnailUrl || '',
            githubLink: project.githubLink || '',
            downloadLink: project.downloadLink || '',
            image: null // Reseta a imagem pra não re-enviar arquivo antigo sem querer
        })
        // Rola a página para o topo suavemente para ver o form
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStatus({ loading: false, message: `Editando: ${project.title}`, type: 'info' })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({ title: '', category: '', shortDescription: '', fullDescription: '', titleEn: '', categoryEn: '', shortDescriptionEn: '', fullDescriptionEn: '', techs: '', thumbnailUrl: '', githubLink: '', downloadLink: '', image: null })
        setStatus({ loading: false, message: '', type: '' })
    }

    return (
        <div className="w-full min-h-screen bg-transparent text-white p-8 md:p-16 font-sans">
            <Navbar />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mt-20">

                {/* Cabeçalho do Admin */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-4xl font-bold">Painel Admin</h1>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                            Ver Portfólio
                        </button>
                        <button onClick={() => {
                            localStorage.removeItem('portfolio_token')
                            navigate('/login')
                        }} className="text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer">
                            Sair
                        </button>
                    </div>
                </div>

                {/* TAB SWITCHER */}
                <div className="flex bg-brand-900 border border-brand-800 rounded-xl p-1 mb-8 shadow-inner">
                    <button 
                        onClick={() => setActiveTab('projects')}
                        className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all text-sm md:text-base cursor-pointer ${activeTab === 'projects' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-brand-800'}`}
                    >
                        📁 Gestão de Projetos
                    </button>
                    <button 
                        onClick={() => setActiveTab('blog')}
                        className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all text-sm md:text-base cursor-pointer ${activeTab === 'blog' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-brand-800'}`}
                    >
                        📝 Gestão do Blog
                    </button>
                </div>

                {activeTab === 'blog' && <AdminBlog />}

                {activeTab === 'projects' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        {/* Status Message */}
                        {status.message && (
                            <div className={`p-4 mb-6 rounded-lg font-bold ${status.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : status.type === 'error' ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-brand-900/50 text-brand-400 border border-brand-800'}`}>
                                {status.message}
                            </div>
                        )}

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit} className="bg-brand-900 border border-brand-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 mb-12 relative">
                    {/* Badge indicando se é edição */}
                    {editingId && (
                        <div className="absolute -top-4 left-8 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                            Modo de Edição Ativo
                        </div>
                    )}
                    
                    {/* Linha Divisória de Tradução */}
                    <div className="flex flex-col md:flex-row items-center justify-between bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl mb-2 gap-4">
                        <div className="text-sm text-blue-200">
                            <strong>Tradução Automática:</strong> Preencha o lado em PT-BR e clique no raio.
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAutoTranslate} 
                            disabled={status.loading || !formData.title} 
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer w-full md:w-auto"
                        >
                            ⚡ Auto-Traduzir (EN)
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-brand-300 font-bold">Título do Projeto (PT-BR) *</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="bg-brand-800 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-blue-300 font-bold">Título (EN) *</label>
                            <input required type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className="bg-blue-900 border border-blue-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-brand-300 font-bold">Categoria (PT-BR) *</label>
                            <input required type="text" name="category" value={formData.category} onChange={handleChange} className="bg-brand-800 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-blue-300 font-bold">Categoria (EN) *</label>
                            <input required type="text" name="categoryEn" value={formData.categoryEn} onChange={handleChange} className="bg-blue-900 border border-blue-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-brand-300 font-bold">Descrição Curta (PT-BR) *</label>
                            <input required type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="bg-brand-800 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-blue-300 font-bold">Descrição Curta (EN) *</label>
                            <input required type="text" name="shortDescriptionEn" value={formData.shortDescriptionEn} onChange={handleChange} className="bg-blue-900 border border-blue-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-brand-300 flex items-center justify-between">
                                Descrição Completa (PT-BR)
                            </label>
                            <textarea required name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows="8" placeholder="# Meu Projeto..." className="bg-brand-800 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 font-mono text-sm leading-relaxed"></textarea>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-blue-300 flex items-center justify-between">
                                Descrição Completa (EN)
                            </label>
                            <textarea required name="fullDescriptionEn" value={formData.fullDescriptionEn} onChange={handleChange} rows="8" placeholder="# English Markdown..." className="bg-blue-900 border border-blue-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm leading-relaxed"></textarea>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Tecnologias (Vírgula)</label>
                        <input type="text" name="techs" value={formData.techs} onChange={handleChange} className="bg-brand-800 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                    </div>

                    {/* SESSÃO HÍBRIDA DA IMAGEM */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-brand-500/20 bg-brand-900/10">
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-bold text-brand-300 flex justify-between">
                                Thumbnail Web Link
                                {formData.image && <span className="text-xs font-normal text-yellow-500">(Desativado por Upload)</span>}
                            </label>
                            <input disabled={!!formData.image} type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="https://..." className="bg-brand-800 disabled:opacity-40 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-bold text-purple-300 flex justify-between">
                                Ou Upload Físico (Cloudinary)
                                {formData.thumbnailUrl && <span className="text-xs font-normal text-yellow-500">(Limpe o link p/ usar)</span>}
                            </label>
                            <input 
                                disabled={!!formData.thumbnailUrl}
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} 
                                className="bg-brand-800 disabled:opacity-40 border border-brand-700 rounded-lg p-[9px] text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-500" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">GitHub Link</label>
                            <input type="url" name="githubLink" value={formData.githubLink} onChange={handleChange} className="bg-brand-800 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">Download Link</label>
                            <input type="url" name="downloadLink" value={formData.downloadLink} onChange={handleChange} className="bg-brand-800 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button type="submit" disabled={status.loading} className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${status.loading ? 'bg-gray-600' : 'bg-brand-600 hover:bg-brand-500 cursor-pointer shadow-[0_0_20px_rgba(79,134,95,0.4)]'}`}>
                            {status.loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Publicar Novo Projeto'}
                        </button>

                        {/* Se estiver editando, mostra botão de cancelar */}
                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="px-6 bg-brand-700 hover:bg-gray-600 rounded-xl font-bold cursor-pointer transition-colors">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                {/* LISTA DE PROJETOS EXISTENTES */}
                <h2 className="text-2xl font-bold mb-6">Projetos Gerenciados</h2>
                <div className="flex flex-col gap-4">
                    {projectsList.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Nenhum projeto encontrado no banco de dados.</p>
                    ) : (
                        projectsList.map((proj) => (
                            <div key={proj.id} className="bg-brand-900 border border-brand-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-gray-600 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                                        <span className="text-xs bg-brand-800 px-2 py-1 rounded text-gray-400 uppercase tracking-wider">{proj.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2">{proj.shortDescription}</p>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => startEdit(proj)}
                                        className="flex-1 md:flex-none px-6 py-2 bg-brand-900/30 text-brand-400 hover:bg-brand-600 hover:text-white border border-brand-800 rounded-lg font-bold transition-all cursor-pointer"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(proj.id, proj.title)}
                                        className="flex-1 md:flex-none px-6 py-2 bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white border border-red-800 rounded-lg font-bold transition-all cursor-pointer"
                                    >
                                        Apagar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                </div>
            )}

            </motion.div>
        </div>
    )
}
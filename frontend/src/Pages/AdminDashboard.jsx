import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'

export default function AdminDashboard() {
    const navigate = useNavigate()

    const [projectsList, setProjectsList] = useState([]) // Lista de projetos cadastrados
    const [editingId, setEditingId] = useState(null) // Controla se estamos criando ou editando

    const [formData, setFormData] = useState({
        title: '', category: '', shortDescription: '', fullDescription: '',
        techs: '', thumbnailUrl: '', githubLink: '', downloadLink: ''
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

    // 2. Função de Salvar (Inteligente: Sabe se é POST ou PUT)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, message: 'Processando...', type: 'info' })

        const techArray = formData.techs.split(',').map(tech => tech.trim()).filter(tech => tech !== '')

        const projectPayload = {
            id: editingId || 0, // Se estiver editando, manda o ID real. Se não, manda 0 pro banco gerar um novo.
            title: formData.title,
            category: formData.category,
            shortDescription: formData.shortDescription,
            fullDescription: formData.fullDescription,
            techs: techArray,
            thumbnailUrl: formData.thumbnailUrl,
            githubLink: formData.githubLink,
            downloadLink: formData.downloadLink,
            colorClass: "text-blue-400",
            bgBorderClass: "border-blue-500/30"
        }

        try {
            const token = localStorage.getItem('portfolio_token')

            // Se editingId existe, a URL e o Método mudam para atualizar (PUT). Senão, é criar (POST).
            const url = editingId
                ? `http://localhost:5000/api/Projects/${editingId}`
                : 'http://localhost:5000/api/Projects'

            const method = editingId ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(projectPayload)
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
            techs: project.techs.join(', '), // Transforma o Array de volta em String para o input
            thumbnailUrl: project.thumbnailUrl || '',
            githubLink: project.githubLink || '',
            downloadLink: project.downloadLink || ''
        })
        // Rola a página para o topo suavemente para ver o form
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStatus({ loading: false, message: `Editando: ${project.title}`, type: 'info' })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({ title: '', category: '', shortDescription: '', fullDescription: '', techs: '', thumbnailUrl: '', githubLink: '', downloadLink: '' })
        setStatus({ loading: false, message: '', type: '' })
    }

    return (
        <div className="w-full min-h-screen bg-[#0b0c10] text-white p-8 md:p-16 font-sans">
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

                {/* Status Message */}
                {status.message && (
                    <div className={`p-4 mb-6 rounded-lg font-bold ${status.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : status.type === 'error' ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-blue-900/50 text-blue-400 border border-blue-800'}`}>
                        {status.message}
                    </div>
                )}

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 mb-12 relative">
                    {/* Badge indicando se é edição */}
                    {editingId && (
                        <div className="absolute -top-4 left-8 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                            Modo de Edição Ativo
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">Título do Projeto *</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">Categoria *</label>
                            <input required type="text" name="category" value={formData.category} onChange={handleChange} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Descrição Curta *</label>
                        <input required type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Descrição Completa *</label>
                        <textarea required name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows="4" className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"></textarea>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Tecnologias (Vírgula)</label>
                        <input type="text" name="techs" value={formData.techs} onChange={handleChange} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">Thumbnail URL</label>
                            <input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">GitHub Link</label>
                            <input type="url" name="githubLink" value={formData.githubLink} onChange={handleChange} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">Download Link</label>
                            <input type="url" name="downloadLink" value={formData.downloadLink} onChange={handleChange} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button type="submit" disabled={status.loading} className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${status.loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}>
                            {status.loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Publicar Novo Projeto'}
                        </button>

                        {/* Se estiver editando, mostra botão de cancelar */}
                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="px-6 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold cursor-pointer transition-colors">
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
                            <div key={proj.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-gray-600 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400 uppercase tracking-wider">{proj.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2">{proj.shortDescription}</p>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => startEdit(proj)}
                                        className="flex-1 md:flex-none px-6 py-2 bg-blue-900/30 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-800 rounded-lg font-bold transition-all cursor-pointer"
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

            </motion.div>
        </div>
    )
}
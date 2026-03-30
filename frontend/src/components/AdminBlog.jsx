import { useState, useEffect } from 'react'

export default function AdminBlog() {
    const [postsList, setPostsList] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [status, setStatus] = useState({ loading: false, message: '', type: '' })
    
    const [formData, setFormData] = useState({
        title: '', slug: '', summary: '', content: '', isDraft: false
    })

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('portfolio_token')
            const res = await fetch('http://localhost:5000/api/Blog/admin', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setPostsList(data)
            }
        } catch (err) {
            console.error("Erro ao carregar posts", err)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, message: 'Processando postagem...', type: 'info' })

        try {
            const token = localStorage.getItem('portfolio_token')
            const url = editingId 
                ? `http://localhost:5000/api/Blog/${editingId}`
                : 'http://localhost:5000/api/Blog'
            const method = editingId ? 'PUT' : 'POST'

            // Ajustamos o payload para casar perfeitamente com BlogPost C#
            const payload = {
                id: editingId || 0,
                title: formData.title,
                slug: formData.slug,
                summary: formData.summary,
                content: formData.content,
                isDraft: formData.isDraft
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                setStatus({ loading: false, message: editingId ? 'Post atualizado!' : 'Post criado!', type: 'success' })
                cancelEdit()
                fetchPosts()
            } else {
                setStatus({ loading: false, message: 'Erro ao salvar. Verifique o console.', type: 'error' })
            }
        } catch (error) {
            console.error(error)
            setStatus({ loading: false, message: 'Falha na conexão.', type: 'error' })
        }
    }

    const handleDelete = async (id, title) => {
        const confirmDelete = window.confirm(`Tem certeza que deseja apagar a postagem "${title}"?`)
        if (!confirmDelete) return

        try {
            const token = localStorage.getItem('portfolio_token')
            const response = await fetch(`http://localhost:5000/api/Blog/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                fetchPosts()
                if (editingId === id) cancelEdit()
            } else {
                alert("Erro ao apagar o post.")
            }
        } catch (error) {
            console.error("Erro no delete:", error)
        }
    }

    const startEdit = (post) => {
        setEditingId(post.id)
        setFormData({
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            content: post.content,
            isDraft: post.isDraft
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStatus({ loading: false, message: `Editando: ${post.title}`, type: 'info' })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({ title: '', slug: '', summary: '', content: '', isDraft: false })
        setStatus({ loading: false, message: '', type: '' })
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            {status.message && (
                <div className={`p-4 rounded-lg font-bold ${status.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : status.type === 'error' ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-brand-900/50 text-brand-400 border border-brand-800'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 relative">
                {editingId && (
                    <div className="absolute -top-4 left-8 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        Modo de Edição Ativo
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Título do Artigo *</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="bg-[#0b0c10] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-400 flex justify-between">
                            Url Amigável (Slug)
                            <span className="text-xs text-gray-500 font-normal">Automático se Vazio</span>
                        </label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="ex: como-usei-csharp" className="bg-[#0b0c10] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 font-mono text-sm" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Resumo * (Aparecerá na Aba Principal)</label>
                    <input required type="text" name="summary" value={formData.summary} onChange={handleChange} maxLength="200" className="bg-[#0b0c10] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500" />
                    <span className="text-xs text-gray-600 self-end">{formData.summary.length}/200</span>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-300 flex items-center justify-between">
                        Corpo do Artigo *
                        <span className="text-xs font-normal text-brand-400 bg-brand-900/30 px-2 py-1 rounded-full">
                            Suporta Markdown
                        </span>
                    </label>
                    <textarea required name="content" value={formData.content} onChange={handleChange} rows="15" placeholder="# A essência do Clean Code&#10;&#10;Use formatação Markdown para deixar o post bonito." className="bg-[#0b0c10] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 font-mono text-sm leading-relaxed"></textarea>
                </div>

                <div className="flex items-center gap-3 p-4 border border-yellow-700/50 bg-yellow-900/20 rounded-lg">
                    <input type="checkbox" id="isDraft" name="isDraft" checked={formData.isDraft} onChange={handleChange} className="w-5 h-5 accent-yellow-500 cursor-pointer" />
                    <label htmlFor="isDraft" className="text-sm font-bold text-yellow-500 cursor-pointer">
                        Manter como Rascunho (Apenas donos logados poderão ver)
                    </label>
                </div>

                <div className="flex gap-4 mt-4">
                    <button type="submit" disabled={status.loading} className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${status.loading ? 'bg-gray-600' : 'bg-brand-600 hover:bg-brand-500 cursor-pointer shadow-[0_0_20px_rgba(79,134,95,0.4)]'}`}>
                        {status.loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Publicar Artigo'}
                    </button>

                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="px-6 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold cursor-pointer transition-colors">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h2 className="text-2xl font-bold mt-8 mb-4">Postagens Publicadas</h2>
            <div className="flex flex-col gap-4">
                {postsList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Você ainda não escreveu nenhum artigo.</p>
                ) : (
                    postsList.map((post) => (
                        <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-900/50 transition-colors">
                            <div className="flex-1 w-full">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className={`text-xl font-bold ${post.isDraft ? 'text-gray-400 line-through' : 'text-white'}`}>{post.title}</h3>
                                    {post.isDraft && <span className="text-xs bg-yellow-900 text-yellow-500 px-2 py-1 rounded font-bold uppercase tracking-wider">Rascunho</span>}
                                    <span className="text-xs text-brand-400 font-mono">/{post.slug}</span>
                                </div>
                                <p className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</p>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <button onClick={() => startEdit(post)} className="flex-1 md:flex-none px-6 py-2 bg-brand-900/30 text-brand-400 border border-brand-800 rounded-lg font-bold hover:bg-brand-600 hover:text-white transition-all cursor-pointer">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(post.id, post.title)} className="flex-1 md:flex-none px-6 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                                    Apagar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

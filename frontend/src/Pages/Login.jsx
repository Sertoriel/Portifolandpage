import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [status, setStatus] = useState({ loading: false, error: '' })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, error: '' })

        try {
            // Chama a rota do nosso AuthController no .NET
            const response = await fetch('http://localhost:5000/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            if (response.ok) {
                const data = await response.json()

                // 1. GUARDA O TOKEN NO NAVEGADOR (localStorage)
                localStorage.setItem('portfolio_token', data.token)

                // 2. Manda você para o painel de Admin
                navigate('/admin')
            } else {
                setStatus({ loading: false, error: 'Usuário ou senha incorretos.' })
            }
        } catch (error) {
            console.error(error)
            setStatus({ loading: false, error: 'Falha na conexão com o servidor.' })
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#0b0c10] text-white flex flex-col items-center justify-center font-sans">
            <Navbar />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl z-20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Acesso Restrito</h1>
                    <p className="text-gray-400">Área de administração do portfólio.</p>
                </div>

                {status.error && (
                    <div className="p-3 mb-6 bg-red-900/50 text-red-400 border border-red-800 rounded-lg text-sm text-center font-bold">
                        {status.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-medium">Usuário</label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={credentials.username}
                            onChange={handleChange}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="Digite seu usuário"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-medium">Senha</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg mt-2 transition-all ${status.loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 cursor-pointer shadow-[0_0_15px_rgba(37,106,94,0.4)]'}`}
                    >
                        {status.loading ? 'Autenticando...' : 'Entrar'}
                    </button>
                </form>

                <button onClick={() => navigate('/')} className="w-full mt-6 text-gray-500 hover:text-white transition-colors text-sm cursor-pointer">
                    ← Voltar para a Home
                </button>
            </motion.div>
        </div>
    )
}
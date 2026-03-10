// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './Pages/Home'
import ProjectDetails from './Pages/ProjectDetails'
import AdminDashboard from './Pages/AdminDashboard'
import Login from './Pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal (A Landing Page) */}
        <Route path="/" element={<Home />} />
        
        {/* Rota dinâmica (A página de detalhes esperando um ID) */}
        <Route path="/projeto/:id" element={<ProjectDetails />} />

        {/* Rota para a página de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota para o painel administrativo */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
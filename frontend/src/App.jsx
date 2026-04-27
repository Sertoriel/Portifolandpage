// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './Pages/Home'
import ProjectDetails from './Pages/ProjectDetails'
import AdminDashboard from './Pages/AdminDashboard'
import Login from './Pages/Login'
import BlogList from './Pages/BlogList'
import BlogPostView from './Pages/BlogPostView'
import DocumentPreview from './Pages/DocumentPreview'
import LayoutBackground from './components/LayoutBackground'

import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <LayoutBackground />
      <BrowserRouter>
        <Routes>
          {/* Rota principal (A Landing Page) */}
        <Route path="/" element={<Home />} />
        
        {/* Rota dinâmica (A página de detalhes esperando um ID) */}
        <Route path="/projeto/:id" element={<ProjectDetails />} />

        {/* Rota para visualização de documentos (PDF/Certificados) */}
        <Route path="/preview" element={<DocumentPreview />} />

        {/* Rota para a página de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota para o painel administrativo */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Novas rotas do Motor de Blog */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPostView />} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
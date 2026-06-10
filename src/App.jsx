import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { runSeed } from './data/seed'

// Páginas públicas
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Área logada
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import PetsPage from './pages/PetsPage'
import AppointmentsPage from './pages/AppointmentsPage'
import ProductsPage from './pages/ProductsPage'
import ReportPage from './pages/ReportPage'

// ─────────────────────────────────────────────────────────────────────────
// App — Arquivo de rotas principal (Passo 5 da entrega)
//
// Estrutura de rotas:
//   /                    → Landing page pública
//   /login, /register    → Autenticação
//   /app                 → Dashboard (PROTEGIDO) com rotas filhas:
//        /app            → Visão geral
//        /app/pets       → CRUD 1: Pets
//        /app/agendamentos → CRUD 3: Agendamentos
//        /app/produtos   → CRUD 2: Produtos
//        /app/relatorio  → Relatório com JOIN
// ─────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Efeito: semeia o banco local na 1ª execução (dados demo) ──
  useEffect(() => {
    runSeed()
  }, [])

  // ── Render (árvore de rotas) ──────────────────
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas — exigem login */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pets" element={<PetsPage />} />
        <Route path="agendamentos" element={<AppointmentsPage />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="relatorio" element={<ReportPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

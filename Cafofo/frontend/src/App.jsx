import { Routes, Route } from 'react-router-dom'

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
import AdoptionsPage from './pages/AdoptionsPage'
import VolunteersPage from './pages/VolunteersPage'
import ReportPage from './pages/ReportPage'

// ─────────────────────────────────────────────────────────────────────────
// App — Arquivo de rotas principal
//
// Sistema de ADOÇÃO de animais. Estrutura de rotas:
//   /                    → Landing page pública
//   /login, /register    → Autenticação
//   /app                 → Dashboard (PROTEGIDO) com rotas filhas:
//        /app             → Visão geral
//        /app/pets        → CRUD 1: Pets
//        /app/adocoes     → CRUD 2: Adoções
//        /app/voluntarios → CRUD 3: Voluntários
//        /app/relatorio   → Relatório com JOIN (adoções × pets × voluntários)
//
// Os dados de demonstração agora são semeados pelo BACKEND (ver backend/),
// portanto não há mais seed no frontend.
// ─────────────────────────────────────────────────────────────────────────
export default function App() {
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
        <Route path="adocoes" element={<AdoptionsPage />} />
        <Route path="voluntarios" element={<VolunteersPage />} />
        <Route path="relatorio" element={<ReportPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

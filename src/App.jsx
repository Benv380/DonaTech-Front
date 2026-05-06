import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'sonner'
import { PrivateRoute } from './components/common/PrivateRoute'
import { PublicLayout } from './layouts/PublicLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { MainLayout } from './layouts/MainLayout'

// Páginas públicas
import { Home } from './pages/public/Home'
import { Login } from './pages/public/Login'
import { RegisterPage } from './pages/public/Register'

// Donante / Empresa
import { DonanteDashboard } from './pages/donante/DonanteDashboard'
import { MisDonaciones } from './pages/donante/MisDonaciones'
import { Seguimiento } from './pages/donante/Seguimiento'
import { Certificados } from './pages/donante/Certificados'
import { CartPage } from './pages/donante/Cart'

// Validador
import { ValidadorDashboard } from './pages/validador/ValidadorDashboard'
import { ValidarPagos } from './pages/validador/ValidarPagos'

// Beneficiario
import { BeneficiarioDashboard } from './pages/beneficiario/BeneficiarioDashboard'
import { MisCampanas } from './pages/beneficiario/MisCampanas'
import { MiPerfil } from './pages/beneficiario/MiPerfil'

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { GestionUsuarios } from './pages/admin/GestionUsuarios'
import { GestionKits } from './pages/admin/GestionKits'
import { AprobarCampanas } from './pages/admin/AprobarCampanas'
import { Metricas } from './pages/admin/Metricas'

// Otros
import { Unauthorized } from './pages/Unauthorized'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>

            {/* ── Público ── */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* ── Auth ── */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* ── Donante / Empresa ── */}
            <Route element={<PrivateRoute allowedRoles={['ROLE_DONANTE', 'ROLE_EMPRESA']}><MainLayout /></PrivateRoute>}>
              <Route path="/donante/dashboard" element={<DonanteDashboard />} />
              <Route path="/donante/donaciones" element={<MisDonaciones />} />
              <Route path="/donante/seguimiento" element={<Seguimiento />} />
              <Route path="/donante/certificados" element={<Certificados />} />
              <Route path="/donante/carrito" element={<CartPage />} />
            </Route>

            {/* ── Validador ── */}
            <Route element={<PrivateRoute allowedRoles={['ROLE_VALIDADOR']}><MainLayout /></PrivateRoute>}>
              <Route path="/validador/dashboard" element={<ValidadorDashboard />} />
              <Route path="/validador/pagos" element={<ValidarPagos />} />
            </Route>

            {/* ── Beneficiario ── */}
            <Route element={<PrivateRoute allowedRoles={['ROLE_BENEFICIARIO']}><MainLayout /></PrivateRoute>}>
              <Route path="/beneficiario/dashboard" element={<BeneficiarioDashboard />} />
              <Route path="/beneficiario/campanas" element={<MisCampanas />} />
              <Route path="/beneficiario/perfil" element={<MiPerfil />} />
            </Route>

            {/* ── Admin ── */}
            <Route element={<PrivateRoute allowedRoles={['ROLE_ADMIN']}><MainLayout /></PrivateRoute>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<GestionUsuarios />} />
              <Route path="/admin/kits" element={<GestionKits />} />
              <Route path="/admin/campanas" element={<AprobarCampanas />} />
              <Route path="/admin/metricas" element={<Metricas />} />
            </Route>

            {/* ── Otros ── */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

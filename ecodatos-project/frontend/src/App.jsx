import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ListaConglomerados from './pages/conglomerados/ListaConglomerados';
import GenerarConglomerados from './pages/conglomerados/GenerarConglomerados';
import AsignarBrigada from './pages/brigadas/AsignarBrigada';
import MisConglomerados from './pages/brigadas/MisConglomerados';
import GestionBrigadas from './pages/brigadas/GestionBrigadas';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionEspecies from './pages/especies/GestionEspecies';

// Componente para proteger rutas (requiere autenticación)
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Conglomerados */}
        <Route 
          path="/conglomerados/lista" 
          element={
            <ProtectedRoute>
              <ListaConglomerados />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/conglomerados/registrar" 
          element={
            <ProtectedRoute>
              <GenerarConglomerados />
            </ProtectedRoute>
          } 
        />

        {/* Brigadas */}
        <Route 
          path="/brigadas/asignar" 
          element={
            <ProtectedRoute>
              <AsignarBrigada />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/brigadas/mis-conglomerados" 
          element={
            <ProtectedRoute>
              <MisConglomerados />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/brigadas/gestion" 
          element={
            <ProtectedRoute>
              <GestionBrigadas />
            </ProtectedRoute>
          } 
        />

        {/* Admin */}
        <Route 
          path="/admin/usuarios" 
          element={
            <ProtectedRoute>
              <GestionUsuarios />
            </ProtectedRoute>
          } 
        />

        {/* Especies */}
        <Route 
          path="/especies/gestion" 
          element={
            <ProtectedRoute>
              <GestionEspecies />
            </ProtectedRoute>
          } 
        />

        {/* Rutas pendientes */}
        <Route path="/laboratorio/clasificacion" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

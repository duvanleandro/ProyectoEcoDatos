import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UsuarioProvider } from './context/UsuarioContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ListaConglomerados from './pages/conglomerados/ListaConglomerados';
import GenerarConglomerados from './pages/conglomerados/GenerarConglomerados';
import DetalleConglomerado from './pages/conglomerados/DetalleConglomerado';
import AsignarBrigada from './pages/brigadas/AsignarBrigada';
import MisConglomerados from './pages/brigadas/MisConglomerados';
import GestionBrigadas from './pages/brigadas/GestionBrigadas';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionEspecies from './pages/especies/GestionEspecies';
import ConsultaEspecies from './pages/especies/ConsultaEspecies';
import RegistrarObservacion from './pages/observaciones/RegistrarObservacion';
import ListaObservaciones from './pages/observaciones/ListaObservaciones';
import DetalleObservacion from './pages/observaciones/DetalleObservacion';
import EditarObservacionAdmin from './pages/observaciones/EditarObservacionAdmin';
import IndicadoresReportes from './pages/reportes/IndicadoresReportes';
import MiPerfil from './pages/perfil/MiPerfil';
import BusquedaEspecies from './pages/laboratorio/BusquedaEspecies';


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
    <UsuarioProvider>
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

        <Route
          path="/conglomerados/:id"
          element={
            <ProtectedRoute>
              <DetalleConglomerado />
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

        <Route 
          path="/especies/consulta" 
          element={
            <ProtectedRoute>
              <ConsultaEspecies />
            </ProtectedRoute>
          } 
        />

        {/* Observaciones */}
        <Route 
          path="/observaciones/registrar" 
          element={
            <ProtectedRoute>
              <RegistrarObservacion />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/observaciones/lista" 
          element={
            <ProtectedRoute>
              <ListaObservaciones />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/observaciones/detalle/:id" 
          element={
            <ProtectedRoute>
              <DetalleObservacion />
            </ProtectedRoute>
          } 
        />

        <Route 
  path="/observaciones/editar/:id" 
  element={
    <ProtectedRoute>
      <EditarObservacionAdmin />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/observaciones/detalle/:id" 
  element={
    <ProtectedRoute>
      <DetalleObservacion />
    </ProtectedRoute>
  } 
/>

        {/* Rutas de Laboratorio */}
        <Route path="/laboratorio/busqueda-especies" element={<ProtectedRoute><BusquedaEspecies /></ProtectedRoute>} />

        {/* Rutas pendientes */}
        <Route path="/reportes" element={<ProtectedRoute><IndicadoresReportes /></ProtectedRoute>} />

        {/* Perfil de Usuario */}
        <Route path="/perfil" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
        </Routes>
      </Router>
    </UsuarioProvider>
  );
}



export default App;

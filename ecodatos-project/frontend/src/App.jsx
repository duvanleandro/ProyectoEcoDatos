import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ListaConglomerados from './pages/conglomerados/ListaConglomerados';

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

        {/* Rutas pendientes (por ahora redirigen al dashboard) */}
        <Route path="/conglomerados/registrar" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/conglomerados/filtrar" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/conglomerados/ubicacion" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/brigadas/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import ViewContent from './pages/ViewContent';
import MyContent from './pages/MyContent';
import { AuthProvider } from './context/AuthContext';
import {ContextProvider} from './context/ContentContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContextProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/view/:id" element={<ProtectedRoute><ViewContent /></ProtectedRoute>} />
          <Route path="/my-content" element={<ProtectedRoute><MyContent /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ContextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
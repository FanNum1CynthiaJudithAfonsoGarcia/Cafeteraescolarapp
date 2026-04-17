import { createContext, useContext, useState, ReactNode } from 'react';

export interface UsuarioSesion {
  id: number;
  nombreCompleto: string;
  email: string;
  rol: string;
  horario: string;
}

interface AuthContextType {
  usuario: UsuarioSesion | null;
  isLoggedIn: boolean;
  login: (usuario: UsuarioSesion) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper para leer la sesión guardada en localStorage al iniciar
function getSessionFromStorage(): UsuarioSesion | null {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const id = localStorage.getItem('idUsuario');
  const nombreCompleto = localStorage.getItem('nombreUsuario');
  const rol = localStorage.getItem('rolUsuario');
  const email = localStorage.getItem('emailUsuario');
  const horario = localStorage.getItem('horarioUsuario');

  if (isLoggedIn && id && nombreCompleto && rol) {
    return {
      id: Number(id),
      nombreCompleto,
      email: email ?? '',
      rol,
      horario: horario ?? '',
    };
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(getSessionFromStorage);

  const login = (u: UsuarioSesion) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('idUsuario', u.id.toString());
    localStorage.setItem('nombreUsuario', u.nombreCompleto);
    localStorage.setItem('rolUsuario', u.rol);
    localStorage.setItem('emailUsuario', u.email);
    localStorage.setItem('horarioUsuario', u.horario);
    setUsuario(u);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('horarioUsuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, isLoggedIn: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { Coffee, UserCircle, GraduationCap } from 'lucide-react';

const TUTOR_CODE = 'TUTOR2026'; // Código para tutores

export default function Register() {
  const [userType, setUserType] = useState<'student' | 'tutor'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tutorCode, setTutorCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (userType === 'tutor' && tutorCode !== TUTOR_CODE) {
      setError('Código de tutor incorrecto');
      return;
    }

    if (name && email && password) {
      // Mock registration - guardar tipo de usuario
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', name);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
              <Coffee className="w-12 h-12 text-amber-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="text-gray-500 mt-2">Únete a nuestra cafetería escolar</p>
          </div>

          {/* Selector de tipo de usuario */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'student'
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                userType === 'student' ? 'text-amber-600' : 'text-gray-400'
              }`} />
              <p className={`font-medium text-sm ${
                userType === 'student' ? 'text-amber-900' : 'text-gray-600'
              }`}>
                Estudiante
              </p>
            </button>
            
            <button
              type="button"
              onClick={() => setUserType('tutor')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'tutor'
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <UserCircle className={`w-8 h-8 mx-auto mb-2 ${
                userType === 'tutor' ? 'text-amber-600' : 'text-gray-400'
              }`} />
              <p className={`font-medium text-sm ${
                userType === 'tutor' ? 'text-amber-900' : 'text-gray-600'
              }`}>
                Tutor
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder={userType === 'student' ? 'estudiante@escuela.com' : 'tutor@escuela.com'}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {userType === 'tutor' && (
              <div>
                <label htmlFor="tutorCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Código de tutor
                </label>
                <input
                  id="tutorCode"
                  type="text"
                  value={tutorCode}
                  onChange={(e) => setTutorCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="Introduce el código de tutor"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Código de prueba: TUTOR2026
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors mt-6"
            >
              Crear Cuenta
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { Coffee, GraduationCap, UserCircle, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { registerUsuario, loginUsuario } from '../../services/api';
import { useAuth } from '../contexts/AuthContext';

const HORARIOS = [
  '7:30 - 8:00',
  '8:00 - 8:30',
  '9:00 - 9:30',
  '10:00 - 10:30',
  '11:00 - 11:30',
  '12:00 - 12:30',
  '13:00 - 13:30',
  '14:00 - 14:30',
];

const ALERGENOS_OPCIONES = [
  'Gluten', 'Lácteos', 'Huevos', 'Pescado', 'Marisco',
  'Frutos secos', 'Cacahuetes', 'Soja', 'Mostaza', 'Apio',
];

export default function Register() {
  const [userType, setUserType] = useState<'CLIENTE' | 'TUTOR' | 'ADMIN'>('CLIENTE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tutorCode, setTutorCode] = useState('');
  const [horario, setHorario] = useState('');
  const [alergenosSeleccionados, setAlergenosSeleccionados] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleAlergeno = (a: string) => {
    setAlergenosSeleccionados((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // El horario solo es obligatorio para clientes
    if (userType === 'CLIENTE' && !horario) {
      setError('Por favor selecciona tu horario de recogida.');
      return;
    }

    setLoading(true);
    try {
      await registerUsuario({
        nombreCompleto: name,
        email,
        password,
        rol: userType,
        codigoTutor: (userType === 'TUTOR' || userType === 'ADMIN') ? tutorCode : undefined,
        horario: userType === 'CLIENTE' ? horario : 'N/A',
        alergenos: userType === 'CLIENTE' ? (alergenosSeleccionados.join(', ') || undefined) : undefined,
      });

      // Auto-login tras registro exitoso
      const loginData = await loginUsuario({ email, password });
      login(loginData.usuario);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm p-3 rounded-full mb-3">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
            <p className="text-amber-100 text-sm mt-1">Únete a nuestra cafetería escolar</p>
          </div>

          <div className="px-8 py-8">
            {/* Tipo de usuario */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                id="type-student"
                onClick={() => setUserType('CLIENTE')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${userType === 'CLIENTE'
                  ? 'border-amber-500 bg-amber-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-amber-300'
                  }`}
              >
                <GraduationCap className={`w-8 h-8 ${userType === 'CLIENTE' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span className={`font-semibold text-sm ${userType === 'CLIENTE' ? 'text-amber-800' : 'text-gray-500'}`}>
                  Estudiante
                </span>
              </button>

              <button
                type="button"
                id="type-tutor"
                onClick={() => setUserType('TUTOR')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${userType === 'TUTOR'
                  ? 'border-amber-500 bg-amber-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-amber-300'
                  }`}
              >
                <UserCircle className={`w-8 h-8 ${userType === 'TUTOR' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span className={`font-semibold text-sm ${userType === 'TUTOR' ? 'text-amber-800' : 'text-gray-500'}`}>
                  Tutor
                </span>
              </button>

              <button
                type="button"
                id="type-admin"
                onClick={() => setUserType('ADMIN')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${userType === 'ADMIN'
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
              >
                <ShieldCheck className={`w-8 h-8 ${userType === 'ADMIN' ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-semibold text-sm ${userType === 'ADMIN' ? 'text-purple-800' : 'text-gray-500'}`}>
                  Admin
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nombre */}
              <div>
                <label htmlFor="reg-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre completo
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Juan Pérez"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-gray-900 placeholder-gray-400"
                  placeholder={userType === 'CLIENTE' ? 'estudiante@escuela.com' : 'tutor@escuela.com'}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Horario — solo para CLIENTE */}
              {userType === 'CLIENTE' && (
                <div>
                  <label htmlFor="reg-horario" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Horario de recogida <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reg-horario"
                    value={horario}
                    onChange={(e) => { setHorario(e.target.value); setError(''); }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-gray-900 bg-white"
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona tu franja horaria</option>
                    {HORARIOS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Alergenos — solo para CLIENTE */}
              {userType === 'CLIENTE' && (
                <div>
                  <p className="block text-sm font-semibold text-gray-700 mb-2">
                    Alergenos <span className="text-gray-400 font-normal">(opcional)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ALERGENOS_OPCIONES.map((a) => {
                      const sel = alergenosSeleccionados.includes(a);
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleAlergeno(a)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 ${sel
                            ? 'border-amber-500 bg-amber-50 text-amber-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300'
                            }`}
                        >
                          {sel && <CheckCircle2 className="w-3 h-3" />}
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Código tutor / admin */}
              {(userType === 'TUTOR' || userType === 'ADMIN') && (
                <div>
                  <label htmlFor="reg-tutor-code" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {userType === 'ADMIN' ? 'Código de administrador' : 'Código de tutor'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-tutor-code"
                    type="text"
                    value={tutorCode}
                    onChange={(e) => { setTutorCode(e.target.value); setError(''); }}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-gray-900 placeholder-gray-400 ${userType === 'ADMIN'
                      ? 'border-purple-300 focus:ring-purple-400 focus:border-purple-400'
                      : 'border-gray-300 focus:ring-amber-400 focus:border-amber-400'
                      }`}
                    placeholder={userType === 'ADMIN' ? 'Código de administrador' : 'Código de tutor'}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-400 mt-1">Solicita el código al responsable del centro.</p>
                </div>
              )}

              {/* Submit */}
              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creando cuenta…
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-amber-600 hover:text-amber-700 font-semibold underline-offset-2 hover:underline transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

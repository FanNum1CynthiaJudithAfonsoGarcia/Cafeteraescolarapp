// URL base del backend
const API_URL = 'http://localhost:3000/api';

// ================= PRODUCTOS =================
export const getProductos = async () => {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error('Error al obtener los productos');
  return res.json();
};

export const getCategorias = async () => {
  const res = await fetch(`${API_URL}/productos/categorias`);
  if (!res.ok) throw new Error('Error al obtener las categorías');
  return res.json();
};

export const createProductoAdmin = async (producto: {
  nombre: string;
  precio: number;
  categoriaId: number;
  descripcion?: string;
  tipo?: string;
  alergenos?: string;
  imagen?: string;
}) => {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear el producto');
  return data;
};

export const deleteProductoAdmin = async (id: number) => {
  const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar el producto');
  return data;
};

// ================= USUARIOS =================
export const loginUsuario = async (credenciales: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Credenciales inválidas');
  return data; // { mensaje, usuario: { id, nombreCompleto, email, rol, horario } }
};

export const registerUsuario = async (usuario: {
  nombreCompleto: string;
  email: string;
  password: string;
  rol?: string;
  codigoTutor?: string;
  horario: string;
  alergenos?: string;
}) => {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear el usuario');
  return data;
};

export const getAllUsuariosAdmin = async () => {
  const res = await fetch(`${API_URL}/usuarios/admin/todos`);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
};

export const deleteUsuarioAdmin = async (id: number) => {
  const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar usuario');
  return data;
};

// ================= PEDIDOS =================
export const getPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos`);
  if (!res.ok) throw new Error('Error al obtener los pedidos');
  return res.json();
};

export const createPedido = async (payload: {
  usuarioId: number;
  items: Array<{ productoId: string | number; cantidad: number }>;
}) => {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear el pedido');
  return data;
};

export const getPedidosUsuario = async (usuarioId: number) => {
  const res = await fetch(`${API_URL}/pedidos/usuario/${usuarioId}`);
  if (!res.ok) throw new Error('Error al obtener tus pedidos');
  return res.json();
};

export const getAllPedidosAdmin = async () => {
  const res = await fetch(`${API_URL}/pedidos/admin`);
  if (!res.ok) throw new Error('Error al obtener todos los pedidos');
  return res.json();
};

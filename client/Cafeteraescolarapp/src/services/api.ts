// URL base de tu backend
const API_URL = 'http://localhost:3000/api';

// ================= PRODUCTOS =================
export const getProductos = async () => {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error('Error al obtener los productos');
  return res.json();
};

export const createProducto = async (producto: any) => {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  if (!res.ok) throw new Error('Error al crear el producto');
  return res.json();
};

// ================= USUARIOS =================
export const login = async (credenciales: any) => {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales)
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.text(); // El backend devuelve un send() con texto plano ('Bienvenido')
};

export const createUsuario = async (usuario: any) => {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  if (!res.ok) throw new Error('Error al crear el usuario');
  return res.json();
};

// ================= PEDIDOS =================
export const getPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos`);
  if (!res.ok) throw new Error('Error al obtener los pedidos');
  return res.json();
};

export const createPedido = async (pedido: any) => {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  });
  if (!res.ok) throw new Error('Error al crear el pedido');
  return res.json();
};

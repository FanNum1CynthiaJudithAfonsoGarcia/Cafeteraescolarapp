import express from 'express';
import cors from 'cors';
import productoRoutes from './routes/product.routes';
import pedidoRoutes from './routes/pedido.routes';
import usuariosRoutes from './routes/usuarios.routes';
import pagosRoutes from './routes/pagos.routes';


const app = express();

// Middlewares (Configuraciones)
app.use(cors());
app.use(express.json());  // Permite recibir datos JSON en POST


// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pagos', pagosRoutes);

// Ruta de prueba general
app.get('/', (req, res) => {
  res.send('☕ Backend Cafetería Funcionando ☕');
});

export default app;
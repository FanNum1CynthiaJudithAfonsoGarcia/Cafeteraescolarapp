import { Router } from 'express';
import { createPedido, getPedidos, getPedidosByUsuario, getAllPedidosAdmin } from '../controllers/pedido.controller';

const router = Router();

router.post('/', createPedido);                          // Crear pedido
router.get('/', getPedidos);                             // Lista general
router.get('/admin', getAllPedidosAdmin);                 // Admin: todos los pedidos
router.get('/usuario/:usuarioId', getPedidosByUsuario); // Historial de un usuario

export default router;
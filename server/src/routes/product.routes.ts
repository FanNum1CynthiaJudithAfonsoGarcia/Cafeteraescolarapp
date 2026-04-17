import { Router } from 'express';
import { getProductos, createProducto, deleteProducto, updateProductoImagen } from '../controllers/product.controller';

const router = Router();

// Cuando alguien visite GET /api/productos -> Ejecuta getProductos
router.get('/', getProductos);

// Cuando alguien envíe datos a POST /api/productos -> Ejecuta createProducto
router.post('/', createProducto);

// Actualizar imagen de un producto: PATCH /api/productos/:id/imagen
router.patch('/:id/imagen', updateProductoImagen);

// Cuando alguien envíe datos a DELETE /api/productos/:id -> Ejecuta deleteProducto
router.delete('/:id', deleteProducto);

export default router;
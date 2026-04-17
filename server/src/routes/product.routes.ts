import { Router } from 'express';
import { getProductos, createProducto, deleteProducto, updateProductoImagen, getCategorias } from '../controllers/product.controller';

const router = Router();

router.get('/', getProductos);
router.get('/categorias', getCategorias);          // Admin: selector de categorías
router.post('/', createProducto);
router.patch('/:id/imagen', updateProductoImagen);
router.delete('/:id', deleteProducto);

export default router;
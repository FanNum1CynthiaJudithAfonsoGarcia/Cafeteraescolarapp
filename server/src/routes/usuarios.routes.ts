import { Router } from 'express';
import { createUsuario, getUsuarios, login, getAllUsuariosAdmin, deleteUsuario } from '../controllers/usuario.controller';

const router = Router();

router.post('/', createUsuario);
router.get('/users', getUsuarios);
router.post('/login', login);
router.get('/admin/todos', getAllUsuariosAdmin);  // Admin: ver todos los usuarios
router.delete('/:id', deleteUsuario);            // Admin: eliminar usuario

export default router;
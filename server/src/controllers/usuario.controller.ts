import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const {
      nombreCompleto,
      email,
      password,
      codigoTutor,
      alergenos,
      horario // 1. Extraemos horario (es obligatorio en tu DB)
    } = req.body;

    const rol = req.body.rol ? String(req.body.rol).trim().toUpperCase() : 'CLIENTE';

    // El horario es obligatorio solo para clientes
    const horarioRequerido = rol === 'CLIENTE';
    if (!email || !password || !nombreCompleto || (horarioRequerido && !horario)) {
      res.status(400).json({ error: 'Faltan campos obligatorios (nombre, email, password' + (horarioRequerido ? ', horario' : '') + ').' });
      return;
    }

    if (rol === 'TUTOR') {
      const codigoMaestro = process.env.TUTOR_SECRET_CODE || 'CODIGO_TUTOR_TEST';
      if (codigoTutor !== codigoMaestro) {
        res.status(403).json({ error: 'Código de tutor inválido.' });
        return;
      }
    }

    if (rol === 'ADMIN') {
      const codigoAdmin = process.env.ADMIN_SECRET_CODE || 'ADMIN2026';
      if (codigoTutor !== codigoAdmin) {
        res.status(403).json({ error: 'Código de administrador inválido.' });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const alergenosString = Array.isArray(alergenos)
      ? alergenos.join(', ').substring(0, 100)
      : (alergenos || "");

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombreCompleto,
        email,
        password: hashedPassword,
        rol: rol,
        codigoTutor: rol === 'TUTOR' ? codigoTutor : null,
        horario: horario,
        alergenos: alergenosString
      }
    });

    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    return res.status(201).json(usuarioSinPassword);

  } catch (error: any) {
    console.error("Error detallado:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    } else {
      return res.status(500).json({ error: 'Error al crear usuario', details: error.message });
    }
  }
};

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Buscamos al usuario por email
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'El email no está registrado.' });
    }

    // 2. Comparamos la contraseña encriptada
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (passwordMatch) {
      // 3. RESPUESTA PROFESIONAL: Enviamos los datos que el Front necesita
      // No enviamos el password por seguridad
      return res.status(200).json({
        mensaje: 'Bienvenido',
        usuario: {
          id: usuario.id,
          nombreCompleto: usuario.nombreCompleto,
          email: usuario.email,
          rol: usuario.rol,
          horario: usuario.horario
        }
      });
    } else {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los usuarios — solo para ADMIN
export const getAllUsuariosAdmin = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        rol: true,
        horario: true,
        alergenos: true,
        _count: { select: { pedidos: true } }
      },
      orderBy: { id: 'asc' }
    });
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

// Eliminar usuario — solo para ADMIN
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: 'No se pudo eliminar el usuario', details: error.message });
  }
};

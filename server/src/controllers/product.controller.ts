import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Importamos tu cliente de Prisma

// Función para obtener todos los productos
export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true // Debe coincidir con el nombre en schema.prisma (plural)
      }
    });

    // Respondemos con JSON
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Función para obtener todas las categorías
export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Función para crear un producto nuevo
export const createProducto = async (req: Request, res: Response) => {
  try {
    const { nombre, precio, categoriaId, alergenos, imagen, descripcion, tipo } = req.body;

    if (!nombre || !precio || !categoriaId) {
      res.status(400).json({ error: 'Faltan campos obligatorios: nombre, precio, categoriaId' });
      return;
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio: Number(precio),
        alergenos: alergenos ?? null,
        imagen: imagen ?? null,
        descripcion: descripcion ?? null,
        tipo: tipo ?? null,
        categoriaId: Number(categoriaId)
      },
      include: { categoria: true }
    });

    res.status(201).json(nuevoProducto);
  } catch (error: any) {
    res.status(400).json({ error: 'Error al crear producto', details: error.message });
  }
};

// Función para actualizar la imagen de un producto
export const updateProductoImagen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imagen } = req.body;

    const updated = await prisma.producto.update({
      where: { id: Number(id) },
      data: { imagen }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: 'No se pudo actualizar la imagen', details: error.message });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productoEliminado = await prisma.producto.delete({
      where: {
        id: Number(id)
      }
    });
    res.json(productoEliminado);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: 'No se pudo eliminar el producto', details: error.message });
  }
};
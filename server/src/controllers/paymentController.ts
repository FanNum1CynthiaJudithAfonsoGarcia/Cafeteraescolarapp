import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'tu_sk_test_..._aquí');
const prisma = new PrismaClient();

export const crearIntentoDePago = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    let totalCents = 0;

    for (const item of items) {
      const producto = await prisma.producto.findUnique({
        where: { id: Number(item.id) }
      });

      if (producto) {
        // 🔥 CORRECCIÓN: Usamos item.quantity porque así viene del Frontend
        const cantidadItem = item.quantity || 1;

        // Calculamos el precio en céntimos
        totalCents += Math.round(Number(producto.precio) * 100) * cantidadItem;
      }
    }

    //  ESCUDO DE SEGURIDAD: Stripe falla si el total es menor a 50 céntimos (0.50€)
    if (totalCents < 50) {
      return res.status(400).json({ error: 'El total debe ser al menos 0.50€' });
    }

    // Creamos el intento de pago con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });

    // Enviamos el secreto al frontend
    return res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("Error detallado:", error);
    return res.status(500).json({ error: 'Error interno al procesar el pago' });
  }
};
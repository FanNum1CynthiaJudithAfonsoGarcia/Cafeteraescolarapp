import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useCart } from '../contexts/CartContext';

export default function PagoExitoso() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart(); // Asegúrate de tener una función para vaciar el carrito en tu context

    // Stripe añade 'redirect_status' a la URL cuando termina el pago
    const status = searchParams.get('redirect_status');

    useEffect(() => {
        if (status === 'succeeded') {
            // 1. Vaciamos el carrito porque ya se pagó
            clearCart();
            // 2. (Opcional) Aquí harías un fetch a tu backend para guardar el pedido en TiDB
        }
    }, [status, clearCart]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-sm w-full">
                <div className="text-green-500 text-5xl mb-4">✅</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Completado!</h1>
                <p className="text-gray-600 mb-6">Tu pedido ya se está preparando en la cafetería.</p>

                {/* Este botón abre el diálogo de impresión del navegador */}
                <button
                    onClick={() => window.print()}
                    className="w-full mb-3 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition-colors print:hidden"
                >
                    🖨️ Imprimir Ticket
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="w-full text-amber-600 font-medium hover:underline print:hidden"
                >
                    Volver al Menú
                </button>
            </div>

            {/* TICKET DE IMPRESIÓN (Solo visible al imprimir) */}
            <div className="hidden print:block print:w-[80mm] text-black bg-white p-4 font-mono text-sm">
                <h2 className="text-center font-bold text-lg border-b border-black pb-2 mb-2">CAFETERÍA ESCOLAR</h2>
                <p>Fecha: {new Date().toLocaleDateString()}</p>
                <p>Hora: {new Date().toLocaleTimeString()}</p>
                <div className="border-t border-black mt-2 pt-2 text-center">
                    <p>¡Gracias por su compra!</p>
                    <p>Presente este ticket en caja.</p>
                </div>
            </div>
        </div>
    );
}
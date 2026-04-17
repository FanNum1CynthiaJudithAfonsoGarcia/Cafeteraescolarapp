import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext'; // Ajusta la ruta si es necesario

// 1. Cargamos tu llave PÚBLICA desde el .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || 'tu_pk_test_aqui');

// --- COMPONENTE INTERNO: EL FORMULARIO DE TARJETA ---
const FormularioStripe = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [cargando, setCargando] = useState(false);
    const [mensajeError, setMensajeError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setCargando(true);
        setMensajeError(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:5173/pago-exitoso",
            },
        });

        if (error) {
            setMensajeError(error.message || 'Ocurrió un error inesperado.');
        }
        setCargando(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border">
            <PaymentElement />
            {mensajeError && <div className="text-red-500 mt-4 text-sm">{mensajeError}</div>}

            <button
                disabled={!stripe || cargando}
                className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
                {cargando ? 'Procesando...' : 'Pagar Pedido'}
            </button>
        </form>
    );
};

// --- COMPONENTE PRINCIPAL QUE EXPORTAS ---
export const CheckoutPage = () => {
    const [clientSecret, setClientSecret] = useState("");
    const { cartItems } = useCart(); // Me aseguré de usar cartItems como en tu Cart.tsx

    // EL HOOK USEEFFECT VA JUSTO AQUÍ, EN LA RAÍZ DEL COMPONENTE
    useEffect(() => {
        if (cartItems.length === 0) return;

        fetch("http://localhost:3000/api/pagos/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems }),
        })
            .then(async (res) => {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    if (!res.ok) throw new Error(data.error || 'Error del servidor');
                    return data;
                } catch (err) {
                    console.error("Respuesta cruda del backend:", text);
                    throw new Error("El backend no devolvió JSON.");
                }
            })
            .then((data) => {
                setClientSecret(data.clientSecret);
            })
            .catch((err) => {
                console.error("Error pidiendo el secreto:", err);
            });
    }, [cartItems]);

    return (
        <div className="max-w-md mx-auto p-4 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Finalizar Pago</h2>

            {clientSecret ? (
                <Elements options={{ clientSecret }} stripe={stripePromise}>
                    <FormularioStripe />
                </Elements>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    Conectando con el servidor de pagos...
                </div>
            )}
        </div>
    );
};
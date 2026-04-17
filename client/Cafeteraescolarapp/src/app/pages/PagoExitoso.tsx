import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createPedido } from '../../services/api';
import { CheckCircle2, Printer, Home } from 'lucide-react';

export default function PagoExitoso() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const { usuario } = useAuth();

    const [itemsTicket, setItemsTicket] = useState<any[]>([]);
    const [totalTicket, setTotalTicket] = useState(0);
    const [numeroPedido, setNumeroPedido] = useState('');
    const [guardando, setGuardando] = useState(false);

    const status = searchParams.get('redirect_status');
    const nombreCliente = usuario?.nombreCompleto ?? localStorage.getItem('nombreUsuario') ?? 'Estudiante';

    useEffect(() => {
        if (status !== 'succeeded') return;

        const ticketGuardado = sessionStorage.getItem('ticketPendiente');
        const totalGuardado = sessionStorage.getItem('ticketTotal');

        if (!ticketGuardado) return;

        const items: any[] = JSON.parse(ticketGuardado);
        const total = Number(totalGuardado);

        setItemsTicket(items);
        setTotalTicket(total);

        // --- Persistir pedido en la BD ---
        const usuarioId = usuario?.id ?? Number(localStorage.getItem('idUsuario'));

        if (usuarioId && items.length > 0) {
            setGuardando(true);
            createPedido({
                usuarioId,
                items: items.map((item: any) => ({
                    productoId: item.id,
                    cantidad: item.quantity
                }))
            })
                .then((pedidoCreado) => {
                    setNumeroPedido(`PED-${pedidoCreado.id}`);
                })
                .catch((err) => {
                    console.error('No se pudo guardar el pedido en la BD:', err);
                    setNumeroPedido(`PED-${Date.now().toString().slice(-6)}`);
                })
                .finally(() => setGuardando(false));
        } else {
            setNumeroPedido(`PED-${Date.now().toString().slice(-6)}`);
        }

        sessionStorage.removeItem('ticketPendiente');
        sessionStorage.removeItem('ticketTotal');
        clearCart();
    }, [status]);  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-4">
            {/* VISTA DE PANTALLA */}
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full print:hidden">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Completado!</h1>
                <p className="text-gray-600 mb-6">
                    Gracias, <span className="font-semibold text-amber-700">{nombreCliente}</span>.
                    Tu pedido ya se está preparando. ☕
                </p>

                {guardando ? (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 animate-pulse">
                        <p className="text-sm text-gray-400">Registrando pedido...</p>
                    </div>
                ) : numeroPedido && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">Número de pedido</p>
                        <p className="text-2xl font-bold text-amber-700">{numeroPedido}</p>
                    </div>
                )}

                <button
                    id="btn-imprimir"
                    onClick={() => window.print()}
                    className="w-full mb-3 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2"
                >
                    <Printer className="w-5 h-5" />
                    Imprimir Ticket
                </button>

                <button
                    id="btn-volver-menu"
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 text-amber-600 font-medium hover:underline mt-2"
                >
                    <Home className="w-4 h-4" />
                    Volver al Menú
                </button>

                <button
                    id="btn-ver-historial"
                    onClick={() => navigate('/historial')}
                    className="block w-full mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                    Ver mis pedidos →
                </button>
            </div>

            {/* FORMATO TICKET DE PAPEL */}
            <div className="hidden print:block print:w-[80mm] text-black bg-white p-4 font-mono text-sm mx-auto">
                <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
                    <h2 className="font-bold text-lg mb-1">☕ CAFETERÍA ESCOLAR</h2>
                    <p>Pedido: {numeroPedido}</p>
                    <p className="font-bold text-base mt-1">Cliente: {nombreCliente}</p>
                    <p className="mt-1">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
                    <p>Hora: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="mb-4 space-y-3">
                    {itemsTicket.map((item, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="flex justify-between font-bold">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{((item.price + (item.customizationPrice || 0)) * item.quantity).toFixed(2)}€</span>
                            </div>
                            {item.customizations && (
                                <div className="text-[11px] text-gray-600 ml-2 mt-1">
                                    {item.customizations.breadType && <p>Pan: {item.customizations.breadType}</p>}
                                    {item.customizations.extras?.length > 0 && <p>Extras: {item.customizations.extras.join(', ')}</p>}
                                    {item.customizations.removed?.length > 0 && <p>Sin: {item.customizations.removed.join(', ')}</p>}
                                    {item.customizationPrice > 0 && <p>Extra pers.: +{item.customizationPrice.toFixed(2)}€</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="border-t-2 border-dashed border-black pt-2 mt-2">
                    <div className="flex justify-between font-bold text-base">
                        <span>TOTAL:</span>
                        <span>{totalTicket.toFixed(2)}€</span>
                    </div>
                </div>

                <div className="text-center mt-6 text-xs">
                    <p>¡Gracias por tu compra!</p>
                    <p>Recoge tu pedido en el mostrador</p>
                </div>
            </div>
        </div>
    );
}
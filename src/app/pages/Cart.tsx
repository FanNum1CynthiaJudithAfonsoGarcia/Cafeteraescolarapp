import { useNavigate } from 'react-router';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, CreditCard, Printer } from 'lucide-react';
import { Header } from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';
import { getCustomizationNames } from '../utils/formatCustomization';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handlePayment = () => {
    // Generar número de pedido
    const newOrderNumber = `PED-${Date.now().toString().slice(-6)}`;
    setOrderNumber(newOrderNumber);
    setShowSuccess(true);
  };

  const printTicket = () => {
    const printWindow = window.open('', '', 'width=300,height=600');
    if (!printWindow) return;

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket - ${orderNumber}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 300px;
            }
            h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .item { margin: 10px 0; }
            .item-name { font-weight: bold; }
            .customization { font-size: 11px; margin-left: 10px; color: #666; }
            .total { border-top: 2px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>☕ CAFETERÍA ESCOLAR</h1>
            <p>Pedido: ${orderNumber}</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          </div>
          
          ${cartItems.map(item => `
            <div class="item">
              <div class="item-name">${item.name} x${item.quantity}</div>
              <div>${(item.price * item.quantity).toFixed(2)}€</div>
              ${item.customizations ? `
                ${item.customizations.breadType ? `<div class="customization">Pan: ${item.customizations.breadType}</div>` : ''}
                ${item.customizations.extras && item.customizations.extras.length > 0 ? 
                  `<div class="customization">Extras: ${item.customizations.extras.join(', ')}</div>` : ''}
                ${item.customizations.removed && item.customizations.removed.length > 0 ? 
                  `<div class="customization">Sin: ${item.customizations.removed.join(', ')}</div>` : ''}
                ${item.customizationPrice ? `<div class="customization">Personalización: +${item.customizationPrice.toFixed(2)}€</div>` : ''}
              ` : ''}
            </div>
          `).join('')}
          
          <div class="total">
            <div>TOTAL: ${getTotalPrice().toFixed(2)}€</div>
          </div>
          
          <div class="footer">
            <p>¡Gracias por tu compra!</p>
            <p>Recoge tu pedido en el mostrador</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleFinish = () => {
    clearCart();
    setShowSuccess(false);
    setShowPayment(false);
    navigate('/');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Realizado!</h2>
            <p className="text-gray-600 mb-4">Tu pedido ha sido procesado correctamente</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
              <p className="text-2xl font-bold text-amber-700">{orderNumber}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={printTicket}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimir Ticket
              </button>
              <button
                onClick={handleFinish}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Añade productos para comenzar tu pedido</p>
            <button
              onClick={() => navigate('/')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Categorías
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Seguir comprando
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                    
                    {item.customizations && (
                      <div className="text-xs text-gray-600 mb-2 space-y-1">
                        {item.customizations.breadType && (
                          <p>• Pan: {item.customizations.breadType}</p>
                        )}
                        {item.customizations.extras && item.customizations.extras.length > 0 && (
                          <p>• Extras: {item.customizations.extras.join(', ')}</p>
                        )}
                        {item.customizations.removed && item.customizations.removed.length > 0 && (
                          <p>• Sin: {item.customizations.removed.join(', ')}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="font-medium text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-semibold text-amber-700 block">
                            {((item.price + (item.customizationPrice || 0)) * item.quantity).toFixed(2)}€
                          </span>
                          {item.customizationPrice && item.customizationPrice > 0 && (
                            <span className="text-xs text-gray-500">
                              (+{item.customizationPrice.toFixed(2)}€ personalización)
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen y pago */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{getTotalPrice().toFixed(2)}€</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-amber-700">
                  {getTotalPrice().toFixed(2)}€
                </span>
              </div>

              {!showPayment ? (
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceder al Pago
                </button>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Método de Pago</h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-amber-600"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span>Tarjeta</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="text-xl">💵</span>
                      <span>Efectivo</span>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Simulación - Introduce cualquier número</p>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Confirmar Pago
                  </button>
                  
                  <button
                    onClick={() => setShowPayment(false)}
                    className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
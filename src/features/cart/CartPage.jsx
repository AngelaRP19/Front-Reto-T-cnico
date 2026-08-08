import React, { useEffect, useState } from 'react';
import { useCartStore } from './useCartStore';

export const CartPage = () => {
  const { cart, loading, fetchCart, purchaseCart } = useCartStore();
  const [step, setStep] = useState('cart'); // 'cart' | 'payment' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [completedOrder, setCompletedOrder] = useState(null);

  const token = localStorage.getItem('authToken') || '';

  useEffect(() => {
    if (token) fetchCart(token);
  }, [token]);

  const handleConfirmPurchase = async () => {
    const order = await purchaseCart(token, paymentMethod);
    if (order) {
      setCompletedOrder(order);
      setStep('success');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg font-medium text-slate-600 animate-pulse">Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-xl shadow-md border border-slate-100 text-slate-800">
      
      {/* PASO 1: VISTA DEL CARRITO */}
      {step === 'cart' && (
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b">
            Tu Carrito de Compras
          </h1>

          {!cart || !cart.items || cart.items.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">El carrito está vacío.</p>
          ) : (
            <>
              <div className="divide-y divide-slate-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.expansionPack?.name}</h3>
                      <p className="text-sm text-slate-500">
                        Plataforma: <span className="font-medium text-indigo-600">{item.platform?.name}</span>
                      </p>
                    </div>
                    <span className="font-bold text-slate-700">${item.expansionPack?.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-700">Total:</span>
                <span className="text-2xl font-bold text-emerald-600">${cart.total}</span>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep('payment')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Proceder al Pago
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* PASO 2: SELECCIÓN DE MÉTODO DE PAGO / PASARELA */}
      {step === 'payment' && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Selecciona el Método de Pago</h2>
          <p className="text-sm text-slate-500 mb-6">Elige la pasarela o método con el que deseas completar tu pedido.</p>
          
          <div className="space-y-3 my-6">
            {/* Opción 1: Tarjeta */}
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'CARD' ? 'border-indigo-600 bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
              <input
                type="radio"
                name="payment"
                value="CARD"
                checked={paymentMethod === 'CARD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-indigo-600"
              />
              <div className="ml-3">
                <span className="block font-semibold text-slate-800">💳 Tarjeta de Crédito / Débito</span>
                <span className="text-xs text-slate-500">Pago directo y seguro con tarjeta</span>
              </div>
            </label>

            {/* Opción 2: PayPal */}
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'PAYPAL' ? 'border-indigo-600 bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
              <input
                type="radio"
                name="payment"
                value="PAYPAL"
                checked={paymentMethod === 'PAYPAL'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-indigo-600"
              />
              <div className="ml-3">
                <span className="block font-semibold text-slate-800">🟦 PayPal</span>
                <span className="text-xs text-slate-500">Paga con tu cuenta o saldo de PayPal</span>
              </div>
            </label>

            {/* Opción 3: PSE / Transferencia */}
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'PSE' ? 'border-indigo-600 bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
              <input
                type="radio"
                name="payment"
                value="PSE"
                checked={paymentMethod === 'PSE'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-indigo-600"
              />
              <div className="ml-3">
                <span className="block font-semibold text-slate-800">🏦 Transferencia Bancaria (PSE)</span>
                <span className="text-xs text-slate-500">Débito directo desde tu cuenta bancaria</span>
              </div>
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={() => setStep('cart')}
              className="text-slate-600 hover:text-slate-800 font-medium px-4 py-2 cursor-pointer"
            >
              ← Volver al carrito
            </button>
            <button
              onClick={handleConfirmPurchase}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Finalizar Compra (${cart?.total})
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: CONFIRMACIÓN DE COMPRA */}
      {step === 'success' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Compra Completada!</h2>
          <p className="text-slate-600 mb-6">Gracias por tu compra. Tu orden ha sido procesada exitosamente.</p>

          <div className="bg-slate-50 p-4 rounded-lg max-w-sm mx-auto text-left text-sm text-slate-700 space-y-2 mb-6 border">
            <p><strong>N° de Orden:</strong> #{completedOrder?.id}</p>
            <p><strong>Total:</strong> ${completedOrder?.totalPrice}</p>
            <p><strong>Método seleccionado:</strong> {completedOrder?.paymentMethod || paymentMethod}</p>
            <p><strong>Estado:</strong> {completedOrder?.status || 'COMPLETED'}</p>
          </div>
        </div>
      )}

    </div>
  );
};
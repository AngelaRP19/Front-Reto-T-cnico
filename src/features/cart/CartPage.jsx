import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { CreditCard, Wallet, Landmark } from "lucide-react";
import useCartStore from "../../store/cartStore";
import { addToBackendCart, purchaseCart } from "./cartService";

export const CartPage = () => {
  const navigate = useNavigate();
  const { i18n } = useLingui();
  const t = (id, message, values) => i18n._({ id, message, values });
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const [step, setStep] = useState("cart"); // 'cart' | 'payment' | 'success'
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);

  const subtotal = getSubtotal();

  const handleConfirmPurchase = async () => {
    const missingPlatform = items.find((item) => !item.platformId);
    if (missingPlatform) {
      setPurchaseError(
        t("cart.page.missingPlatform", '"{title}" no tiene una plataforma válida — quitalo del carrito y volvé a agregarlo.', {
          title: missingPlatform.title,
        })
      );
      return;
    }

    setPurchasing(true);
    setPurchaseError("");
    try {
      for (const item of items) {
        await addToBackendCart(item.id, item.platformId);
      }
      const order = await purchaseCart(paymentMethod);
      clearCart();
      setCompletedOrder(order);
      setStep("success");
    } catch (err) {
      setPurchaseError(err.message || t("cart.page.purchaseError", "No se pudo procesar la compra."));
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-[56rem] mx-auto p-6 my-8 bg-card-bg rounded-xl shadow-md border border-snd-bg text-text transition-colors duration-300">
      {/* PASO 1: VISTA DEL CARRITO */}
      {step === "cart" && (
        <div>
          <h1 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-snd-bg">
            {t("cart.page.title", "Tu carrito de compras")}
          </h1>

          {items.length === 0 ? (
            <p className="text-text opacity-60 py-8 text-center">{t("cart.page.empty", "El carrito está vacío.")}</p>
          ) : (
            <>
              <div className="divide-y divide-snd-bg">
                {items.map((item) => (
                  <div key={`${item.id}-${item.platform}`} className="py-4 flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-text truncate">{item.title}</h3>
                      <p className="text-sm text-text opacity-70">
                        {t("cart.page.platformLabel", "Plataforma:")} <span className="font-medium text-main">{item.platform}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-bold text-text">{item.price}</span>
                      <button
                        onClick={() => removeItem(item.id, item.platform)}
                        className="text-sm text-red-500 hover:text-red-600 font-semibold cursor-pointer"
                      >
                        {t("cart.remove", "Quitar")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-snd-bg flex justify-between items-center">
                <span className="text-lg font-semibold text-text">{t("cart.page.total", "Total:")}</span>
                <span className="text-2xl font-bold text-price">
                  {subtotal.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                </span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={clearCart}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {t("cart.clear", "Vaciar carrito")}
                </button>
                <button
                  onClick={() => setStep("payment")}
                  className="bg-main hover:bg-hover text-bg font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {t("cart.page.proceedToPayment", "Proceder al pago")}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* PASO 2: SELECCIÓN DE MÉTODO DE PAGO / PASARELA */}
      {step === "payment" && (
        <div>
          <h2 className="text-xl font-bold text-text mb-2">{t("cart.page.selectPaymentMethod", "Selecciona el método de pago")}</h2>
          <p className="text-sm text-text opacity-70 mb-6">
            {t("cart.page.selectPaymentMethodSubtitle", "Elige la pasarela o método con el que deseas completar tu pedido.")}
          </p>

          <div className="space-y-3 my-6">
            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                paymentMethod === "CARD" ? "border-main bg-main/10" : "border-snd-bg hover:bg-snd-bg/50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-main"
              />
              <div className="ml-3">
                <span className="flex items-center gap-2 font-semibold text-text"><CreditCard size={18} /> {t("cart.page.paymentCard", "Tarjeta de crédito / débito")}</span>
                <span className="text-xs text-text opacity-70">{t("cart.page.paymentCardHint", "Pago directo y seguro con tarjeta")}</span>
              </div>
            </label>

            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                paymentMethod === "PAYPAL" ? "border-main bg-main/10" : "border-snd-bg hover:bg-snd-bg/50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="PAYPAL"
                checked={paymentMethod === "PAYPAL"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-main"
              />
              <div className="ml-3">
                <span className="flex items-center gap-2 font-semibold text-text"><Wallet size={18} /> {t("cart.page.paymentPaypal", "PayPal")}</span>
                <span className="text-xs text-text opacity-70">{t("cart.page.paymentPaypalHint", "Paga con tu cuenta o saldo de PayPal")}</span>
              </div>
            </label>

            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                paymentMethod === "PSE" ? "border-main bg-main/10" : "border-snd-bg hover:bg-snd-bg/50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="PSE"
                checked={paymentMethod === "PSE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-main"
              />
              <div className="ml-3">
                <span className="flex items-center gap-2 font-semibold text-text"><Landmark size={18} /> {t("cart.page.paymentPse", "Transferencia bancaria (PSE)")}</span>
                <span className="text-xs text-text opacity-70">{t("cart.page.paymentPseHint", "Débito directo desde tu cuenta bancaria")}</span>
              </div>
            </label>
          </div>

          {purchaseError && <p className="text-error text-sm mb-4">{purchaseError}</p>}

          <div className="flex justify-between items-center pt-4 border-t border-snd-bg">
            <button
              onClick={() => setStep("cart")}
              disabled={purchasing}
              className="text-text opacity-70 hover:opacity-100 font-medium px-4 py-2 cursor-pointer disabled:opacity-40"
            >
              {t("cart.page.backToCart", "← Volver al carrito")}
            </button>
            <button
              onClick={handleConfirmPurchase}
              disabled={purchasing}
              className="bg-main hover:bg-hover text-bg font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              {purchasing
                ? t("cart.page.processing", "Procesando...")
                : t("cart.page.finalizePurchase", "Finalizar compra ({amount})", {
                    amount: subtotal.toLocaleString("es-CO", { style: "currency", currency: "COP" }),
                  })}
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: CONFIRMACIÓN DE COMPRA */}
      {step === "success" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-accent/20 text-accent-text rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">{t("cart.page.successTitle", "¡Compra completada!")}</h2>
          <p className="text-text opacity-70 mb-6">{t("cart.page.successBody", "Gracias por tu compra. Tu orden ha sido procesada exitosamente.")}</p>

          <div className="bg-snd-bg p-4 rounded-lg max-w-sm mx-auto text-left text-sm text-text space-y-2 mb-6 border border-snd-bg">
            <p><strong>{t("cart.page.orderNumber", "N° de orden:")}</strong> #{completedOrder?.id}</p>
            <p><strong>{t("cart.page.total", "Total:")}</strong> {completedOrder?.totalPrice}</p>
            <p><strong>{t("cart.page.paymentMethodSelected", "Método seleccionado:")}</strong> {completedOrder?.paymentMethod || paymentMethod}</p>
            <p><strong>{t("cart.page.orderStatus", "Estado:")}</strong> {completedOrder?.status || t("cart.page.statusCompleted", "completado")}</p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-main hover:bg-hover text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {t("auth.backToHome", "Volver al inicio")}
          </button>
        </div>
      )}
    </div>
  );
};

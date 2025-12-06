"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PIGMENTO_DATA } from "@/lib/pigmento-content";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, ShieldCheck, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    email: ""
  });

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      router.push("/packs");
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppOrder = () => {
    // Validación básica
    if (!formData.name || !formData.address) {
      alert("Por favor completa tu nombre y dirección");
      return;
    }

    // Construir mensaje de pedido
    let message = `Hola Pigmento! 🎨 Quiero realizar el siguiente pedido:%0A%0A`;
    message += `*Cliente:* ${formData.name}%0A`;
    message += `*Tel:* ${formData.phone}%0A`;
    message += `*Dirección:* ${formData.address}, ${formData.city}%0A%0A`;
    message += `*PEDIDO:*%0A`;
    
    items.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString()}%0A`;
    });

    message += `%0A*TOTAL A PAGAR: $${totalPrice.toLocaleString()}*`;
    message += `%0A%0AQuedo atento a los datos de pago (Nequi/Bancolombia).`;

    // Abrir WhatsApp
    window.open(`https://wa.me/573160535247?text=${message}`, '_blank');
  };

  if (items.length === 0) return null;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-black mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la tienda
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* COLUMNA IZQUIERDA: DATOS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-black text-brand-black mb-2">FINALIZAR PEDIDO</h1>
              <p className="text-gray-500">Completa tus datos para el envío.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <MapPin className="text-brand-yellow" />
                <h2 className="font-bold text-lg">Información de Envío</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
                  <Input 
                    name="name" 
                    placeholder="Ej: Juan Pérez" 
                    className="bg-gray-50 border-gray-200 h-12 focus:ring-brand-yellow" 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Teléfono / WhatsApp</label>
                  <Input 
                    name="phone" 
                    placeholder="Ej: 300 123 4567" 
                    className="bg-gray-50 border-gray-200 h-12 focus:ring-brand-yellow" 
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Dirección Completa</label>
                <Input 
                  name="address" 
                  placeholder="Calle 123 # 45-67, Apto 201" 
                  className="bg-gray-50 border-gray-200 h-12 focus:ring-brand-yellow" 
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Ciudad / Municipio</label>
                  <Input 
                    name="city" 
                    placeholder="Ej: Bogotá D.C." 
                    className="bg-gray-50 border-gray-200 h-12 focus:ring-brand-yellow" 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email (Opcional)</label>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="juan@ejemplo.com" 
                    className="bg-gray-50 border-gray-200 h-12 focus:ring-brand-yellow" 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl flex items-start gap-4 border border-blue-100">
              <ShieldCheck className="text-blue-600 shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900">Pago Seguro al Recibir o Transferencia</h3>
                <p className="text-sm text-blue-700 mt-1">
                  No te cobraremos nada en este sitio. Coordinaremos el pago (Nequi/Bancolombia) directamente por WhatsApp para tu seguridad.
                </p>
              </div>
            </div>
          </motion.div>

          {/* COLUMNA DERECHA: RESUMEN */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32">
              <h2 className="font-black text-2xl mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6" /> RESUMEN
              </h2>

              <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío (A coordinar)</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">CALCULAR EN WHATSAPP</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-brand-black pt-4">
                  <span>TOTAL</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handleWhatsAppOrder}
                className="w-full h-16 text-lg font-black bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-6 h-6" />
                CONFIRMAR POR WHATSAPP
              </Button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Al hacer clic, se abrirá WhatsApp con los detalles de tu pedido pre-cargados.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
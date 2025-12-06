"use client";

import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

type OrderProps = {
  orders: any[];
};

export function OrderHistory({ orders }: OrderProps) {
  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          🛍️
        </div>
        <h3 className="text-lg font-medium text-gray-900">No hay pedidos aún</h3>
        <p className="mt-1 text-sm text-gray-500">¡Es hora de comprar algunos stickers increíbles!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {orders.map((order, index) => (
        <motion.div 
          key={order.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Pedido #{order.id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {order.status === 'COMPLETED' ? 'Entregado' : 
                 order.status === 'PENDING' ? 'Procesando' : order.status}
              </span>
              <p className="text-lg font-bold text-brand-black mt-1">{formatPrice(order.amount)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden relative">
                  {/* Placeholder optimizado o imagen real */}
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
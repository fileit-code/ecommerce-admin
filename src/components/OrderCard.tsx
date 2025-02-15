import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Truck, Wallet, Clock, CheckCircle } from "lucide-react";

interface Order {
  id: number;
  totalPrice: number;
  phoneNumber: string;
  address?: string;
  createdAt: string;
  paymentMethod: string;
  deliveryType: string;
  paid: boolean;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  comment?: string;
  createdAt: string;
}

interface OrderCardProps {
  order: Order;
  onDelete: (id: number) => void;
}

export default function OrderCard({ order, onDelete }: OrderCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Información principal */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Orden #{order.id}</h3>
            <Badge className={`${statusColors[order.paid ? 'paid' : 'pending']} text-sm`}>
              {order.paid ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
              {order.paid ? "Pagado" : "Pendiente"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4 text-gray-500" />
            <span>{order.paymentMethod == 'mercadopago'? 'Mercado Pago': 'Efectivo'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-gray-500" />
            <span>{order.deliveryType=='delivery' ? 'Delivery' : 'Retira en el local'}</span>
          </div>
          
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Precio y acciones - se mueve debajo en móviles */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold text-right md:text-left">${order.totalPrice.toFixed(2)}</p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to={`/admin/orders/${order.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Detalles
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(order.id)}
              className="w-full sm:w-auto"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
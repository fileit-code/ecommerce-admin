import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, ArrowLeft, Truck, Wallet } from "lucide-react";
import OrderProductCard from "@/components/OrderProductCard";

export default function Order() {
  const { id } = useParams<{ id: string }>();
  const { selectedOrder: order, loading, error, fetchOrderById } = useOrder();

  useEffect(() => {
    if (id) fetchOrderById(parseInt(id));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin h-12 w-12 text-gray-500" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500">
      Error cargando orden: {error}
    </div>
  );

  if (!order) return <div>Orden no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/admin/orders">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a órdenes
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Orden #{order.id}</h1>
            <Badge className={`text-sm ${order.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {order.paid ? 'Completada' : 'Pendiente'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Información de Pago
                </h3>
                <p>Método: {order.paymentMethod == 'mercadopago'? 'Mercado Pago': 'Efectivo'}</p>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                <p>Estado: {order.paid ? 'Pagado' : 'Pendiente'}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Información de Entrega
                </h3>
                <p>Tipo: {order.deliveryType=='delivery' ? 'Delivery' : 'Retira en el local'}</p>
                {order.address && <p>Dirección: {order.address}</p>}
                <p>Teléfono: {order.phoneNumber}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Detalles de la Orden</h3>
                <p>
                  Fecha: {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Aquí deberías agregar la lista de productos cuando el backend esté listo */}
              <div>
                <h3 className="font-semibold mb-2">Productos</h3>
                <div>
                  <h3 className="font-semibold mb-2">Productos ({order.items.length})</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <OrderProductCard
                        key={item.id}
                        productId={item.productId}
                        comment={item.comment}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
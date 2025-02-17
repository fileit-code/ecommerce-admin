import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useEffect } from "react"
import { onMessage } from "firebase/messaging"
import toast from "react-hot-toast";
import { messaging } from "@/firebase";


interface Order {
  id: number;
  totalPrice: number;
  phoneNumber: string;
  address?: string;
  createdAt: string;
  paymentMethod: string;
  deliveryType: string;
  paid: boolean;
  items: OrderItem[]; // Nueva propiedad
}

interface OrderItem {
  id: number;
  productId: number;
  comment?: string;
  createdAt: string;
}


interface OrderContextType {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextType>({} as OrderContextType);

export function useOrder() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url =  'https://ecommerceplantilla-back.fileit-contact.workers.dev/api';
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (user) { 
      
    setLoading(true);
    try {
      const response = await fetch(url+"/orders/list/"+user.id, {
        credentials: 'include'
      });
      console.log(response)
      const data = await response.json();
      console.log(data)
      
      if (data.orders) {
        if (data.orders.length > 1) {
          setOrders(data.orders.map((order: any) => ({
            ...order,
            paid: order.paid === 1,
            createdAt: new Date(order.createdAt).toISOString()
          })));
        }
        else {
          setOrders([{
            ...data.orders,
            paid: data.orders.paid === 1,
            createdAt: new Date(data.orders.createdAt).toISOString()
          }])
        }
      } else {
        throw new Error(data.message || "Error fetching orders");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
    }
  };

  const fetchOrderById = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(url+`/orders/get/${id}`,{
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedOrder({
          ...data.order,
          paid: data.order.paid === 1,
          createdAt: new Date(data.order.createdAt).toISOString(),
          items: data.order.items.map((item: any) => ({
            ...item
          }))
        });
      } else {
        throw new Error(data.message || "Error fetching order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      const response = await fetch(url+`/orders/delete/${id}`, {
        method: "DELETE",
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Error deleting order");
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }; 
  
  useEffect(()=>{
    onMessage(messaging, ()=> {{
      toast('Nuevo Pedido recibido!!')
    }})
  }, [])

  return (
    <OrderContext.Provider
      value={{
        orders,
        selectedOrder,
        loading,
        error,
        fetchOrders,
        fetchOrderById,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
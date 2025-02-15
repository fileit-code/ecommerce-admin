import AddProductForm from "@/components/AddProductForm"
import AdminProductCard from "@/components/AdminProductCard"
// import { Button } from "@/components/ui/button"
import { useProduct } from "@/context/ProductContext"
import { useEffect, useState } from "react"
// import { messaging } from "@/firebase"
// import { getToken } from "firebase/messaging"
import AdminSidebar from "@/components/AdminSidebar"

export interface Product {
    id: number;
    imageURL: string | null;
    name: string;
    description: string;
    price: number;
}

export default function AdminDashboard() {
    const { products, getProducts } = useProduct();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // const handleEnableNotifications = async () => {
    //     try {
    //         const permission = await Notification.requestPermission();
    //         if (permission === 'granted') {
    //             const token = await getToken(messaging, { 
    //                 vapidKey: import.meta.env.VITE_VAPID_KEY 
    //             });
                
    //             await fetch('/api/auth/fcm-token', {
    //                 method: 'PUT',
    //                 credentials: 'include',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ token })
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error al activar notificaciones:', error);
    //     }
    // };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="md:ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Administración de Productos</h1>
                        <Button onClick={handleEnableNotifications}>
                            Activar Notificaciones
                        </Button>
                    </div>
                     */}
                    {
                    isDialogOpen &&
                    <AddProductForm 
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                            setIsDialogOpen(open);
                        }}
                        initialValues={editingProduct}
                    />
                    }
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <AdminProductCard 
                                key={product.id} 
                                product={product} 
                                onEdit={() => {
                                    setEditingProduct(product);
                                    setIsDialogOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
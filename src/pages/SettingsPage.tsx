import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { messaging } from "@/firebase";
import { getToken } from "firebase/messaging";
import { useState } from "react";
import { BellRing, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/AdminSidebar";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { 
            vapidKey: 'BKaaXFfpqIMpYwDgvxw8VUvdeTA-zGA6q7wbfPoE3NJY8ImL1vEgn3pFIjppa-9vN5uVODIjSu-4e2-m0U-VHKo'
        });
        
        await fetch('/api/auth/fcm-token', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        setNotificationsEnabled(true);
        toast.success("Notificaciones activadas");
      }
    } catch (error) {
      toast.error("Hubo un error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Skeleton className="h-9 w-[200px] mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 mt-12 md:mt-0 md:ml-64">
      <AdminSidebar/>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tus preferencias y configuraciones de cuenta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Información de la cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Correo electrónico</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{user?.email || "No disponible"}</span>
              <Badge variant="outline">Verificado</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            Preferencias de notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <p className="font-medium">Notificaciones push</p>
              <p className="text-sm text-muted-foreground">
                Recibe actualizaciones importantes sobre tus pedidos
              </p>
            </div>
            <Button 
              onClick={handleEnableNotifications}
              disabled={notificationsEnabled}
              className="gap-2"
            >
              <BellRing className="h-4 w-4" />
              {notificationsEnabled ? "Activadas" : "Activar Notificaciones"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
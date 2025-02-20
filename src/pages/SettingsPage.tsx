import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { BellRing, Image, PencilLine } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function SettingsPage() {
  const { user, loading, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    shopname: user?.shopname || "",
    address: user?.address || "",
    imageUrl: user?.imageUrl || "",
    imageBase64: "",
  });
  const [logoPreview, setLogoPreview] = useState("");

  const handleSubmit = async ()=> {
    const result = await updateProfile(formData.username, formData.shopname, formData.address, formData.imageBase64);
    if (result && user && user.address && user.imageUrl) { 
      setFormData({
        ...formData,
        username: user.username,
        shopname: user.shopname,
      })
      if (user.address && user.imageUrl) {
        setFormData({
          ...formData,
          address: user.address,
          imageUrl: user.imageUrl
        })
      }
    }
  }

  const toBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'username' ? value.replace(/\s/g, '') : value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const imgB64 = await toBase64(file);
      setFormData({...formData, imageBase64: imgB64})
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-9 w-[200px] mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-12 md:mt-0 md:ml-64">
      <AdminSidebar />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Configuración de Tienda</h1>
        <p className="text-muted-foreground">
          Administra la información de tu tienda y preferencias
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Image className="h-6 w-6 text-primary" />
            Identidad de la Tienda
          </CardTitle>
          <CardDescription>Personaliza la información pública de tu tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="space-y-2">
              <Label className="text-sm">Logo de la tienda</Label>
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2">
                  {
                    logoPreview
                    ?
                      <AvatarImage src={logoPreview} />
                    :
                      user?.imageUrl 
                      ?
                      <AvatarImage src={user.imageUrl} />
                      :
                      <AvatarImage src={logoPreview} />
                  }
                  <AvatarFallback className="bg-muted text-2xl">
                    {user?.shopname?.[0] || "T"}
                  </AvatarFallback>
                </Avatar>
                <Label 
                  htmlFor="logo-upload"
                  className="absolute bottom-0 right-0 bg-background p-1.5 rounded-full border cursor-pointer shadow-sm hover:bg-muted transition-colors"
                >
                  <PencilLine className="h-4 w-4" />
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shopname">Nombre de la Tienda</Label>
                  <Input
                    id="shopname"
                    name="shopname"
                    value={formData.shopname}
                    onChange={handleInputChange}
                    placeholder="Ej: Moda Urbana"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Ej: modaurbana"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL: www.shop.ai/{formData.username || 'username'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección de la Tienda</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ej: Av. Principal 123"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BellRing className="h-6 w-6 text-primary" />
            Configuración de Notificaciones
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
              variant={(user?.fcmToken) ? "secondary" : "default"}
              className="gap-2"
            >
              <BellRing className="h-4 w-4" />
              {(user?.fcmToken) ? "Activadas" : "Activar Notificaciones"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
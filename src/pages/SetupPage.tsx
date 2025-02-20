import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function SetupPage() {
    const {signUpInfo, setSignUpInfo, register} = useAuth();
      const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setError(null); // Limpia cualquier error previo

      try {
        const result = await register();
        if (result) navigate('/')
      } catch (err) {
        setError("Error al iniciar sesión. Verifica tus credenciales."); // Muestra un mensaje de error
        console.log(error)
      }
    }

    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Sección izquierda - Beneficios */}
        <div className="hidden lg:flex flex-col gap-8 p-12 bg-muted/20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Configura tu tienda</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                👗 <span className="font-medium">Especializado en moda y alimentos</span>
              </div>
              <div className="flex items-center gap-3">
                🛒 <span className="font-medium">Interfaz estándar optimizada</span>
              </div>
              <div className="flex items-center gap-3">
                📈 <span className="font-medium">Dashboard de gestión inteligente</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Formulario derecha */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Completa tu perfil</h1>
              <p className="text-muted-foreground">
                Configura los datos básicos de tu tienda
              </p>
            </div>
  
            <form
            onSubmit={handleSubmit}
            className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre de la tienda</Label>
                <Input placeholder="Ej: Moda Urbana" value={signUpInfo.shopname ? signUpInfo.shopname : ''} onChange={(e)=> setSignUpInfo({...signUpInfo, shopname: e.target.value})} />
              </div>
  
              <div className="space-y-2">
                <Label>Nombre de usuario</Label>
                <Input 
                  value={signUpInfo.username ? signUpInfo.username : ''}
                  onChange={(e)=> setSignUpInfo({...signUpInfo, username: e.target.value.replace(/\s/g, '')})}
                  placeholder="Ej: modaurbana"

                />
                <p className="text-sm text-muted-foreground">
                  Tu URL: www.shop.ai/{signUpInfo.username || 'username'}
                </p>
              </div>
  
              <div className="space-y-2">
                <Label>Dirección (opcional)</Label>
                <Input placeholder="Ej: Av. Principal 123" value={signUpInfo.address ? signUpInfo.address : ''} onChange={(e)=> setSignUpInfo({...signUpInfo, address: e.target.value})} />
              </div>
  
              <Button 
              className="w-full" 
              type="submit">
                Crear tienda
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }
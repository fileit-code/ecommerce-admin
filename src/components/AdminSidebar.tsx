import { Button } from "@/components/ui/button";
import { Menu, Package2, ListOrdered, Settings } from "lucide-react";
import { NavLink } from "react-router";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import AddProductForm from "./AddProductForm";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminSidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth(); // Obtén el usuario del contexto de autenticación

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger className="fixed top-6 left-6 z-50">
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[60vh] max-w-2xl mx-auto border-none shadow-2xl">
            <DrawerHeader>
              <DrawerTitle className="text-3xl font-bold text-gray-800">
                {user?.shopname || "Menu"} {/* Muestra el shopname o "Menu" si no está disponible */}
              </DrawerTitle>
            </DrawerHeader>

            <ScrollArea className="h-[40vh] pr-4 grid gap-2 text-lg font-medium">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Package2 className="h-5 w-5" />
                Productos
              </NavLink>

              <AddProductForm
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                }}
              />
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <ListOrdered className="h-5 w-5" />
                Ver Órdenes
              </NavLink>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Settings className="h-5 w-5" />
                Configuración
              </NavLink>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r h-screen fixed left-0 top-0 p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {user?.shopname || "Tienda"} {/* Muestra el shopname o "Tienda" si no está disponible */}
          </h2>
        </div>
        <nav className="grid gap-2 text-lg font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Package2 className="h-5 w-5" />
            Productos
          </NavLink>

          <AddProductForm
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
            }}
          />
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <ListOrdered className="h-5 w-5" />
            Ver Órdenes
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            Configuración
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
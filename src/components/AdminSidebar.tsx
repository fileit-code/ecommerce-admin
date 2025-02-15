import { Button } from "@/components/ui/button"
import { Menu, Package2,  ListOrdered } from "lucide-react"
import { NavLink } from "react-router"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer"
import { ScrollArea } from "./ui/scroll-area"
import AddProductForm from "./AddProductForm"
import { useState } from "react"

export default function AdminSidebar() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              Menu
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
            {/* <Button
              onClick={()=> setIsDialogOpen(true)}
              className='flex items-center gap-2 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:text-foregroun'
            >
              <PlusCircle className="h-5 w-5" />
              Agregar Producto
            </Button> */}
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
          </ScrollArea>
        </DrawerContent>

      </Drawer>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r h-screen fixed left-0 top-0 p-4">
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
        </nav>
      </aside>
    </>
  )
}
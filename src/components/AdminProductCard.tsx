import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from "./ui/button";
import {FiEdit, FiTrash2} from 'react-icons/fi'
import toast from "react-hot-toast";
import { useProduct } from "@/context/ProductContext";
import { Card } from "./ui/card";
// import { Badge } from "./ui/badge";
import { AspectRatio } from "./ui/aspect-ratio";
  

interface Product {
  id: number;
  imageURL: string | null;
  name: string;
  description: string;
  price: number;
}

export default function AdminProductCard({ product, onEdit }: { 
    product: Product;
    onEdit: () => void;
}) {
  const { deleteProduct } = useProduct();
  const {name, price, description, imageURL} = product;

  const handleDelete= (id: number, name: string)=>{
    toast((t: any)=>(
        <div>
            <p className='text-white'>¿Seguro que quieres eliminar este producto?<strong>{name}</strong> </p>
            <div>
                <button 
                className='bg-red-500 hover:bg-red-400 px-3 py-2 rounded-sm text-sm mx-2 text-white'
                onClick={()=> {
                    deleteProduct(id)
                    toast.dismiss(t.id)
                }}
                >
                    Eliminar
                </button>
                <button className='bg-slate-400 hover:bg-slate-500 px-3 py-2 rounded-sm mx-2 text-white'
                onClick={()=> toast.dismiss(t.id)}
                >
                    Cancelar
                </button>
            </div>
        </div>
    ), {
        style:{
            background: "#202020"
        }
    })
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col sm:flex-row hover:cursor-pointer">
      {/* Sección de imagen - Mobile: Full width, Desktop: 40% */}
      <div className="sm:w-[40%] flex-shrink-0 border-r bg-muted/50">
        <AspectRatio ratio={4/3} className="bg-gradient-to-br from-muted/20 to-muted/50">
          {imageURL ? (
            <img
              src={imageURL}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground/50">
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Contenido - Mobile: Full width, Desktop: 60% */}
      <div className="flex-1 p-4 flex flex-col justify-between hover:cursor-pointer">
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold truncate">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-2">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground self-end">ARS</span>
            <p className="text-xl font-bold text-primary">
              ${price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Ribbon para desktop */}
      <div className="absolute top-2 left-2 hidden sm:block">
        <div className="bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
          Nuevo
        </div>
      </div>
    </Card>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle
              data-view-transition-name={`product-title-${product.id}`}
            >
              {product.name}
            </DrawerTitle>
            <DrawerDescription>{product.description}</DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4">
            {
              product.imageURL
              ? 
              <img
              src={product.imageURL}
              alt={`Product ${product.name}`}
              className="w-full h-48 object-cover rounded-lg"
              data-view-transition-name={`product-image-${product.id}`}
              />
              :
              <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
            }
            <div className="mt-4 flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>
          </div>

          <DrawerFooter>
              <div className="flex gap-2 justify-between px-8">
                  <Button 
                  onClick={onEdit}
                  variant="outline" 
                  size="sm"
                  >
                    <FiEdit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(product.id, product.name)}
                  >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Eliminar
                  </Button>
              </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
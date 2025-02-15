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
          <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mx-4 my-6 cursor-pointer">
            <div className="block">
              {
                product.imageURL
                ?
                <img
                src={product.imageURL}
                alt={`Product ${product.name}`}
                className="w-full h-48 object-cover"
                data-view-transition-name={`product-image-${product.id}`}
                />
                :
                <div className="w-full h-48 bg-gray-200"></div>
              }
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  data-view-transition-name={`product-title-${product.id}`}
                >
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-start items-center">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                </div>
              </div>
            </div>
          </div>
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
import { useState, useEffect } from 'react';
import { useProduct } from '@/context/ProductContext';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from 'lucide-react';
import { FaCloudUploadAlt } from "react-icons/fa";

export interface Product {
  id: number;
  imageURL: string | null;
  name: string;
  description: string;
  price: number;
}


export interface AddProductFormProps { 
  initialValues?: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddProductForm = ({ initialValues, open, onOpenChange }: AddProductFormProps) => {
  const [formValues, setFormValues] = useState({
      name: '',
      price: '',
      description: '',
      imageFile: null as File | null,
  });
  const { addProduct, updateProduct } = useProduct();
  const [state, setState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const toBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const readFile = (file: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        setImagePreview(reader.result as string);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {

        if (initialValues) {
          if (formValues.imageFile) {
            const imageBase64 = await toBase64(formValues.imageFile)
            await updateProduct(
              initialValues.id,
              formValues.name,
              Number(formValues.price),
              formValues.description,
              imageBase64
          );
          }
          else {
            await updateProduct(
              initialValues.id,
              formValues.name,
              Number(formValues.price),
              formValues.description,
              null
          );
          }
        } else {
          if (formValues.imageFile) {
            const imageBase64 = await toBase64(formValues.imageFile)

            await addProduct(
              formValues.name,
              Number(formValues.price),
              imageBase64,
              formValues.description
          );
          }
          else {
            await addProduct(
              formValues.name,
              Number(formValues.price),
              null,
              formValues.description
          );
          }
        }
        
        onOpenChange(false);
    } finally {
        setIsLoading(false);
    }
};  

  useEffect(() => {
    if (!open) {
      setFormValues({
        name: '',
        price: '',
        description: '',
        imageFile: null,
      });
      setState(false);
    }
    else {
      if (initialValues) {
        setFormValues({
            name: initialValues.name,
            price: initialValues.price.toString(),
            description: initialValues.description,
            imageFile: null,
        });
        if (initialValues.imageURL) {
          setImagePreview(initialValues.imageURL);
          setState(true);
        }
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {
        !initialValues &&
        <DialogTrigger asChild>
        <button
        className='flex items-center gap-2 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:text-foreground'
      >
        <PlusCircle className="h-5 w-5" />
        Agregar Producto
      </button>
      </DialogTrigger>
      }
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {initialValues ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={(e)=>handleSubmit(e)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={formValues.price}
              onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
              placeholder="Precio en USD"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={formValues.description}
              onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
              placeholder="Descripción detallada"
              required
            />
          </div>
          <Label htmlFor="image">
            {
              state ? (
                <div className="resultado">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      className="object-cover h-32 w-32 hover:cursor-pointer"
                      alt="Preview"
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center bg-neutral-900 text-white rounded py-3 cursor-pointer hover:bg-neutral-800">
                  <FaCloudUploadAlt className="h-4 w-4 mr-2 mb-1" /> Imagen
                </div>
              )
            }
          </Label>

              <input 
              type="file" 
              name="imageFile" 
              className='absolute invisible'
              id="image"
              onChange={e => {
                if (e.target && e.target.files) {
                  readFile(e.target.files[0])
                  setFormValues({ ...formValues, imageFile: e.target.files[0] });
                }
                setState(true)
              }}
              />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={()=>onOpenChange(false)}
            >
              Cancelar
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : initialValues ? (
                'Actualizar Producto'
              ) : (
                'Guardar Producto'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;
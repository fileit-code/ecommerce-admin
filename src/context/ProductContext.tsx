import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext.tsx";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageURL: string | null;
  createdAt: Date;
  createdBy: number;
}

interface ProductContextType {
  products: Product[];
  getProduct: (id: number) => Promise<Product | null>;
  getProducts: () => Promise<void>;
  addProduct: (name: string, price: number, image: string | null, description: string) => Promise<void>;
  updateProduct: (id: number, name: string, price: number, description: string, imageFile: string | null) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used within a ProductProvider");
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  const url =  'https://ecommerceplantilla-back.fileit-contact.workers.dev/api';

  const getProducts = async () => {
    if (user) {   
      try {
        const response = await fetch(url+'/products/list/'+ user.id,{
          credentials: 'include'
        });
        const data = await response.json();
        if (data && data.products) {
          if (data.products.length > 0) { 
            data.products.map((p: any) => {
              setProducts({
                ...p,
                createdAt: new Date(p.createdAt),
              })
            })
          }
          else setProducts([data.products])
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  const getProduct = async (id: number): Promise<Product | null> => {
    try {
      const response = await fetch(url+`/products/get/${id}`,{
        credentials: 'include'
      });
      const data = await response.json();
      return data.product ? { 
        ...data.product, 
        createdAt: new Date(data.product.createdAt) 
      } : null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  const addProduct = async (name: string, price: number, image: string | null, description: string) => {
    try {
      if (user) {
        const response = await fetch(url+'/products/create', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name, 
            price, 
            description,
            image,
            userId: user.id
          }),
        });
        console.log(response)
        const data = await response.json()
        console.log(data)
        const { product } = await data;
        if (product) {
          setProducts(prev => [...prev, {
            ...product,
            createdAt: new Date(product.createdAt)
          }]);
        }
      }
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: number, name: string, price: number, description: string, imageBase64: string | null) => {
    try {
      let response: Response | null = null;

      if (imageBase64) { 
        response = await fetch(url+`/products/update`, {
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify({id, name, price, description, imageBase64 }),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log({id, name, price, description, imageBase64 })
      }
      else {
        response = await fetch(url+`/products/update`, {
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify({ id, name, price, description }),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log({id, name, price, description  })
      }
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...(data.product)  } : p
        ));
      }
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await fetch(url+`/products/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      getProducts,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};
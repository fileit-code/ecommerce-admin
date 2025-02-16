import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";
import { Loader } from "lucide-react";

// import {AiOutlineLoading3Quarters} from 'react-icons/ai'

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({children}: PrivateRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) return
    <div className="flex justify-center items-center h-screen bg-background">
      <Loader className="animate-spin h-12 w-12 text-primary" />
    </div>
  
    if (!user) return <Navigate to="/signin"/>;
  
    return <>{children}</>;
}

export default PrivateRoute
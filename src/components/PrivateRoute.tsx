import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

// import {AiOutlineLoading3Quarters} from 'react-icons/ai'

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({children}: PrivateRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="w-full h-[100vh] bg-lime-500 flex text-white">
        Loading...
        {/* <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin m-auto"/> */}
    </div>;
  
    if (!user) return <Navigate to="/signin"/>;
  
    return <>{children}</>;
}

export default PrivateRoute
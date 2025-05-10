
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminPanel from "@/components/admin/AdminPanel";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return null;
  }
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;

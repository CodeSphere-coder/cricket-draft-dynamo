
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import PlayerCatalog from "@/components/player/PlayerCatalog";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Players = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Player Catalog</h1>
        <PlayerCatalog />
      </div>
    </div>
  );
};

export default Players;

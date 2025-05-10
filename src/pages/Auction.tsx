
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AuctionInterface from "@/components/auction/AuctionInterface";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Auction = () => {
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
        <AuctionInterface />
      </div>
    </div>
  );
};

export default Auction;

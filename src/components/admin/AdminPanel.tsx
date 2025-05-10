
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import PlayerManagement from "./PlayerManagement";
import AuctionControls from "./AuctionControls";
import AuctionResults from "./AuctionResults";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      
      <Tabs defaultValue="players">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="players">Manage Players</TabsTrigger>
          <TabsTrigger value="auction">Auction Controls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="py-4">
          <PlayerManagement />
        </TabsContent>
        
        <TabsContent value="auction" className="py-4">
          <AuctionControls />
          <AuctionResults />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;

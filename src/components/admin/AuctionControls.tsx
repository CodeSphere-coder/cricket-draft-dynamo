
import { useAuction } from "@/context/AuctionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuctionControls = () => {
  const { auctionState, startAuction, pauseAuction, resumeAuction, endAuction, nextPlayer } = useAuction();
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };
  
  const isAuctionActive = auctionState.status === 'in-progress';
  const isAuctionPaused = auctionState.status === 'paused';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction Controls</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Current Status</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <div className="font-medium capitalize">{auctionState.status}</div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Current Player</span>
              <div className="font-medium">{auctionState.currentPlayer?.name || "None"}</div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Sold Players</span>
              <div className="font-medium">{auctionState.soldPlayers.length}</div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Unsold Players</span>
              <div className="font-medium">{auctionState.unsoldPlayers.length}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {auctionState.status === 'idle' && (
            <Button onClick={startAuction}>Start Auction</Button>
          )}
          
          {isAuctionActive && (
            <Button variant="outline" onClick={pauseAuction}>Pause Auction</Button>
          )}
          
          {isAuctionPaused && auctionState.currentPlayer && (
            <Button variant="outline" onClick={resumeAuction}>Resume Auction</Button>
          )}
          
          {(isAuctionActive || isAuctionPaused) && (
            <>
              <Button variant="outline" onClick={nextPlayer}>Next Player</Button>
              <Button variant="destructive" onClick={endAuction}>End Auction</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionControls;

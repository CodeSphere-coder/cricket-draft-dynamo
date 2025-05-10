import { useEffect, useState } from "react";
import { useAuction } from "@/context/AuctionContext";
import { useAuth } from "@/context/AuthContext";
import Timer from "./Timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AuctionInterface = () => {
  const { auctionState, startAuction, pauseAuction, resumeAuction, nextPlayer, endAuction, placeBid } = useAuction();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [nextBidAmount, setNextBidAmount] = useState(0);
  
  // Update next bid amount when current bid changes
  useEffect(() => {
    if (auctionState.currentBid) {
      const increment = getBidIncrement(auctionState.currentBid);
      setNextBidAmount(auctionState.currentBid + increment);
    }
  }, [auctionState.currentBid]);
  
  // Helper function to get bid increment based on current price
  const getBidIncrement = (currentBid: number) => {
    if (currentBid < 1000000) return 100000; // 10L increment if < 1Cr
    if (currentBid < 5000000) return 200000; // 20L increment if < 5Cr
    if (currentBid < 10000000) return 500000; // 50L increment if < 10Cr
    return 1000000; // 1Cr increment if >= 10Cr
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    } else {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
  };
  
  const handleBid = () => {
    if (user?.role !== 'team-owner') {
      toast({
        title: "Permission Denied",
        description: "Only team owners can place bids",
        variant: "destructive"
      });
      return;
    }
    
    placeBid(nextBidAmount);
  };
  
  const isAdmin = user?.role === 'admin';
  const isTeamOwner = user?.role === 'team-owner';
  const isAuctionActive = auctionState.status === 'in-progress';
  const isAuctionPaused = auctionState.status === 'paused';
  const isAuctionIdle = auctionState.status === 'idle';
  const isAuctionCompleted = auctionState.status === 'completed';
  
  if (isAuctionCompleted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-8">Auction Completed</h2>
        
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Auction Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <span>Total Players Sold:</span>
              <span className="font-medium">{auctionState.soldPlayers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Players Unsold:</span>
              <span className="font-medium">{auctionState.unsoldPlayers.length}</span>
            </div>
          </div>
          
          {isAdmin && (
            <Button onClick={() => window.location.reload()}>Start New Auction</Button>
          )}
        </div>
      </div>
    );
  }
  
  if (isAuctionIdle) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Cricket Player Auction</h2>
        <p className="text-gray-500 mb-8">The auction has not started yet. Admin can initiate the auction.</p>
        
        {isAdmin && (
          <Button size="lg" onClick={startAuction}>Start Auction</Button>
        )}
        
        {!isAdmin && (
          <p className="text-sm text-muted-foreground">Waiting for admin to start the auction...</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Live Auction</h2>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {isAdmin && isAuctionActive && (
              <Button variant="outline" onClick={pauseAuction}>Pause</Button>
            )}
            
            {isAdmin && isAuctionPaused && auctionState.currentPlayer && (
              <Button variant="outline" onClick={resumeAuction}>Resume</Button>
            )}
            
            {isAdmin && isAuctionPaused && (
              <Button variant="outline" onClick={nextPlayer}>Next Player</Button>
            )}
            
            {isAdmin && (
              <Button variant="destructive" onClick={endAuction}>End Auction</Button>
            )}
          </div>
        </div>
        
        {auctionState.currentPlayer ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-28 h-28 rounded-full mx-auto md:mx-0">
                    <AvatarImage 
                      src={auctionState.currentPlayer.image || "/placeholder.svg"} 
                      alt={auctionState.currentPlayer.name} 
                      className="object-cover object-center"
                    />
                    <AvatarFallback>{auctionState.currentPlayer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">{auctionState.currentPlayer.name}</h3>
                      <Badge>{auctionState.currentPlayer.country}</Badge>
                      <Badge className="bg-cricket-purple">{auctionState.currentPlayer.role}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Matches</span>
                        <div className="font-medium">{auctionState.currentPlayer.stats.matches}</div>
                      </div>
                      
                      {auctionState.currentPlayer.stats.runs !== undefined && (
                        <div>
                          <span className="text-sm text-gray-500">Runs</span>
                          <div className="font-medium">{auctionState.currentPlayer.stats.runs}</div>
                        </div>
                      )}
                      
                      {auctionState.currentPlayer.battingAvg !== undefined && (
                        <div>
                          <span className="text-sm text-gray-500">Batting Avg</span>
                          <div className="font-medium">{auctionState.currentPlayer.battingAvg}</div>
                        </div>
                      )}
                      
                      {auctionState.currentPlayer.stats.wickets !== undefined && (
                        <div>
                          <span className="text-sm text-gray-500">Wickets</span>
                          <div className="font-medium">{auctionState.currentPlayer.stats.wickets}</div>
                        </div>
                      )}
                      
                      {auctionState.currentPlayer.bowlingAvg !== undefined && (
                        <div>
                          <span className="text-sm text-gray-500">Bowling Avg</span>
                          <div className="font-medium">{auctionState.currentPlayer.bowlingAvg}</div>
                        </div>
                      )}
                      
                      {auctionState.currentPlayer.stats.economy !== undefined && (
                        <div>
                          <span className="text-sm text-gray-500">Economy</span>
                          <div className="font-medium">{auctionState.currentPlayer.stats.economy}</div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Base Price</span>
                      <div className="font-semibold text-cricket-orange">
                        {formatPrice(auctionState.currentPlayer.basePrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-2">
                    <Timer 
                      seconds={auctionState.timeRemaining} 
                      isRunning={auctionState.status === 'in-progress'} 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Current Bid</span>
                      <div className="text-2xl font-bold">{formatPrice(auctionState.currentBid)}</div>
                      {auctionState.currentBidder && (
                        <div className="text-sm">
                          by <span className="font-medium text-cricket-purple">{auctionState.currentBidder}</span>
                        </div>
                      )}
                    </div>
                    
                    {isTeamOwner && isAuctionActive && (
                      <div className="pt-2">
                        <Button 
                          onClick={handleBid} 
                          className="w-full bg-cricket-green hover:bg-green-600 transition-colors"
                          size="lg"
                        >
                          Bid {formatPrice(nextBidAmount)}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No player is currently being auctioned.</p>
            {isAdmin && (
              <Button onClick={nextPlayer} className="mt-4">
                Start with First Player
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Auction History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Player</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Team</th>
                <th className="text-left py-3 px-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {auctionState.soldPlayers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No players have been sold yet
                  </td>
                </tr>
              ) : (
                auctionState.soldPlayers.map((sold) => (
                  <tr key={sold.player.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span>{sold.player.name}</span>
                        <Badge className="ml-2" variant="outline">{sold.player.country}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">{sold.player.role}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-cricket-purple">{sold.team}</span>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatPrice(sold.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuctionInterface;

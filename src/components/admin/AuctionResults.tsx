
import { useAuction } from "@/context/AuctionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuctionResults = () => {
  const { auctionState } = useAuction();
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };
  
  if (auctionState.soldPlayers.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Auction Results</CardTitle>
      </CardHeader>
      
      <CardContent>
        <h3 className="font-medium mb-3">Sold Players</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Player</th>
                <th className="text-left py-2 px-3">Role</th>
                <th className="text-left py-2 px-3">Team</th>
                <th className="text-left py-2 px-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {auctionState.soldPlayers.map((sold) => (
                <tr key={sold.player.id} className="border-b">
                  <td className="py-2 px-3">{sold.player.name}</td>
                  <td className="py-2 px-3">{sold.player.role}</td>
                  <td className="py-2 px-3">{sold.team}</td>
                  <td className="py-2 px-3 font-medium">{formatPrice(sold.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionResults;

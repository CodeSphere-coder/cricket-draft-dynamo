
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlayerCardProps {
  id: string;
  name: string;
  role: string;
  basePrice: number;
  country: string;
  battingAvg?: number;
  bowlingAvg?: number;
  stats: {
    matches: number;
    runs?: number;
    wickets?: number;
    strikeRate?: number;
    economy?: number;
    highestScore?: number;
    bestBowling?: string;
  };
  image?: string;
}

const PlayerCard = ({
  name,
  role,
  basePrice,
  country,
  battingAvg,
  bowlingAvg,
  stats,
  image,
}: PlayerCardProps) => {
  const baseImage = image || '/placeholder.svg';
  
  // Helper function to format price display
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    } else {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
  };
  
  return (
    <Card className="player-card h-full flex flex-col justify-between">
      <CardHeader className="pb-2 pt-4 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
          <img src={baseImage} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline">{country}</Badge>
          <Badge className="bg-cricket-purple text-white">{role}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-2 text-center">
          <span className="text-sm text-gray-500">Base Price</span>
          <div className="font-semibold text-lg text-cricket-orange">{formatPrice(basePrice)}</div>
        </div>
        
        <div className="stats-grid">
          <div className="p-1 bg-gray-50 rounded">
            <span className="block text-xs text-gray-500">Matches</span>
            <span className="font-medium">{stats.matches}</span>
          </div>
          
          {stats.runs !== undefined && (
            <div className="p-1 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Runs</span>
              <span className="font-medium">{stats.runs}</span>
            </div>
          )}
          
          {battingAvg !== undefined && (
            <div className="p-1 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Bat Avg</span>
              <span className="font-medium">{battingAvg}</span>
            </div>
          )}
          
          {stats.strikeRate !== undefined && (
            <div className="p-1 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Strike Rate</span>
              <span className="font-medium">{stats.strikeRate}</span>
            </div>
          )}
          
          {stats.wickets !== undefined && (
            <div className="p-1 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Wickets</span>
              <span className="font-medium">{stats.wickets}</span>
            </div>
          )}
          
          {bowlingAvg !== undefined && (
            <div className="p-1 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Bowl Avg</span>
              <span className="font-medium">{bowlingAvg}</span>
            </div>
          )}
          
          {stats.economy !== undefined && (
            <div className="p-1 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Economy</span>
              <span className="font-medium">{stats.economy}</span>
            </div>
          )}
          
          {stats.bestBowling && (
            <div className="p-1 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Best Bowl</span>
              <span className="font-medium">{stats.bestBowling}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;

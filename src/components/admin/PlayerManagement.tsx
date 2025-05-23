
import { useState } from "react";
import { useAuction } from "@/context/AuctionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const PlayerManagement = () => {
  const { addPlayer } = useAuction();
  const { toast } = useToast();
  
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    role: "Batsman",
    basePrice: 1000000, // Default 10L
    country: "",
    battingAvg: 0,
    bowlingAvg: 0,
    stats: {
      matches: 0,
      runs: 0,
      wickets: 0,
      strikeRate: 0,
      economy: 0
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newPlayer.name || !newPlayer.country || newPlayer.basePrice <= 0 || newPlayer.stats.matches <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values",
        variant: "destructive"
      });
      return;
    }
    
    // Add player
    addPlayer(newPlayer);
    
    // Reset form
    setNewPlayer({
      name: "",
      role: "Batsman",
      basePrice: 1000000,
      country: "",
      battingAvg: 0,
      bowlingAvg: 0,
      stats: {
        matches: 0,
        runs: 0,
        wickets: 0,
        strikeRate: 0,
        economy: 0
      }
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "stats") {
        setNewPlayer({
          ...newPlayer,
          stats: {
            ...newPlayer.stats,
            [child]: parseFloat(value) || 0
          }
        });
      }
    } else {
      setNewPlayer({
        ...newPlayer,
        [name]: name === "basePrice" ? Math.max(100000, parseFloat(value) || 0) : value
      });
    }
  };
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Player</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Player Name*</Label>
              <Input
                id="name"
                name="name"
                value={newPlayer.name}
                onChange={handleInputChange}
                placeholder="Full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country*</Label>
              <Input
                id="country"
                name="country"
                value={newPlayer.country}
                onChange={handleInputChange}
                placeholder="Country name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Select 
                value={newPlayer.role} 
                onValueChange={(value) => setNewPlayer(prev => ({...prev, role: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-rounder">All-rounder</SelectItem>
                  <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price*</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                min={100000}
                step={100000}
                value={newPlayer.basePrice}
                onChange={handleInputChange}
                placeholder="Base price in INR"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatPrice(newPlayer.basePrice)}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-3">Player Statistics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stats.matches">Matches*</Label>
                <Input
                  id="stats.matches"
                  name="stats.matches"
                  type="number"
                  min="0"
                  value={newPlayer.stats.matches}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {(newPlayer.role === "Batsman" || newPlayer.role === "All-rounder" || newPlayer.role === "Wicket-keeper") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="stats.runs">Runs</Label>
                    <Input
                      id="stats.runs"
                      name="stats.runs"
                      type="number"
                      min="0"
                      value={newPlayer.stats.runs}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="battingAvg">Batting Average</Label>
                    <Input
                      id="battingAvg"
                      name="battingAvg"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPlayer.battingAvg}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stats.strikeRate">Strike Rate</Label>
                    <Input
                      id="stats.strikeRate"
                      name="stats.strikeRate"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPlayer.stats.strikeRate}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              
              {(newPlayer.role === "Bowler" || newPlayer.role === "All-rounder") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="stats.wickets">Wickets</Label>
                    <Input
                      id="stats.wickets"
                      name="stats.wickets"
                      type="number"
                      min="0"
                      value={newPlayer.stats.wickets}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bowlingAvg">Bowling Average</Label>
                    <Input
                      id="bowlingAvg"
                      name="bowlingAvg"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPlayer.bowlingAvg}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stats.economy">Economy</Label>
                    <Input
                      id="stats.economy"
                      name="stats.economy"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPlayer.stats.economy}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Button type="submit">Add Player</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerManagement;

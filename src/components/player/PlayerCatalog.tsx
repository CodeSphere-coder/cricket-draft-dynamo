
import { useState } from "react";
import { useAuction } from "@/context/AuctionContext";
import PlayerCard from "./PlayerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PlayerCatalog = () => {
  const { filteredPlayers, searchPlayers, filterPlayersByRole, sortPlayersByPrice } = useAuction();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchPlayers(query);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Player Catalog</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search players by name, role, or country..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select onValueChange={filterPlayersByRole} defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Batsman">Batsman</SelectItem>
                <SelectItem value="Bowler">Bowler</SelectItem>
                <SelectItem value="All-rounder">All-rounder</SelectItem>
                <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(val) => sortPlayersByPrice(val as 'asc' | 'desc')} defaultValue="desc">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Highest Price</SelectItem>
                <SelectItem value="asc">Lowest Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No players found matching your search criteria.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              setSearchQuery("");
              searchPlayers("");
              filterPlayersByRole("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} {...player} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerCatalog;

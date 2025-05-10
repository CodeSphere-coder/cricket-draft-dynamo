import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Player type
interface Player {
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

// Auction state type
interface AuctionState {
  status: 'idle' | 'in-progress' | 'paused' | 'completed';
  currentPlayer: Player | null;
  currentBid: number;
  currentBidder: string | null;
  timeRemaining: number;
  soldPlayers: { player: Player; amount: number; team: string }[];
  unsoldPlayers: Player[];
}

interface AuctionContextType {
  players: Player[];
  auctionState: AuctionState;
  filteredPlayers: Player[];
  setFilteredPlayers: (players: Player[]) => void;
  startAuction: () => void;
  pauseAuction: () => void;
  resumeAuction: () => void;
  endAuction: () => void;
  nextPlayer: () => void;
  placeBid: (amount: number) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  searchPlayers: (query: string) => void;
  filterPlayersByRole: (role: string) => void;
  sortPlayersByPrice: (order: 'asc' | 'desc') => void;
}

const initialPlayers: Player[] = [
  {
    id: '1',
    name: 'Virat Kohli',
    role: 'Batsman',
    basePrice: 2000000, // 20 lakhs
    country: 'India',
    battingAvg: 58.7,
    stats: {
      matches: 254,
      runs: 12169,
      strikeRate: 92.7,
      highestScore: 183,
      wickets: 4,
      economy: 6.2,
    },
    image: '/lovable-uploads/c3ce43e5-c117-4243-a8e7-ba3202987f7e.png',
  },
  {
    id: '2',
    name: 'Jasprit Bumrah',
    role: 'Bowler',
    basePrice: 1500000,
    country: 'India',
    bowlingAvg: 21.6,
    stats: {
      matches: 128,
      wickets: 142,
      economy: 4.6,
      bestBowling: '6/19',
      runs: 342,
      strikeRate: 84.3,
    },
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Ben Stokes',
    role: 'All-rounder',
    basePrice: 1800000,
    country: 'England',
    battingAvg: 38.2,
    bowlingAvg: 31.5,
    stats: {
      matches: 152,
      runs: 3159,
      wickets: 74,
      strikeRate: 95.1,
      economy: 6.1,
      highestScore: 102,
      bestBowling: '5/61',
    },
    image: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Kane Williamson',
    role: 'Batsman',
    basePrice: 1700000,
    country: 'New Zealand',
    battingAvg: 47.8,
    stats: {
      matches: 157,
      runs: 6173,
      strikeRate: 81.3,
      highestScore: 148,
      wickets: 3,
      economy: 5.8,
    },
    image: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Rashid Khan',
    role: 'Bowler',
    basePrice: 1600000,
    country: 'Afghanistan',
    bowlingAvg: 18.7,
    stats: {
      matches: 87,
      wickets: 162,
      economy: 4.2,
      bestBowling: '7/18',
      runs: 874,
      strikeRate: 103.2,
    },
    image: '/placeholder.svg',
  }
];

const initialAuctionState: AuctionState = {
  status: 'idle',
  currentPlayer: null,
  currentBid: 0,
  currentBidder: null,
  timeRemaining: 90, // 1 minute 30 seconds
  soldPlayers: [],
  unsoldPlayers: []
};

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export function AuctionProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(initialPlayers);
  const [auctionState, setAuctionState] = useState<AuctionState>(initialAuctionState);
  const { toast } = useToast();
  const { user, updateUserBudget } = useAuth();
  
  // Timer interval reference
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  const startAuction = useCallback(() => {
    if (players.length === 0) {
      toast({
        title: "No players available",
        description: "Add players before starting the auction",
        variant: "destructive"
      });
      return;
    }
    
    // Select first player
    const firstPlayer = players[0];
    
    setAuctionState({
      ...initialAuctionState,
      status: 'in-progress',
      currentPlayer: firstPlayer,
      currentBid: firstPlayer.basePrice,
      timeRemaining: 90
    });
    
    // Start timer
    const interval = setInterval(() => {
      setAuctionState(prevState => {
        if (prevState.timeRemaining <= 1) {
          clearInterval(interval);
          
          // Auto-sell player when timer ends
          if (prevState.currentBidder) {
            // Player sold
            const soldPlayer = {
              player: prevState.currentPlayer!,
              amount: prevState.currentBid,
              team: prevState.currentBidder
            };
            
            toast({
              title: "Player Sold!",
              description: `${prevState.currentPlayer?.name} sold to ${prevState.currentBidder} for ₹${(prevState.currentBid / 100000).toFixed(1)}L`,
            });
            
            // Deduct the amount from the team's budget
            if (user && user.teamName === prevState.currentBidder) {
              updateUserBudget(user.budget! - prevState.currentBid);
            }
            
            return {
              ...prevState,
              status: 'paused',
              soldPlayers: [...prevState.soldPlayers, soldPlayer],
              timeRemaining: 0
            };
          } else {
            // Player unsold
            toast({
              title: "Player Unsold",
              description: `No bids for ${prevState.currentPlayer?.name}`,
              variant: "destructive"
            });
            
            return {
              ...prevState,
              status: 'paused',
              unsoldPlayers: [...prevState.unsoldPlayers, prevState.currentPlayer!],
              timeRemaining: 0
            };
          }
        }
        
        return {
          ...prevState,
          timeRemaining: prevState.timeRemaining - 1
        };
      });
    }, 1000);
    
    setTimerInterval(interval);
  }, [players, toast]);
  
  const pauseAuction = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setAuctionState(prev => ({
      ...prev,
      status: 'paused'
    }));
  }, [timerInterval]);
  
  const resumeAuction = useCallback(() => {
    if (auctionState.status !== 'paused') return;
    
    setAuctionState(prev => ({
      ...prev,
      status: 'in-progress'
    }));
    
    const interval = setInterval(() => {
      setAuctionState(prevState => {
        if (prevState.timeRemaining <= 1) {
          clearInterval(interval);
          
          // Auto-sell player when timer ends
          if (prevState.currentBidder) {
            // Player sold
            const soldPlayer = {
              player: prevState.currentPlayer!,
              amount: prevState.currentBid,
              team: prevState.currentBidder
            };
            
            toast({
              title: "Player Sold!",
              description: `${prevState.currentPlayer?.name} sold to ${prevState.currentBidder} for ₹${(prevState.currentBid / 100000).toFixed(1)}L`,
            });
            
            // Deduct the amount from the team's budget
            if (user && user.teamName === prevState.currentBidder) {
              updateUserBudget(user.budget! - prevState.currentBid);
            }
            
            return {
              ...prevState,
              status: 'paused',
              soldPlayers: [...prevState.soldPlayers, soldPlayer],
              timeRemaining: 0
            };
          } else {
            // Player unsold
            toast({
              title: "Player Unsold",
              description: `No bids for ${prevState.currentPlayer?.name}`,
              variant: "destructive"
            });
            
            return {
              ...prevState,
              status: 'paused',
              unsoldPlayers: [...prevState.unsoldPlayers, prevState.currentPlayer!],
              timeRemaining: 0
            };
          }
        }
        
        return {
          ...prevState,
          timeRemaining: prevState.timeRemaining - 1
        };
      });
    }, 1000);
    
    setTimerInterval(interval);
  }, [auctionState.status, timerInterval, toast]);
  
  const endAuction = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setAuctionState({
      ...initialAuctionState,
      soldPlayers: auctionState.soldPlayers,
      unsoldPlayers: auctionState.unsoldPlayers,
      status: 'completed'
    });
    
    toast({
      title: "Auction Completed",
      description: `${auctionState.soldPlayers.length} players sold, ${auctionState.unsoldPlayers.length} players unsold`,
    });
  }, [timerInterval, auctionState.soldPlayers, auctionState.unsoldPlayers, toast]);
  
  const nextPlayer = useCallback(() => {
    // First, clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Get remaining available players
    const availablePlayers = players.filter(player => 
      !auctionState.soldPlayers.some(sold => sold.player.id === player.id) && 
      !auctionState.unsoldPlayers.some(unsold => unsold.id === player.id)
    );
    
    if (availablePlayers.length === 0) {
      toast({
        title: "Auction Complete",
        description: "All players have been auctioned",
      });
      
      endAuction();
      return;
    }
    
    // Pick next player
    const nextPlayer = availablePlayers[0];
    
    setAuctionState(prev => ({
      ...prev,
      currentPlayer: nextPlayer,
      currentBid: nextPlayer.basePrice,
      currentBidder: null,
      timeRemaining: 90,
      status: 'in-progress'
    }));
    
    // Start timer for next player
    const interval = setInterval(() => {
      setAuctionState(prevState => {
        if (prevState.timeRemaining <= 1) {
          clearInterval(interval);
          
          // Auto-sell player when timer ends
          if (prevState.currentBidder) {
            // Player sold
            const soldPlayer = {
              player: prevState.currentPlayer!,
              amount: prevState.currentBid,
              team: prevState.currentBidder
            };
            
            toast({
              title: "Player Sold!",
              description: `${prevState.currentPlayer?.name} sold to ${prevState.currentBidder} for ₹${(prevState.currentBid / 100000).toFixed(1)}L`,
            });
            
            // Deduct the amount from the team's budget
            if (user && user.teamName === prevState.currentBidder) {
              updateUserBudget(user.budget! - prevState.currentBid);
            }
            
            return {
              ...prevState,
              status: 'paused',
              soldPlayers: [...prevState.soldPlayers, soldPlayer],
              timeRemaining: 0
            };
          } else {
            // Player unsold
            toast({
              title: "Player Unsold",
              description: `No bids for ${prevState.currentPlayer?.name}`,
              variant: "destructive"
            });
            
            return {
              ...prevState,
              status: 'paused',
              unsoldPlayers: [...prevState.unsoldPlayers, prevState.currentPlayer!],
              timeRemaining: 0
            };
          }
        }
        
        return {
          ...prevState,
          timeRemaining: prevState.timeRemaining - 1
        };
      });
    }, 1000);
    
    setTimerInterval(interval);
  }, [players, auctionState, endAuction, timerInterval, toast, user, updateUserBudget]);
  
  const placeBid = useCallback((amount: number) => {
    if (!user || user.role !== 'team-owner' || !user.budget) {
      toast({
        title: "Bid Failed",
        description: "You don't have permission to place bids",
        variant: "destructive"
      });
      return;
    }
    
    if (user.budget < amount) {
      toast({
        title: "Insufficient Budget",
        description: `Your budget (₹${(user.budget / 100000).toFixed(1)}L) is less than bid amount`,
        variant: "destructive"
      });
      return;
    }
    
    if (auctionState.status !== 'in-progress') {
      toast({
        title: "Cannot Place Bid",
        description: "Auction is not in progress",
        variant: "destructive"
      });
      return;
    }
    
    // Reset timer to 30 seconds on new bid
    setAuctionState(prev => ({
      ...prev,
      currentBid: amount,
      currentBidder: user.teamName || user.name,
      timeRemaining: Math.max(30, prev.timeRemaining)
    }));
    
    toast({
      title: "Bid Placed",
      description: `${user.teamName || user.name} bid ₹${(amount / 100000).toFixed(1)}L for ${auctionState.currentPlayer?.name}`,
    });
  }, [user, auctionState.status, auctionState.currentPlayer, toast]);
  
  const addPlayer = useCallback((player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    setFilteredPlayers(prev => [...prev, newPlayer]);
    
    toast({
      title: "Player Added",
      description: `${player.name} added to auction catalog`,
    });
  }, [toast]);
  
  const searchPlayers = useCallback((query: string) => {
    if (!query) {
      setFilteredPlayers(players);
      return;
    }
    
    const results = players.filter(player => 
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      player.role.toLowerCase().includes(query.toLowerCase()) ||
      player.country.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredPlayers(results);
  }, [players]);
  
  const filterPlayersByRole = useCallback((role: string) => {
    if (!role || role === 'all') {
      setFilteredPlayers(players);
      return;
    }
    
    const results = players.filter(player => 
      player.role.toLowerCase() === role.toLowerCase()
    );
    
    setFilteredPlayers(results);
  }, [players]);
  
  const sortPlayersByPrice = useCallback((order: 'asc' | 'desc') => {
    const sorted = [...filteredPlayers].sort((a, b) => {
      if (order === 'asc') {
        return a.basePrice - b.basePrice;
      } else {
        return b.basePrice - a.basePrice;
      }
    });
    
    setFilteredPlayers(sorted);
  }, [filteredPlayers]);
  
  const value = {
    players,
    auctionState,
    filteredPlayers,
    setFilteredPlayers,
    startAuction,
    pauseAuction,
    resumeAuction,
    endAuction,
    nextPlayer,
    placeBid,
    addPlayer,
    searchPlayers,
    filterPlayersByRole,
    sortPlayersByPrice,
  };

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

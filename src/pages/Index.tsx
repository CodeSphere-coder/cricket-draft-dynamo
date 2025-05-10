
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cricket-purple to-cricket-blue py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Cricket Auction Simulator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Experience the thrill of cricket auctions with real-time bidding, player stats, and team management.
            </p>
            <div className="flex flex-wrap gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-cricket-orange hover:bg-orange-600 text-white">
                      Join Now
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-cricket-purple">
                      Login
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/auction">
                  <Button size="lg" className="bg-cricket-orange hover:bg-orange-600 text-white">
                    Go to Auction
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-cricket-purple/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cricket-purple">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Auction</h3>
              <p className="text-gray-600">Experience authentic auction dynamics with a 90-second bidding timer and automatic bid increments.</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-cricket-blue/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cricket-blue">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">Register as a team owner, manage your budget, and build your dream cricket squad.</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-cricket-orange/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cricket-orange">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Player Stats</h3>
              <p className="text-gray-600">Browse detailed player statistics to make informed bidding decisions for your team.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-full bg-cricket-purple text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Register & Create Your Team</h3>
                <p className="text-gray-600">Sign up as a team owner or player. Team owners receive a budget for bidding in auctions.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-full bg-cricket-blue text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse Player Catalog</h3>
                <p className="text-gray-600">Explore available players, search by name or role, and analyze their statistics.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-full bg-cricket-orange text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Participate in Live Auction</h3>
                <p className="text-gray-600">Join real-time auctions, place bids within your budget, and compete with other team owners.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-full bg-cricket-green text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Build Your Dream Team</h3>
                <p className="text-gray-600">Successfully bid on players to add them to your team and create your ultimate cricket squad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Bidding?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our cricket auction platform and experience the thrill of building your dream team.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-cricket-purple hover:bg-purple-700">
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auction">
                <Button size="lg" className="bg-cricket-purple hover:bg-purple-700">
                  Go to Auction
                </Button>
              </Link>
              <Link to="/players">
                <Button variant="outline" size="lg">
                  View Players
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-full cricket-gradient flex items-center justify-center mr-2">
                <span className="font-bold">CA</span>
              </div>
              <span className="text-xl font-bold">Cricket Auction</span>
            </div>
            
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Cricket Auction Simulator. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

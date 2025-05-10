
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full cricket-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">CA</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cricket-purple to-cricket-orange text-transparent bg-clip-text">
                Cricket Auction
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/players" className="text-gray-700 hover:text-cricket-purple">
              Players
            </Link>
            <Link to="/auction" className="text-gray-700 hover:text-cricket-purple">
              Auction
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-cricket-purple">
                Admin
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <div className="text-sm text-gray-600">
                    Signed in as <span className="font-medium text-cricket-purple">{user?.name}</span>
                  </div>
                  {user?.role === 'team-owner' && user?.budget && (
                    <div className="text-xs text-gray-500">
                      Budget: ₹{(user.budget / 100000).toFixed(1)}L
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

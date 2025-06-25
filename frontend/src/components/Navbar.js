import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">🎬 MovieMeter</h2>
      <ul className="nav-links">
        <li><Link to="/">All Movies</Link></li>
        <li><Link to="/top-rated">Top Rated</Link></li>
        <li><Link to="/low-rated">Low Rated</Link></li>
        <li><Link to="/recent">Recent</Link></li>
        <li><Link to="/oldest">Oldest</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/filter">Filter</Link></li>

        {!isLoggedIn ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

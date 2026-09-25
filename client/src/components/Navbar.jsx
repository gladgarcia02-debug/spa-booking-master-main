import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('spa_admin_token'));

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Serenity Spa</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        {isAuthenticated ? (
          <Link to="/admin" state={{ from: location.pathname }}>Dashboard</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
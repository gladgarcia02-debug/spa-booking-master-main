import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Serenity Spa</h1>
      <p>Relax, unwind, and book your next treatment in just a few clicks.</p>
      <Link to="/services" className="btn btn-primary">
        View Services
      </Link>
    </div>
  );
}

export default Home;
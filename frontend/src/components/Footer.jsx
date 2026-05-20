import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>STALCRAFT Wiki</strong>
        <p>Учебный fullstack-проект: React, Spring Boot, PostgreSQL.</p>
      </div>

      <div className="footer-links">
        <Link to="/">Главная</Link>
        <Link to="/wiki">Wiki</Link>
        <Link to="/items">Предметы</Link>
        <Link to="/forum">Форум</Link>

      </div>
    </footer>
  );
}
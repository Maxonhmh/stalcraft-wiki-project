import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="logo">
        STALCRAFT Wiki
      </Link>

      <nav className="nav">
        <div className="nav-dropdown">
          <button className="nav-link dropdown-button">Wiki</button>

          <div className="dropdown-menu">
            <Link to="/" className="dropdown-link">
              Главная
            </Link>
            <Link to="/wiki" className="dropdown-link">
              Статьи
            </Link>
            <Link to="/items" className="dropdown-link">
              Предметы
            </Link>
            <Link to="/quests" className="dropdown-link">
              Квесты
            </Link>
          </div>
        </div>

        <Link to="/forum" className="nav-link">
          Форум
        </Link>


      </nav>
    </header>
  );
}
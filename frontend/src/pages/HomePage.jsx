import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>STALCRAFT Wiki</h1>
        <p>
          Вики-приложение по игре STALCRAFT с базой знаний, предметами,
          статьями и анонимным форумом в реальном времени.
        </p>

        <div className="hero-actions">
          <Link to="/wiki" className="button">
            Перейти к Wiki
          </Link>
          <Link to="/forum" className="button secondary">
            Открыть форум
          </Link>
        </div>
      </div>

      <div className="cards-grid">
        <Link to="/wiki" className="card">
          <h2>Статьи</h2>
          <p>Материалы, гайды и описания игровых механик.</p>
        </Link>

        <Link to="/items" className="card">
          <h2>Предметы</h2>
          <p>База игровых предметов, характеристик и иконок.</p>
        </Link>

        <Link to="/quests" className="card">
          <h2>Квесты</h2>
          <p>Раздел для будущего описания заданий и прохождений.</p>
        </Link>

        <Link to="/forum" className="card">
          <h2>Анонимный форум</h2>
          <p>Общение без регистрации с доставкой сообщений через WebSocket.</p>
        </Link>
      </div>
    </section>
  );
}
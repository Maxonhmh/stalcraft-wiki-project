import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import {
  getMainCategory,
  getRankInfo,
  getRankOrder,
  getSubCategory,
  translateFullCategory,
  translateMainCategory,
  translateSubCategory,
} from "../utils/itemUtils";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/items");
      setItems(response.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить предметы");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const mainCategories = useMemo(() => {
    return Array.from(new Set(items.map((item) => getMainCategory(item.category))))
      .filter(Boolean)
      .sort();
  }, [items]);

  const subCategories = useMemo(() => {
    if (!selectedMainCategory) {
      return [];
    }

    return Array.from(
      new Set(
        items
          .filter((item) => getMainCategory(item.category) === selectedMainCategory)
          .map((item) => getSubCategory(item.category))
          .filter(Boolean)
      )
    ).sort();
  }, [items, selectedMainCategory]);

const filteredItems = useMemo(() => {
  return items
    .filter((item) => {
      const main = getMainCategory(item.category);
      const sub = getSubCategory(item.category);

      const matchesMain = !selectedMainCategory || main === selectedMainCategory;
      const matchesSub = !selectedSubCategory || sub === selectedSubCategory;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        item.nameRu.toLowerCase().includes(query) ||
        item.gameId.toLowerCase().includes(query);

      return matchesMain && matchesSub && matchesSearch;
    })
    .sort((a, b) => {
      const rankDiff = getRankOrder(a.rankOrColor) - getRankOrder(b.rankOrColor);

      if (rankDiff !== 0) {
        return rankDiff;
      }

      return a.nameRu.localeCompare(b.nameRu, "ru");
    });
}, [items, selectedMainCategory, selectedSubCategory, search]);

  function handleMainCategoryChange(event) {
    setSelectedMainCategory(event.target.value);
    setSelectedSubCategory("");
  }

  if (loading) {
    return <section className="page">Загрузка предметов...</section>;
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Предметы STALCRAFT</h1>
          <p>Предметы загружаются из базы EXBO-Studio/stalcraft-database.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="items-controls">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по названию или ID..."
        />

        <select value={selectedMainCategory} onChange={handleMainCategoryChange}>
          <option value="">Все основные категории</option>

          {mainCategories.map((category) => (
            <option key={category} value={category}>
              {translateMainCategory(category)}
            </option>
          ))}
        </select>

        <select
          value={selectedSubCategory}
          onChange={(event) => setSelectedSubCategory(event.target.value)}
          disabled={!selectedMainCategory || subCategories.length === 0}
        >
          <option value="">Все подкатегории</option>

          {subCategories.map((category) => (
            <option key={category} value={category}>
              {translateSubCategory(category)}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <p className="muted">
          Предметы ещё не загружены. Нажми "Обновить предметы" в админ-панели.
        </p>
      ) : (
        <>
          <p className="muted">Найдено предметов: {filteredItems.length}</p>

          <div className="items-grid">
            {filteredItems.map((item) => {
              const rank = getRankInfo(item.rankOrColor);

              return (
                <Link
                    key={item.id}
                    to={`/items/${item.id}`}
                    className={`item-card ${rank.className}`}
                    >
                  <div className={`item-rank-line ${rank.className}`}>
                    {rank.label}
                  </div>

                  <div className="item-icon-wrap">
                    {item.iconUrl ? (
                      <img src={item.iconUrl} alt={item.nameRu} />
                    ) : (
                      <span>Нет иконки</span>
                    )}
                  </div>

                  <div>
                    <h2>{item.nameRu}</h2>
                    <p>{translateFullCategory(item.category)}</p>
                    <small>ID: {item.gameId}</small>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
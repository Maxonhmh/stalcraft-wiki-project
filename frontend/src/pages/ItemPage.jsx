import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "../api/client";
import {
  extractDescription,
  extractItemFeatures,
  extractKnownCharacteristics,
  getRankInfo,
  hasUpgradeVariants,
  normalizeUpgradeLevel,
  parseRawJson,
  translateFullCategory,
} from "../utils/itemUtils";

export default function ItemPage() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [upgradeLevel, setUpgradeLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  
  async function loadItem() {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get(`/items/${id}`);
      setItem(response.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить предмет");
    } finally {
      setLoading(false);
    }
  }

  function changeUpgradeLevel(nextValue) {
    setUpgradeLevel(normalizeUpgradeLevel(nextValue));
  }

  function decreaseUpgradeLevel() {
    changeUpgradeLevel(upgradeLevel - 1);
  }

  function increaseUpgradeLevel() {
    changeUpgradeLevel(upgradeLevel + 1);
  }

  useEffect(() => {
    loadItem();
  }, [id]);

  const raw = useMemo(() => parseRawJson(item?.rawJson), [item]);
console.log("RAW ITEM", raw);
console.log("RAW VARIANTS", raw?._variants, raw?.variants, raw?.upgrades);
  const description = useMemo(() => {
    return extractDescription(raw);
  }, [raw]);

  const characteristics = useMemo(() => {
    return extractKnownCharacteristics(raw, upgradeLevel);
  }, [raw, upgradeLevel]);

  const features = useMemo(() => {
    return extractItemFeatures(raw);
  }, [raw]);

  const itemHasVariants = useMemo(() => {
    return hasUpgradeVariants(raw);
  }, [raw]);

  if (loading) {
    return <section className="page">Загрузка предмета...</section>;
  }

  if (error) {
    return <section className="page error">{error}</section>;
  }

  if (!item) {
    return <section className="page">Предмет не найден.</section>;
  }

  const rank = getRankInfo(item.rankOrColor);

  return (
    <section className="page item-detail-page">
      <Link to="/items" className="back-link">
        ← Назад к предметам
      </Link>

      <div className="item-detail-hero">
        <div className={`item-detail-icon ${rank.className}`}>
          {item.iconUrl ? (
            <img src={item.iconUrl} alt={item.nameRu} />
          ) : (
            <span>Нет иконки</span>
          )}
        </div>

        <div>
          <div className={`item-rank-pill ${rank.className}`}>
            {rank.label}
          </div>

          <h1>{item.nameRu}</h1>

          <p className="muted">{translateFullCategory(item.category)}</p>
          <p className="muted">ID: {item.gameId}</p>
        </div>
      </div>

      <div className="item-detail-grid">
        <section className="item-detail-panel">
          <h2>Описание</h2>

          {description ? (
            <p className="item-description">{description}</p>
          ) : (
            <p className="muted">Описание для этого предмета не найдено.</p>
          )}

          {features.length > 0 && (
            <div className="item-features">
              <h2>Особенности</h2>

              <ul>
                {features.map((feature, index) => (
                  <li key={`${feature}-${index}`}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="item-detail-panel">
          <div className="characteristics-header">
            <h2>Характеристики</h2>

            {(itemHasVariants ||
            item.category.startsWith("armor") ||
            item.category.startsWith("weapon")) && (
            <div className="upgrade-control">


                <button
                type="button"
                onClick={decreaseUpgradeLevel}
                disabled={!itemHasVariants}
                >
                −
                </button>

                <input
                value={upgradeLevel}
                onChange={(event) => changeUpgradeLevel(event.target.value)}
                disabled={!itemHasVariants}
                />

                <button
                type="button"
                onClick={increaseUpgradeLevel}
                disabled={!itemHasVariants}
                >
                +
                </button>
            </div>
            )}


    {!itemHasVariants &&
    (item.category.startsWith("armor") || item.category.startsWith("weapon")) && (
        <p className="muted">
        Данные уровней улучшения для этого предмета не найдены в импортированной базе.
        </p>
    )}
            </div>

            {characteristics.length === 0 ? (
                <p className="muted">Характеристики не найдены.</p>
            ) : (
                <div className="characteristics-list">
                {characteristics.map((characteristic) => (
                    <div key={characteristic.key} className="characteristic-row">
                    <span>{characteristic.label}</span>
                    <strong>{characteristic.value}</strong>
                    </div>
                ))}
                </div>
            )}
            </section>
        </div>
        </section>
    );
}
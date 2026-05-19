import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

function getContentPreview(content) {
  try {
    const blocks = JSON.parse(content);

    if (!Array.isArray(blocks)) {
      return content || "";
    }

    return blocks
      .filter((block) => block.type === "text")
      .map((block) => block.value || "")
      .join(" ")
      .trim();
  } catch {
    return content || "";
  }
}

export default function QuestsPage() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuests() {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/quests");

      setQuests(response.data.filter((quest) => quest.published));
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить квесты");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuests();
  }, []);

  if (loading) {
    return <section className="page">Загрузка квестов...</section>;
  }

  return (
    <section className="page">
        <div className="page-header">
            <div>
            <h1>Квесты</h1>
            <p>Гайды и прохождения заданий STALCRAFT.</p>
            </div>
        </div>

      {error && <p className="error">{error}</p>}

      {quests.length === 0 ? (
        <p className="muted">Квестов пока нет.</p>
      ) : (
        <div className="list quest-list">
          {quests.map((quest) => {
            const preview = getContentPreview(quest.content);

            return (
              <Link
                key={quest.id}
                to={`/quests/${quest.slug}`}
                className="list-item quest-list-item"
              >
                <h2>{quest.title}</h2>
                <span className="quest-badge">Квест</span>
                {preview && (
                  <p>
                    {preview.length > 180
                      ? `${preview.slice(0, 180)}...`
                      : preview}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
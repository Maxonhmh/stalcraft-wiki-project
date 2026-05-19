import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

function getArticlePreview(content) {
  try {
    const blocks = JSON.parse(content);

    if (!Array.isArray(blocks)) {
      return content;
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

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadArticles() {
    try {
      setLoading(true);

      const response = await apiClient.get("/articles");

      setArticles(response.data.filter((article) => article.published));
    } catch (err) {
      setError("Не удалось загрузить статьи");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  if (loading) {
    return <section className="page">Загрузка статей...</section>;
  }

  return (
    <section className="page">
      <h1>Wiki статьи</h1>

      {error && <p className="error">{error}</p>}

      {articles.length === 0 ? (
        <p>Статей пока нет.</p>
      ) : (
        <div className="list">
          {articles.map((article) => {
            const preview = getArticlePreview(article.content);

            return (
              <Link
                key={article.id}
                to={`/wiki/${article.slug}`}
                className="list-item"
              >
                <h2>{article.title}</h2>

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
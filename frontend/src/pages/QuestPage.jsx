import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import ArticleContent from "../components/ArticleContent";

export default function QuestPage() {

  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { slug } = useParams();

  async function loadQuest() {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get(`/quests/slug/${slug}`);
      setQuest(response.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить квест");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuest();
  }, [slug]);

  if (loading) {
    return <section className="page">Загрузка квеста...</section>;
  }

  if (error) {
    return <section className="page error">{error}</section>;
  }

  if (!quest) {
    return <section className="page">Квест не найден.</section>;
  }

  return (
    <article className="page article-page">
      <h1>{quest.title}</h1>

        <div className="article-meta">
            <span>Квест</span>
        </div>

      <ArticleContent content={quest.content} />
    </article>
  );
}
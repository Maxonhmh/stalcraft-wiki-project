import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import ArticleContent from "../components/ArticleContent";

export default function ArticlePage() {

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    const { slug } = useParams();

    async function loadArticle() {
    try {
        setLoading(true);
        setError("");

        const response = await apiClient.get(`/articles/slug/${slug}`);
        setArticle(response.data);
    } catch (err) {
        console.error(err);
        setError("Не удалось загрузить статью");
    } finally {
        setLoading(false);
    }
    }

    useEffect(() => {
    loadArticle();
    }, [slug]);

  if (loading) {
    return <section className="page">Загрузка статьи...</section>;
  }

  if (error) {
    return <section className="page error">{error}</section>;
  }

  if (!article) {
    return <section className="page">Статья не найдена.</section>;
  }

    return (
    <article className="page article-page">
        <h1>{article.title}</h1>

        <div className="article-meta">
            <span>Wiki статья</span>
        </div>

        <ArticleContent content={article.content} />
    </article>
    );
}
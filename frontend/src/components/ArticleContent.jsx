function parseArticleContent(content) {
  try {
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export default function ArticleContent({ content }) {
  const blocks = parseArticleContent(content);

  if (!blocks) {
    return <p className="article-text">{content}</p>;
  }

  return (
    <div className="article-content">
      {blocks.map((block, index) => {
        if (block.type === "text") {
          if (!block.value?.trim()) {
            return null;
          }

          return (
            <p key={index} className="article-text">
              {block.value}
            </p>
          );
        }

        if (block.type === "image") {
          if (!block.value?.trim()) {
            return null;
          }

          return (
            <figure key={index} className="article-image-block">
              <img src={block.value} alt={block.caption || "Article image"} />

              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}
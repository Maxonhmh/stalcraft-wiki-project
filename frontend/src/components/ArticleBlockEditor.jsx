import { apiClient } from "../api/client";

export default function ArticleBlockEditor({ blocks, onChange }) {
  function updateBlock(index, field, value) {
    onChange((prevBlocks) =>
      prevBlocks.map((block, blockIndex) => {
        if (blockIndex !== index) {
          return block;
        }

        return {
          ...block,
          [field]: value,
        };
      })
    );
  }

  function addTextBlock() {
    onChange((prevBlocks) => [
      ...prevBlocks,
      {
        type: "text",
        value: "",
      },
    ]);
  }

  function addImageBlock() {
    onChange((prevBlocks) => [
      ...prevBlocks,
      {
        type: "image",
        value: "",
        caption: "",
        uploading: false,
      },
    ]);
  }

  function removeBlock(index) {
    onChange((prevBlocks) =>
      prevBlocks.filter((_, blockIndex) => blockIndex !== index)
    );
  }

  function moveBlockUp(index) {
    if (index === 0) {
      return;
    }

    onChange((prevBlocks) => {
      const nextBlocks = [...prevBlocks];
      const temp = nextBlocks[index - 1];

      nextBlocks[index - 1] = nextBlocks[index];
      nextBlocks[index] = temp;

      return nextBlocks;
    });
  }

  function moveBlockDown(index) {
    onChange((prevBlocks) => {
      if (index === prevBlocks.length - 1) {
        return prevBlocks;
      }

      const nextBlocks = [...prevBlocks];
      const temp = nextBlocks[index + 1];

      nextBlocks[index + 1] = nextBlocks[index];
      nextBlocks[index] = temp;

      return nextBlocks;
    });
  }

  async function uploadImage(index, file) {
    if (!file) {
      return;
    }

    try {
      updateBlock(index, "uploading", true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/uploads/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateBlock(index, "value", response.data.url);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Не удалось загрузить картинку");
    } finally {
      updateBlock(index, "uploading", false);
    }
  }

  return (
    <div className="block-editor">
      <div className="block-editor-actions">
        <button type="button" onClick={addTextBlock}>
          + Текст
        </button>

        <button type="button" onClick={addImageBlock}>
          + Картинка
        </button>
      </div>

      {blocks.length === 0 ? (
        <p className="muted">Добавь первый блок статьи.</p>
      ) : (
        <div className="article-blocks-list">
          {blocks.map((block, index) => (
            <div key={index} className="editor-block">
              <div className="editor-block-header">
                <strong>
                  {block.type === "text" ? "Текстовый блок" : "Картинка"}
                </strong>

                <div className="editor-block-actions">
                  <button type="button" onClick={() => moveBlockUp(index)}>
                    ↑
                  </button>
                  <button type="button" onClick={() => moveBlockDown(index)}>
                    ↓
                  </button>
                  <button type="button" onClick={() => removeBlock(index)}>
                    Удалить
                  </button>
                </div>
              </div>

              {block.type === "text" && (
                <textarea
                  value={block.value}
                  onChange={(event) =>
                    updateBlock(index, "value", event.target.value)
                  }
                  placeholder="Напиши текст статьи..."
                />
              )}

              {block.type === "image" && (
                <div className="image-block-fields">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(event) =>
                      uploadImage(index, event.target.files?.[0])
                    }
                  />

                  {block.uploading && <p className="muted">Загрузка...</p>}

                  <input
                    value={block.caption || ""}
                    onChange={(event) =>
                      updateBlock(index, "caption", event.target.value)
                    }
                    placeholder="Подпись к картинке"
                  />

                  {block.value && (
                    <>
                      <input
                        value={block.value}
                        onChange={(event) =>
                          updateBlock(index, "value", event.target.value)
                        }
                        placeholder="URL картинки"
                      />

                      <img
                        src={block.value}
                        alt={block.caption || "Article image preview"}
                        className="editor-image-preview"
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
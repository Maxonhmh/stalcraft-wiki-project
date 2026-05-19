import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import ArticleBlockEditor from "../components/ArticleBlockEditor";
import { useNavigate } from "react-router-dom";
import { getAdminUser, logoutAdmin } from "../auth/adminAuth";

export default function AdminPage() {

    const navigate = useNavigate();
    const adminUser = getAdminUser();

    function logout() {
    logoutAdmin();
    navigate("/admin/login");
    }
  const [articles, setArticles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [topics, setTopics] = useState([]);
  const [bans, setBans] = useState([]);

  const [itemsImporting, setItemsImporting] = useState(false);
  const [itemsImportResult, setItemsImportResult] = useState(null);

  const [quests, setQuests] = useState([]);

    const [questForm, setQuestForm] = useState({
    title: "",
    slug: "",
    content: "",
    published: true,
    });

    const [questBlocks, setQuestBlocks] = useState([
    {
        type: "text",
        value: "",
    },
    ]);

    const [editingQuestId, setEditingQuestId] = useState(null);

  const [editingArticleId, setEditingArticleId] = useState(null);
    const [articleForm, setArticleForm] = useState({
    title: "",
    content: "",
    published: true,
    });

  const [articleBlocks, setArticleBlocks] = useState([
  {
    type: "text",
    value: "",
  },
]);
  

  const [topicForm, setTopicForm] = useState({
    title: "",
    description: "",
  });

  const [adminMessageForm, setAdminMessageForm] = useState({
    topicId: "",
    content: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadArticles() {
    const response = await apiClient.get("/articles");
    setArticles(response.data);
  }

    async function loadQuests() {
    const response = await apiClient.get("/quests");
    setQuests(response.data);
    }

  async function loadMessages() {
    const response = await apiClient.get("/forum/messages");
    setMessages(response.data);
  }

  async function loadTopics() {
    const response = await apiClient.get("/admin/forum/topics");
    setTopics(response.data);
  }

  async function loadBans() {
    const response = await apiClient.get("/admin/forum/bans");
    setBans(response.data);
  }

  async function loadData() {
    try {
      setError("");
      await Promise.all([
        loadArticles(),
        loadQuests(),
        loadMessages(),
        loadTopics(),
        loadBans(),
      ]);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить данные админ-панели");
    }
  }

  useEffect(() => {
    loadData();
  }, []);


async function importItems() {
  try {
    setError("");
    setSuccess("");
    setItemsImporting(true);
    setItemsImportResult(null);

    const response = await apiClient.post("/admin/items/import");

    setItemsImportResult(response.data);
    setSuccess(`Предметы обновлены: ${response.data.importedCount}`);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Не удалось обновить предметы");
  } finally {
    setItemsImporting(false);
  }
}

function parseArticleBlocks(content) {
  try {
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [
      {
        type: "text",
        value: content || "",
      },
    ];
  } catch {
    return [
      {
        type: "text",
        value: content || "",
      },
    ];
  }
}

function startEditQuest(quest) {
  setEditingQuestId(quest.id);

  setQuestForm({
    title: quest.title,
    slug: quest.slug,
    content: quest.content,
    published: quest.published,
  });

  setQuestBlocks(parseArticleBlocks(quest.content));

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function cancelEditQuest() {
  setEditingQuestId(null);

  setQuestForm({
    title: "",
    slug: "",
    content: "",
    published: true,
  });

  setQuestBlocks([
    {
      type: "text",
      value: "",
    },
  ]);
}

async function saveQuest(event) {
  event.preventDefault();

  try {
    setError("");
    setSuccess("");

    const payload = {
      ...questForm,
      content: JSON.stringify(questBlocks),
    };

    if (editingQuestId) {
      await apiClient.put(`/quests/${editingQuestId}`, payload);
      setSuccess("Квест обновлён");
    } else {
      await apiClient.post("/quests", payload);
      setSuccess("Квест создан");
    }

    setEditingQuestId(null);

    setQuestForm({
      title: "",
      slug: "",
      content: "",
      published: true,
    });

    setQuestBlocks([
      {
        type: "text",
        value: "",
      },
    ]);

    await loadQuests();
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message ||
        (editingQuestId ? "Не удалось обновить квест" : "Не удалось создать квест")
    );
  }
}

async function deleteQuest(id) {
  try {
    setError("");
    setSuccess("");

    await apiClient.delete(`/quests/${id}`);

    setSuccess("Квест удалён");
    await loadQuests();
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Не удалось удалить квест");
  }
}

function startEditArticle(article) {
  setEditingArticleId(article.id);

  setArticleForm({
    title: article.title,
    content: article.content,
    published: article.published,
  });

  setArticleBlocks(parseArticleBlocks(article.content));

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function cancelEditArticle() {
  setEditingArticleId(null);

  setArticleForm({
    title: "",
    slug: "",
    content: "",
    published: true,
  });

  setArticleBlocks([
    {
      type: "text",
      value: "",
    },
  ]);
}

  function handleArticleChange(event) {
    const { name, value, type, checked } = event.target;

    setArticleForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

    function handleQuestChange(event) {
    const { name, value, type, checked } = event.target;

    setQuestForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
    }));
    }

  function handleTopicChange(event) {
    const { name, value } = event.target;

    setTopicForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAdminMessageChange(event) {
    const { name, value } = event.target;

    setAdminMessageForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

    async function sendAdminForumMessage(event) {
    event.preventDefault();

    try {
        setError("");
        setSuccess("");

        await apiClient.post("/admin/forum/messages", {
        topicId: adminMessageForm.topicId || null,
        content: adminMessageForm.content,
        });

        setSuccess(
        adminMessageForm.topicId
            ? "Сообщение администратора отправлено в выбранную тему"
            : "Сообщение администратора отправлено во все темы"
        );

        setAdminMessageForm({
        topicId: "",
        content: "",
        });

        await loadMessages();
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Не удалось отправить сообщение администратора");
    }
    }


async function saveArticle(event) {
  event.preventDefault();

  try {
    setError("");
    setSuccess("");

    const payload = {
      ...articleForm,
      content: JSON.stringify(articleBlocks),
    };

    if (editingArticleId) {
      await apiClient.put(`/articles/${editingArticleId}`, payload);
      setSuccess("Статья обновлена");
    } else {
      await apiClient.post("/articles", payload);
      setSuccess("Статья создана");
    }

    setEditingArticleId(null);

    setArticleForm({
      title: "",
      slug: "",
      content: "",
      published: true,
    });

    setArticleBlocks([
      {
        type: "text",
        value: "",
      },
    ]);

    await loadArticles();
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message ||
        (editingArticleId
          ? "Не удалось обновить статью"
          : "Не удалось создать статью")
    );
  }
}

  async function createTopic(event) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      await apiClient.post("/forum/topics", topicForm);

      setSuccess("Тема форума создана");

      setTopicForm({
        title: "",
        description: "",
      });

      await loadTopics();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Не удалось создать тему");
    }
  }

  async function createAdminMessage(event) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      await apiClient.post("/admin/forum/messages", {
        topicId: adminMessageForm.topicId || null,
        content: adminMessageForm.content,
      });

      setSuccess("Сообщение администратора отправлено");

      setAdminMessageForm({
        topicId: "",
        content: "",
      });

      await loadMessages();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Не удалось отправить сообщение администратора"
      );
    }
  }

  function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[а-яё]/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  }

  async function deleteArticle(id) {
    try {
      setError("");
      setSuccess("");

      await apiClient.delete(`/articles/${id}`);

      setSuccess("Статья удалена");
      await loadArticles();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Не удалось удалить статью");
    }
  }

  async function deleteMessage(id) {
    try {
      setError("");
      setSuccess("");

      await apiClient.delete(`/forum/messages/${id}`);

      setSuccess("Сообщение удалено");
      await loadMessages();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Не удалось удалить сообщение");
    }
  }

    async function deleteTopic(id) {
        const confirmed = window.confirm(
            "Удалить тему? Все сообщения в этой теме тоже будут удалены."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await apiClient.delete(`/forum/topics/${id}`);

            setSuccess("Тема удалена");
            await loadTopics();
            await loadMessages();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Не удалось удалить тему");
        }
    }

  async function banUser(message) {
    const reason = prompt("Причина блокировки пользователя:");

    if (!reason) {
      return;
    }

    const appealEmail = prompt(
      "Email для обращения по разбану:",
      "admin@example.com"
    );

    if (!appealEmail) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiClient.post("/admin/forum/bans", {
        anonKey: message.anonKey,
        reason,
        appealEmail,
      });

      setSuccess(`Пользователь ${message.nickname} заблокирован`);
      await loadBans();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Не удалось заблокировать пользователя"
      );
    }
  }

  async function unbanUser(id) {
    try {
      setError("");
      setSuccess("");

      await apiClient.delete(`/admin/forum/bans/${id}`);

      setSuccess("Пользователь разбанен");
      await loadBans();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Не удалось разбанить пользователя");
    }
  }

  return (
    <section className="page admin-page">
        <div className="admin-topbar">
        <div>
            <h1>Админ-панель</h1>
            <p className="muted">
            Вы вошли как {adminUser?.username || "admin"}.
            </p>
        </div>

        <button className="secondary-button" onClick={logout}>
            Выйти
        </button>
        </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="admin-grid">
        <section className="admin-panel">
          <h2>{editingArticleId ? "Редактировать статью" : "Создать статью"}</h2>

          <form onSubmit={saveArticle} className="admin-form">
            <label>
              Название
              <input
                name="title"
                value={articleForm.title}
                onChange={handleArticleChange}
                placeholder="Например: Артефакты"
              />
            </label>



            <div className="form-field">
                <span>Контент статьи</span>
                <ArticleBlockEditor blocks={articleBlocks} onChange={setArticleBlocks} />
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="published"
                checked={articleForm.published}
                onChange={handleArticleChange}
              />
              Опубликовано
            </label>

            <div className="form-actions">
                <button type="submit">
                    {editingArticleId ? "Сохранить изменения" : "Создать статью"}
                </button>

                {editingArticleId && (
                    <button type="button" className="secondary-button" onClick={cancelEditArticle}>
                    Отмена
                    </button>
                )}
            </div>
          </form>
        </section>

        <section className="admin-panel">
          <h2>Создать тему форума</h2>

          <form onSubmit={createTopic} className="admin-form">
            <label>
              Название темы
              <input
                name="title"
                value={topicForm.title}
                onChange={handleTopicChange}
                placeholder="Например: Общая тема"
              />
            </label>


            <label>
              Описание
              <textarea
                name="description"
                value={topicForm.description}
                onChange={handleTopicChange}
                placeholder="Описание темы..."
              />
            </label>

            <button type="submit">Создать тему</button>
          </form>
        </section>
      </div>

    <div className="admin-grid">
    <section className="admin-panel">
        <h2>{editingQuestId ? "Редактировать квест" : "Создать квест"}</h2>

        <form onSubmit={saveQuest} className="admin-form">
        <label>
            Название
            <input
            name="title"
            value={questForm.title}
            onChange={handleQuestChange}
            placeholder="Например: Начальный квест"
            />
        </label>



        <div className="form-field">
            <span>Контент квеста</span>
            <ArticleBlockEditor blocks={questBlocks} onChange={setQuestBlocks} />
        </div>

        <label className="checkbox-label">
            <input
            type="checkbox"
            name="published"
            checked={questForm.published}
            onChange={handleQuestChange}
            />
            Опубликовано
        </label>

        <div className="form-actions">
            <button type="submit">
            {editingQuestId ? "Сохранить изменения" : "Создать квест"}
            </button>

            {editingQuestId && (
            <button
                type="button"
                className="secondary-button"
                onClick={cancelEditQuest}
            >
                Отмена
            </button>
            )}
        </div>
        </form>
    </section>

    <section className="admin-panel">
        <h2>Квесты</h2>

        {quests.length === 0 ? (
        <p className="muted">Квестов пока нет.</p>
        ) : (
        <div className="admin-list">
            {quests.map((quest) => (
            <div key={quest.id} className="admin-list-item">
                <div>
                <strong>{quest.title}</strong>
                <p>{quest.slug}</p>
                <small>{quest.published ? "Опубликован" : "Черновик"}</small>
                </div>

                <div className="admin-actions-row">
                <button
                    className="small-button"
                    onClick={() => startEditQuest(quest)}
                >
                    Редактировать
                </button>

                <button
                    className="danger-button"
                    onClick={() => deleteQuest(quest.id)}
                >
                    Удалить
                </button>
                </div>
            </div>
            ))}
        </div>
        )}
    </section>
    </div>

      <div className="admin-grid">
        <section className="admin-panel">
        <h2>Сообщение администратора</h2>

        <p className="muted">
            Можно отправить сообщение в конкретную тему или во все темы сразу.
        </p>

        <form onSubmit={sendAdminForumMessage} className="admin-form">
            <label>
            Тема форума
            <select
                name="topicId"
                value={adminMessageForm.topicId}
                onChange={handleAdminMessageChange}
            >
                <option value="">Все темы</option>

                {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                    {topic.title}
                </option>
                ))}
            </select>
            </label>

            <label>
            Сообщение
            <textarea
                name="content"
                value={adminMessageForm.content}
                onChange={handleAdminMessageChange}
                placeholder="Текст сообщения от администратора..."
            />
            </label>

            <button type="submit">Отправить как администратор</button>
        </form>
        </section>

        <section className="admin-panel">
          <h2>Темы форума</h2>

          {topics.length === 0 ? (
            <p className="muted">Тем пока нет.</p>
          ) : (
            <div className="admin-list">
              {topics.map((topic) => (
                <div key={topic.id} className="admin-list-item">
                  <div>
                    <strong>{topic.title}</strong>
                    {topic.description && <p>{topic.description}</p>}
                  </div>

                  {topic.active && (
                    <button
                    className="danger-button"
                        onClick={() => deleteTopic(topic.id)}
                        >
                        Удалить
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="admin-panel admin-messages">
        <h2>Статьи</h2>

        {articles.length === 0 ? (
          <p className="muted">Статей пока нет.</p>
        ) : (
          <div className="admin-list">
            {articles.map((article) => (
              <div key={article.id} className="admin-list-item">
                <div>
                  <strong>{article.title}</strong>
                  <p>{article.published ? "Опубликована" : "Черновик"}</p>
                </div>

                <div className="admin-actions-row">
                <button
                    className="small-button"
                    onClick={() => startEditArticle(article)}
                >
                    Редактировать
                </button>

                <button
                    className="danger-button"
                    onClick={() => deleteArticle(article.id)}
                >
                    Удалить
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-panel admin-messages">
        <h2>Блокировки форума</h2>

        {bans.length === 0 ? (
          <p className="muted">Блокировок пока нет.</p>
        ) : (
          <div className="admin-list">
            {bans.map((ban) => (
              <div key={ban.id} className="admin-list-item">
                <div>
                  <strong>{ban.nickname}</strong>
                  <p>{ban.reason}</p>
                  <small>
                    {ban.active ? "Активна" : "Снята"} · {ban.appealEmail}
                  </small>
                </div>

                {ban.active && (
                  <button
                    className="danger-button"
                    onClick={() => unbanUser(ban.id)}
                  >
                    Разбанить
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>



      <section className="admin-panel admin-messages">
  <h2>Обновление базы предметов</h2>

  <p className="muted">
    Загружает актуальные данные предметов из EXBO-Studio/stalcraft-database и
    заменяет старые данные в локальной базе.
  </p>

  <button
    className="secondary-button"
    onClick={importItems}
    disabled={itemsImporting}
  >
    {itemsImporting ? "Обновление..." : "Обновить предметы"}
  </button>

  {itemsImportResult && (
    <p className="success">
      Импортировано предметов: {itemsImportResult.importedCount}
    </p>
  )}
</section>

      <section className="admin-panel admin-messages">
        <h2>Модерация форума</h2>

        {messages.length === 0 ? (
          <p className="muted">Сообщений пока нет.</p>
        ) : (
          <div className="admin-list">
            {messages.map((message) => (
              <div key={message.id} className="admin-list-item">
                <div>
                  <strong>
                    {message.nickname} {message.adminMessage && "ADMIN"}
                  </strong>
                  <p>{message.content}</p>
                  <small>{new Date(message.createdAt).toLocaleString()}</small>
                </div>

                <div className="admin-actions-row">
                  <button
                    className="danger-button"
                    onClick={() => deleteMessage(message.id)}
                  >
                    Удалить
                  </button>

                  {!message.adminMessage && (
                    <button
                      className="danger-button"
                      onClick={() => banUser(message)}
                    >
                      Забанить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
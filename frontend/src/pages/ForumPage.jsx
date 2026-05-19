import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { apiClient, WS_URL } from "../api/client";
import { isAdminAuthenticated } from "../auth/adminAuth";


function getAnonKey() {
  let anonKey = localStorage.getItem("anonKey");

  if (!anonKey) {
    anonKey = crypto.randomUUID();
    localStorage.setItem("anonKey", anonKey);
  }

  return anonKey;
}



export default function ForumPage() {

    const adminMode = isAdminAuthenticated();

  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [banInfo, setBanInfo] = useState(null);



  const clientRef = useRef(null);
  const anonKeyRef = useRef(getAnonKey());
  const selectedTopicIdRef = useRef("");



  useEffect(() => {
    selectedTopicIdRef.current = selectedTopicId;
    }, [selectedTopicId]);

  async function loadTopics() {
    const response = await apiClient.get("/forum/topics");
    setTopics(response.data);

    if (response.data.length > 0 && !selectedTopicId) {
      setSelectedTopicId(response.data[0].id);
    }
  }

  async function loadMessages(topicId) {
    try {
      const url = topicId
        ? `/forum/messages?topicId=${topicId}`
        : "/forum/messages";

      const response = await apiClient.get(url);
      setMessages(response.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить сообщения форума");
    }
  }


    async function sendAdminMessage(event) {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            await apiClient.post("/admin/forum/messages", {
            topicId: selectedTopicId || null,
            content,
            });

            setContent("");

            await loadMessages(selectedTopicId);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Не удалось отправить сообщение администратора");
        }
    }

  async function checkBan() {
    try {
      const response = await apiClient.get(
        `/forum/bans/check?anonKey=${encodeURIComponent(anonKeyRef.current)}`
      );

      if (response.data.banned) {
        setBanInfo(response.data);
      } else {
        setBanInfo(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteMessage(messageId) {
    try {
      await apiClient.delete(`/forum/messages/${messageId}`);
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Не удалось удалить сообщение");
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
      await apiClient.post("/admin/forum/bans", {
        anonKey: message.anonKey,
        reason,
        appealEmail,
      });

      alert(`Пользователь ${message.nickname} заблокирован`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Не удалось заблокировать пользователя");
    }
  }



  useEffect(() => {
    loadTopics();
    checkBan();
  }, []);

  useEffect(() => {
    if (selectedTopicId) {
      loadMessages(selectedTopicId);
    }
  }, [selectedTopicId]);

  useEffect(() => {
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        client.subscribe("/topic/forum", (message) => {
          const newMessage = JSON.parse(message.body);

          const messageTopicId = newMessage.topic?.id || "";

          setMessages((prev) => {
            if (selectedTopicIdRef.current && messageTopicId !== selectedTopicIdRef.current) {
                return prev;
            }

            if (prev.some((item) => item.id === newMessage.id)) {
              return prev;
            }

            return [...prev, newMessage];
          });
        });
      },

      onDisconnect: () => {
        setConnected(false);
      },

      onWebSocketClose: () => {
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error("STOMP error", frame);
        setError("Ошибка WebSocket-соединения");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [selectedTopicId]);

  function sendMessage(event) {
    event.preventDefault();

    const text = content.trim();

    if (!text || banInfo?.banned) {
      return;
    }

    if (!clientRef.current || !connected) {
      setError("WebSocket ещё не подключён");
      return;
    }

    clientRef.current.publish({
      destination: "/app/forum.send",
      body: JSON.stringify({
        topicId: selectedTopicId || null,
        content: text,
        anonKey: anonKeyRef.current,
      }),
    });

    setContent("");
  }

  return (
    <section className="page forum-page">
      <div className="page-header">
        <div>
          <h1>Анонимный форум</h1>
          <p>Сообщения доставляются в реальном времени через WebSocket.</p>
        </div>

        <div className="forum-actions">


          <span className={connected ? "status online" : "status offline"}>
            {connected ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {banInfo?.banned && (
        <div className="ban-alert">
          <h2>Вы заблокированы на форуме</h2>
          <p>
            <strong>Причина:</strong> {banInfo.reason}
          </p>
          <p>
            Для обжалования блокировки напишите на:{" "}
            <strong>{banInfo.appealEmail}</strong>
          </p>
        </div>
      )}

      <div className="forum-layout">
        <aside className="topics-sidebar">
          <h2>Темы</h2>

          {topics.length === 0 ? (
            <p className="muted">Тем пока нет.</p>
          ) : (
            topics.map((topic) => (
              <button
                key={topic.id}
                className={
                  selectedTopicId === topic.id
                    ? "topic-button active"
                    : "topic-button"
                }
                onClick={() => setSelectedTopicId(topic.id)}
              >
                <strong>{topic.title}</strong>
                <span>{topic.description}</span>
              </button>
            ))
          )}
        </aside>

        <div className="forum-box">
          <div className="messages">
            {messages.length === 0 ? (
              <p className="muted">Сообщений пока нет.</p>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.anonKey === anonKeyRef.current;

                return (
                  <div
                    key={message.id}
                    className={[
                      "message",
                      isOwnMessage ? "own-message" : "",
                      message.adminMessage ? "admin-message" : "",
                    ].join(" ")}
                  >
                    <div className="message-header">
                      <div>
                        <strong>{message.nickname}</strong>

                        {message.adminMessage && (
                          <span className="admin-badge">ADMIN</span>
                        )}

                        {isOwnMessage && (
                          <span className="own-badge">Вы</span>
                        )}
                      </div>

                      <span>{new Date(message.createdAt).toLocaleString()}</span>
                    </div>

                    <p>{message.content}</p>

                    {adminMode && (
                      <div className="message-admin-actions">
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
                    )}
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={sendMessage} className="message-form">
            <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(event);
                }
            }}
            placeholder={
                banInfo?.banned
                    ? "Вы заблокированы и не можете писать на форуме"
                    : "Напишите сообщение... Enter — отправить, Shift+Enter — новая строка"
            }
            maxLength={2000}
            disabled={banInfo?.banned}
            />


            

            <div className="message-form-actions">
            <button type="submit" disabled={banInfo?.banned}>
                Отправить
            </button>

            {adminMode && (
                <button
                type="button"
                className="admin-send-button"
                onClick={sendAdminMessage}
                >
                Отправить как администратор
                </button>
            )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
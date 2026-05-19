import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { saveAdminSession } from "../auth/adminAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function login(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await apiClient.post("/auth/login", form);

      saveAdminSession(response.data);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <h1>Вход администратора</h1>

        <p className="muted">
          Войдите, чтобы управлять статьями, квестами, форумом и базой предметов.
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={login} className="admin-form">
          <label>
            Логин
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin"
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Введите пароль"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
}
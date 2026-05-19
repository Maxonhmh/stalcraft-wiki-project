import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import ItemsPage from "./pages/ItemsPage";
import QuestsPage from "./pages/QuestsPage";
import ForumPage from "./pages/ForumPage";
import AdminPage from "./pages/AdminPage";
import QuestPage from "./pages/QuestPage";
import ItemPage from "./pages/ItemPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedAdminRoute from "./auth/ProtectedAdminRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="wiki" element={<ArticlesPage />} />
        <Route path="wiki/:slug" element={<ArticlePage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="items/:id" element={<ItemPage />} />
        <Route path="quests" element={<QuestsPage />} />
        <Route path="quests/:slug" element={<QuestPage />} />

        <Route path="forum" element={<ForumPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />

        <Route
          path="admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}
export function saveAdminSession(data) {
  localStorage.setItem("adminToken", data.token);
  localStorage.setItem(
    "adminUser",
    JSON.stringify({
      username: data.username,
      role: data.role,
    })
  );
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

export function getAdminUser() {
  const raw = localStorage.getItem("adminUser");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}
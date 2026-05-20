# STALCRAFT Wiki Project

Fullstack-приложение wiki по игре STALCRAFT с каталогом предметов, разделом статей, разделом квестов, анонимным форумом и административной панелью.

Проект разработан в рамках курсовой работы по теме:  
**«Разработка Fullstack-приложения wiki по игре с реализацией анонимного форума»**.

## Описание проекта

STALCRAFT Wiki Project — это клиент-серверное веб-приложение, объединяющее справочную wiki-систему и форум для общения игроков. Пользователи могут просматривать статьи, квесты и каталог игровых предметов, а также отправлять сообщения на форум без обязательной регистрации.

Администратор имеет доступ к панели управления, где может создавать и редактировать статьи, квесты, темы форума, удалять сообщения, блокировать пользователей форума и запускать импорт игровых предметов из открытой базы STALCRAFT Database.

Для обмена данными между клиентом и сервером используется REST API. Для форума реализована отправка сообщений в реальном времени через WebSocket, благодаря чему новые сообщения появляются без перезагрузки страницы.

## Основные возможности

- просмотр wiki-статей;
- просмотр и создание квестов;
- каталог игровых предметов;
- отображение характеристик предметов;
- отображение уровней улучшения предметов;
- импорт предметов из открытой базы STALCRAFT Database;
- анонимный форум;
- отправка сообщений на форум через WebSocket;
- выделение собственных сообщений пользователя;
- сообщения администратора с отдельной пометкой;
- удаление сообщений администратором;
- создание и удаление тем форума;
- блокировка и разблокировка пользователей форума;
- загрузка изображений для статей;
- авторизация администратора через JWT;
- административная панель;
- Docker-развёртывание.

## Технологический стек

### Frontend

- React
- Vite
- React Router
- Axios
- STOMP/WebSocket client
- CSS

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- Spring WebSocket
- JWT

### Database

- PostgreSQL

### Infrastructure

- Docker
- Docker Compose
- Nginx
- VPS Ubuntu 24.04
- Let's Encrypt HTTPS

## Структура проекта

```text
stalcraft-wiki-project/
├── backend/
│   ├── Dockerfile
│   ├── docker-compose.local.yml
│   ├── build.gradle
│   ├── settings.gradle
│   └── src/main/java/com/example/demo/
│       ├── article/
│       ├── auth/
│       ├── config/
│       ├── forum/
│       ├── item/
│       ├── quest/
│       ├── security/
│       └── upload/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── utils/
├── docker-compose.yml
├── README.md
└── .env
```











### Что нужно для запуска

## Перед запуском необходимо установить:

Java 17 или выше;
Node.js 20 или выше;
npm;
Docker Desktop;
Docker Compose;
Git.

## Проверить версии можно командами:
```text
java -version
node -v
npm -v
docker --version
docker compose version
git --version
```
## Клонирование проекта
```text
git clone https://github.com/Maxonhmh/stalcraft-wiki-project.git
cd stalcraft-wiki-project
```
## Создание .env файла

## В корне проекта нужно создать файл:

.env
В него нужно вставить следующие переменные:
```text
POSTGRES_DB=stalcraft_wiki
POSTGRES_USER=stalcraft_user
POSTGRES_PASSWORD=your_strong_postgres_password

APP_JWT_SECRET=your_very_long_jwt_secret_key_more_than_32_characters
APP_JWT_EXPIRATION_MS=86400000

APP_ADMIN_USERNAME=admin
APP_ADMIN_PASSWORD=your_admin_password

APP_UPLOAD_DIR=/app/uploads
APP_PUBLIC_URL=http://localhost:3000
```

### Пример для локального запуска:
```text
POSTGRES_DB=stalcraft_wiki
POSTGRES_USER=stalcraft_user
POSTGRES_PASSWORD=postgres12345

APP_JWT_SECRET=local_jwt_secret_key_more_than_32_characters_2026
APP_JWT_EXPIRATION_MS=86400000

APP_ADMIN_USERNAME=admin
APP_ADMIN_PASSWORD=admin12345

APP_UPLOAD_DIR=/app/uploads
APP_PUBLIC_URL=http://localhost:3000
```

# Файл .env содержит пароли и секретные ключи, поэтому его не нужно добавлять в GitHub.

### Запуск проекта через Docker Compose

## Из корня проекта выполнить:
```text
docker compose up -d --build
```

# Проверить, что контейнеры запущены:

```text
docker compose ps
```
# После успешного запуска приложение будет доступно по адресу:
```text
http://localhost:3000
```
# Проверить работу API можно командой:
```text
curl http://localhost:3000/api/articles
```
### Вход в админ-панель

## Админ-панель доступна по адресу:

```text
http://localhost:3000/admin/login
```
## Данные для входа берутся из .env:


APP_ADMIN_USERNAME=admin
APP_ADMIN_PASSWORD=admin12345

## Если использовался пример .env, то логин и пароль будут:

Логин: admin
Пароль: admin12345
Остановка проекта


### Основные API endpoints
## Авторизация
POST /api/auth/login
## Статьи
GET    /api/articles
POST   /api/articles
GET    /api/articles/{id}
PUT    /api/articles/{id}
DELETE /api/articles/{id}
## Квесты
GET    /api/quests
POST   /api/quests
GET    /api/quests/{id}
PUT    /api/quests/{id}
DELETE /api/quests/{id}
## Предметы
GET  /api/items
GET  /api/items/{id}
POST /api/admin/items/import
## Форум
GET    /api/forum/topics
POST   /api/forum/topics
DELETE /api/forum/topics/{id}
## Сообщения
GET    /api/forum/messages
POST   /api/forum/messages
DELETE /api/forum/messages/{id}
## WebSocket
/ws

## STOMP endpoint для отправки сообщения:

/app/forum.send

## STOMP topic для получения сообщений:

/topic/forum

  -H "Content-Type: application/json" \
  -d '{"nickname":"Anon-Test","content":"Hello from curl","anonKey":"curl-test-user"}'

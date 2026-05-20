# STALCRAFT Wiki Project

Fullstack-приложение wiki по игре STALCRAFT с каталогом предметов, разделом статей, разделом квестов, анонимным форумом и административной панелью.

Проект разработан в рамках курсовой работы по теме:  
**«Разработка Fullstack-приложения wiki по игре с реализацией анонимного форума»**.

## Основные возможности

- просмотр wiki-статей;
- просмотр и создание квестов;
- каталог игровых предметов;
- отображение характеристик предметов;
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



## Требования для локального запуска

Для запуска проекта локально необходимо установить:

- **Java 17** или выше;
- **Gradle** или использовать встроенный Gradle Wrapper `gradlew`;
- **Node.js 20+**;
- **npm**;
- **Docker Desktop**;
- **Docker Compose**;
- **Git**;
- редактор кода, например **Visual Studio Code**.

Проверить установленные версии можно командами:

```bash
java -version
node -v
npm -v
docker --version
docker compose version
git --version


Подготовка проекта

Сначала необходимо склонировать репозиторий:

git clone https://github.com/Maxonhmh/stalcraft-wiki-project.git
cd stalcraft-wiki-project

В корне проекта нужно создать файл .env.

Пример содержимого .env:

POSTGRES_DB=stalcraft_wiki
POSTGRES_USER=stalcraft_user
POSTGRES_PASSWORD=your_strong_postgres_password

APP_JWT_SECRET=your_very_long_jwt_secret_key_more_than_32_characters
APP_JWT_EXPIRATION_MS=86400000

APP_ADMIN_USERNAME=admin
APP_ADMIN_PASSWORD=your_admin_password

APP_UPLOAD_DIR=/app/uploads
APP_PUBLIC_URL=http://localhost:3000



## Запуск 
Из корня проекта выполнить:

docker compose up -d --build

Проверить состояние контейнеров:

docker compose ps

После успешного запуска приложение будет доступно по адресу:

http://localhost:3000


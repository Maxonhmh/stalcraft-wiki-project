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

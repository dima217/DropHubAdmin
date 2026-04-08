# DropHub Admin Panel

## Что реализовано

- FSD-структура: `app`, `widgets`, `features`, `entities`, `shared`.
- App Router + server fetching на страницах admin-модуля.
- Admin shell c навигацией: dashboard, users, support.
- Пользователи: список, email search, ban/unban через proxy API routes.
- Storage: карточка пользователя, просмотр элементов и restore deleted.
- Dashboard: обзорные метрики и график активности (Recharts).
- Support: очередь обращений и ответ администратора.

## Требуемые ENV

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## Auth модель

- Для admin страниц требуется cookie `accessToken`.
- `middleware` редиректит неавторизованного пользователя на `/admin/login`.
- Серверные страницы читают токен через `cookies()` и отправляют `Bearer` в backend API.
- Login форма отправляет `POST /api/admin/auth/login`, route проксирует запрос в backend
  по `AUTH_LOGIN_PATH` (default: `/auth/login`) и ставит `httpOnly` cookie `accessToken`.
- Logout: `POST /api/admin/auth/logout` очищает cookie `accessToken` (кнопка в сайдбаре).

## Важные директории

- `src/app/admin/*` - роуты и server fetching.
- `src/app/api/admin/*` - proxy routes для клиентских мутаций.
- `src/shared/api/*` - HTTP-клиент и admin endpoints.
- `src/widgets/admin-shell/*` - каркас админки.
- `src/features/user-management/*` - таблица пользователей.
- `src/entities/storage/*` - визуализация storage tree.
- `src/features/support-queue/*` - очередь обращений.

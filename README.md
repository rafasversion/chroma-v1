# Chroma

**Website:** https://chromapics.site

Full-stack platform for sharing and discovering photo and video content with color-based feed filtering. The system features JWT-authenticated media upload, social interactions, folder organization, and a responsive React frontend.

---

## Architecture Overview

Chroma is structured as a monorepo with two primary applications:

- **Backend**: Node.js/Express REST API serving authenticated endpoints and static media.
- **Frontend**: React single-page application (SPA) consuming the backend API.

The backend enforces business logic, handles file storage, and performs color analysis. The frontend manages client-side state, routing, and UI rendering.

---

## Backend

REST API for Chroma. Handles authentication, media upload, post management, social interactions (likes, comments, folders, notifications), and color-based feed filtering.

### Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **ORM:** Prisma
- **Database:** MySQL
- **Auth:** JWT + Google OAuth
- **Validation:** Zod
- **Upload:** Multer (disk storage, 100 MB limit)
- **Image processing:** Jimp
- **Email:** Nodemailer

---

### Requirements

- Node.js >= 18
- MySQL >= 8
- npm

---

### Setup

```bash
git clone https://github.com/rafasversion/chroma.git
cd chroma/apps/backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

---

### Environment Variables

| Variable               | Description                             |
| ---------------------- | --------------------------------------- |
| `PORT`                 | Port the server listens on              |
| `NODE_ENV`             | `development` or `production`           |
| `DATABASE_URL`         | MySQL connection string                 |
| `JWT_SECRET`           | Secret used to sign JWT tokens          |
| `FRONTEND_URL`         | Allowed CORS origin                     |
| `BACKEND_URL`          | Base URL used to build `file_url` paths |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                  |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret              |
| `SMTP_HOST`            | SMTP server host                        |
| `SMTP_PORT`            | SMTP server port                        |
| `SMTP_USER`            | SMTP username                           |
| `SMTP_PASS`            | SMTP password                           |

---

### Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start in watch mode via `tsx`    |
| `npm run build` | Run `prisma generate` then `tsc` |
| `npm run start` | Run compiled output from `dist/` |
| `npm run lint`  | Run ESLint on `src/`             |

---

### Project Structure

```
apps/backend/src/
├── app.ts                  # Express instance, middleware, route registration
├── index.ts                # Entry point, server bootstrap, process signals
├── controllers/            # One file per operation, grouped by domain
│   ├── auth/
│   ├── comments/
│   ├── folders/
│   ├── likes/
│   ├── notifications/
│   ├── posts/
│   ├── search/
│   └── users/
├── services/               # Business logic, Prisma queries
├── middleware/
│   ├── auth.ts             # JWT verification and token generation
│   └── validation.ts       # Zod schemas + validate() middleware factory
├── routes/                 # Router definitions
└── utils/
    ├── colors.ts           # Dominant color extraction via Jimp
    ├── mailer.ts           # Nodemailer wrapper
    ├── prisma.ts           # Singleton Prisma client
    └── upload.ts           # Multer configuration
```

---

### API Endpoints

All routes are prefixed with `/api`.

#### Auth

| Method | Path              | Auth | Description                           |
| ------ | ----------------- | ---- | ------------------------------------- |
| POST   | `/user/register`  | No   | Register with email/username/password |
| POST   | `/login`          | No   | Login with email or username          |
| POST   | `/google-login`   | No   | Login/register via Google OAuth       |
| POST   | `/password/lost`  | No   | Send password reset email             |
| POST   | `/password/reset` | No   | Reset password using token            |

#### Users

| Method | Path                          | Auth | Description                                      |
| ------ | ----------------------------- | ---- | ------------------------------------------------ |
| GET    | `/user`                       | Yes  | Get authenticated user's profile                 |
| GET    | `/user/by-username/:username` | No   | Get user by username                             |
| GET    | `/user/:username/posts`       | No   | List posts by user                               |
| POST   | `/user`                       | Yes  | Update profile (multipart, field `user_picture`) |
| DELETE | `/user`                       | Yes  | Delete account                                   |

#### Posts

| Method | Path        | Auth | Description                                                 |
| ------ | ----------- | ---- | ----------------------------------------------------------- |
| POST   | `/post`     | Yes  | Create post (multipart, field `img`)                        |
| GET    | `/post`     | No   | List posts (supports `color`, `page`, `total` query params) |
| GET    | `/post/:id` | No   | Get post with comments                                      |
| PUT    | `/post/:id` | Yes  | Update post title and description                           |
| DELETE | `/post/:id` | Yes  | Delete post                                                 |

#### Folders

| Method | Path                       | Auth | Description                              |
| ------ | -------------------------- | ---- | ---------------------------------------- |
| POST   | `/folder`                  | Yes  | Create folder (multipart, field `cover`) |
| GET    | `/folder`                  | Yes  | List authenticated user's folders        |
| GET    | `/folder/:id`              | No   | Get folder by ID                         |
| GET    | `/users/:username/folders` | No   | List public folders by username          |
| PUT    | `/folder/:id`              | Yes  | Update folder                            |
| DELETE | `/folder/:id`              | Yes  | Delete folder                            |
| POST   | `/folder/add-post`         | Yes  | Add post to folder                       |
| POST   | `/folder/remove-post`      | Yes  | Remove post from folder                  |

#### Comments

| Method | Path                 | Auth | Description              |
| ------ | -------------------- | ---- | ------------------------ |
| POST   | `/post/:id/comment`  | Yes  | Create comment or reply  |
| GET    | `/post/:id/comments` | No   | List comments for a post |
| DELETE | `/comment/:id`       | Yes  | Delete comment           |
| POST   | `/comment/:id/like`  | Yes  | Toggle like on comment   |

#### Likes

| Method | Path             | Auth | Description            |
| ------ | ---------------- | ---- | ---------------------- |
| POST   | `/post/:id/like` | Yes  | Toggle like on post    |
| GET    | `/user/likes`    | Yes  | Get user's liked posts |

#### Notifications

| Method | Path                  | Auth | Description                    |
| ------ | --------------------- | ---- | ------------------------------ |
| GET    | `/notifications`      | Yes  | Get notifications for the user |
| PATCH  | `/notifications/read` | Yes  | Mark notifications as read     |

#### Search

| Method | Path      | Auth | Description                         |
| ------ | --------- | ---- | ----------------------------------- |
| GET    | `/search` | No   | Search posts and users (`?q=query`) |

#### Health

| Method | Path          | Auth | Description    |
| ------ | ------------- | ---- | -------------- |
| GET    | `/api/health` | No   | Liveness check |

---

### Authentication

JWT Bearer token. All protected routes require:

```
Authorization: Bearer <token>
```

Tokens are valid for 24 hours. The `verifyToken` middleware decodes the token and attaches `req.user.id` and `req.user.email` to the request.

Google OAuth issues a JWT from the same `generateToken` function, so the token format is identical regardless of login method.

---

### Media Upload

Files are stored on disk under `uploads/` in the project root and served statically at `/uploads/:filename`. The `file_url` stored in the database is an absolute URL built from `BACKEND_URL`.

Accepted MIME types: `image/*`, `video/*`. Maximum file size: 100 MB.

---

### Dominant Color

On image upload, Jimp resizes the image to 1×1 pixel and reads the resulting color. The RGB value is stored as a comma-separated string (e.g. `"120,85,200"`) in the `dominant_color` column.

The `GET /post` endpoint accepts a `color` query parameter in the same `r,g,b` format. Posts are filtered by Euclidean distance in RGB space with a fixed tolerance of 120.

---

### Database Schema

Core models and their relationships:

- **users** — accounts; supports both native and Google login
- **posts** — photo or video entries; stores `file_url`, `is_video`, `dominant_color`, `access_count`
- **comments** — threaded via self-referencing `parent_id`
- **comment_likes** — composite PK `(user_id, comment_id)`
- **likes** — composite PK `(user_id, post_id)`
- **folders** — user-created collections; `is_private` flag
- **folder_items** — join table `(folder_id, post_id)`
- **notifications** — typed events (`like`, `comment`, `reply`, `comment_like`)

All cascades on user or post deletion are handled at the database level via Prisma's `onDelete: Cascade`.

---

### Validation

Request bodies are validated by Zod schemas before reaching controllers. The `validate(schema)` factory merges `req.body`, `req.query`, and `req.params` before parsing. Validation errors return HTTP 422 with a `details` array listing each failing field.

---

## Frontend

React SPA providing the user interface for Chroma. Manages client-side routing, state, and API communication.

### Stack

- **Language:** TypeScript
- **Framework:** React
- **Routing:** React Router DOM
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **Styling:** CSS Modules
- **Authentication:** JWT stored in `localStorage`

### Setup

```bash
cd chroma/apps/frontend
cp .env.example .env
npm install
npm run dev
```

### Environment Variables

| Variable            | Description                 |
| ------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API |

---

### Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start Vite development server |
| `npm run build`   | Build for production `tsc`    |
| `npm run preview` | Preview production build      |

---

### Project Structure

```
apps/frontend/src/
├── main.tsx               # Application entry point
├── App.tsx                # Root component with router configuration
├── components/            # Reusable UI components
│   ├── Comment/
│   ├── Feed/
│   ├── Folder/
│   ├── Layout/
│   ├── Modal/
│   ├── Notification/
│   ├── Post/
│   ├── Search/
│   └── User/
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # User authentication state
│   └── ThemeContext.tsx   # UI theme management
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   └── useDebounce.ts
├── pages/                 # Route-level components
│   ├── Home/
│   ├── Login/
│   ├── Profile/
│   ├── PostDetail/
│   ├── FolderDetail/
│   ├── Notifications/
│   ├── SearchResults/
│   └── Settings/
├── services/              # API communication layer
│   ├── api.ts
│   ├── auth.ts
│   ├── posts.ts
│   ├── folders.ts
│   ├── comments.ts
│   ├── notifications.ts
│   └── search.ts
└── types/                 # TypeScript type definitions
    └── index.ts

```

---

### Routing

React Router DOM defines the following routes:

| Path                | Component     | Auth                        |
| ------------------- | ------------- | --------------------------- |
| `/`                 | `Home`        | No                          |
| `/`                 | `Feed`        | Yes                         |
| `/login`            | `Login`       | No (redirects if logged in) |
| `/register`         | `Register`    | No (redirects if logged in) |
| `/board`            | `Board`       | Yes                         |
| `/board:username`   | `Board`       | No                          |
| `/profile`          | `Profile`     | Yes                         |
| `/profile:username` | `Profile`     | No                          |
| `/post/:id`         | Post          | No                          |
| `/folder/:id`       | FolderDetail  | No                          |
| `/notifications`    | Notifications | Yes                         |
| `/search`           | SearchPage    | No                          |

### UI Features

- **Infinite scroll** on the main feed and profile pages.
- **Modal system** for post creation and folder management.
- **Responsive layout** with CSS Grid and Flexbox.
- **Image lazy loading** for performance.
- **Color picker** component for feed filtering.
- **Real-time notification indicator** with read/unread state.

## License

`MIT license`

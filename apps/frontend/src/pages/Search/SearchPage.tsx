import React from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import { User, ImageIcon } from "lucide-react";
import styles from "./SearchPage.module.css";
import { searchService } from "../../services/searchService";

interface PostResult {
  id: number;
  title: string;
  src: string | null;
  is_video: boolean;
  author: string;
}

interface UserResult {
  id: number;
  username: string;
  name: string;
  picture: string | null;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [posts, setPosts] = React.useState<PostResult[]>([]);
  const [users, setUsers] = React.useState<UserResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!q || q.length < 2) return;
    setLoading(true);
    setError("");

    searchService(q)
      .then((data) => {
        if (data) {
          setPosts(data.posts || []);
          setUsers(data.users || []);
        } else {
          setError("Error retrieving results.");
        }
      })
      .catch(() => setError("Error retrieving results."))
      .finally(() => setLoading(false));
  }, [q]);

  if (!q) return <p className={styles.empty}>Type something to search.</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Results for: <span>"{q}"</span>
      </h1>

      {loading && <p className={styles.loading}>Searching...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {users.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <User size={18} /> Users
          </h2>
          <div className={styles.usersList}>
            {users.map((user) => (
              <NavLink
                key={user.id}
                to={`/board/${user.username}`}
                className={styles.userCard}
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.username}
                    className={styles.userAvatar}
                  />
                ) : (
                  <div className={styles.userAvatarFallback}>
                    <User size={20} />
                  </div>
                )}
                <div>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userUsername}>@{user.username}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <ImageIcon size={18} /> Posts
          </h2>
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <NavLink
                key={post.id}
                to={`/photo/${post.id}`}
                className={styles.postCard}
              >
                {post.src ? (
                  post.is_video ? (
                    <video src={post.src} className={styles.postMedia} muted />
                  ) : (
                    <img
                      src={post.src}
                      alt={post.title}
                      className={styles.postMedia}
                    />
                  )
                ) : (
                  <div className={styles.postMediaFallback}>
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className={styles.postInfo}>
                  <p className={styles.postTitle}>{post.title}</p>
                  <p className={styles.postAuthor}>@{post.author}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {!loading && posts.length === 0 && users.length === 0 && (
        <p className={styles.empty}>No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;

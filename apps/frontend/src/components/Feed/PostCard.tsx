import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Eye, Heart, MessageCircle } from "lucide-react";
import type { PostAPI } from "../../types/postApi";
import styles from "../../pages/Feed/Feed.module.css";

interface PostCardProps {
  post: PostAPI;
  onAddClick: (photoId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onAddClick }) => {
  const location = useLocation();

  return (
    <div className={styles.photoLink}>
      <article className={styles.photo}>
        <Link
          to={`/post/${post.id}`}
          state={{ backgroundLocation: location }}
          className={styles.photoLink}
        >
          <div className={styles.imgWrapper}>
            {post.is_video ? (
              <video
                src={post.file_url}
                className={styles.videoElement}
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            ) : (
              <img src={post.file_url} alt={post.title} />
            )}
            <div className={styles.photoOverlay}>
              <div className={styles.overlayStats}>
                <span>
                  <Heart size={18} /> {post.total_likes || 0}
                </span>
                <span>
                  <MessageCircle size={18} /> {post.total_comments || 0}
                </span>
                <span>
                  <Eye size={18} /> {post.access_number || 0}
                </span>
              </div>
            </div>
          </div>
        </Link>
        <div className={styles.footer}>
          <span>{post.title}</span>
          <i
            className={`fa-solid fa-circle-plus ${styles.addIcon}`}
            onClick={() => onAddClick(post.id)}
          />
        </div>
      </article>
    </div>
  );
};

export default PostCard;

import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Eye, Heart, MessageCircle } from "lucide-react";
import type { PhotoAPI } from "../../types/photoApi";
import styles from "../../pages/Feed/Feed.module.css";

interface PhotoCardProps {
  photo: PhotoAPI;
  onAddClick: (photoId: number) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onAddClick }) => {
  const location = useLocation();

  return (
    <div className={styles.photoLink}>
      <article className={styles.photo}>
        <Link
          to={`/photo/${photo.id}`}
          state={{ backgroundLocation: location }}
          className={styles.photoLink}
        >
          <div className={styles.imgWrapper}>
            {photo.is_video ? (
              <video
                src={photo.src}
                className={styles.videoElement}
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            ) : (
              <img src={photo.src} alt={photo.title} />
            )}
            <div className={styles.photoOverlay}>
              <div className={styles.overlayStats}>
                <span>
                  <Heart size={18} /> {photo.total_likes || 0}
                </span>
                <span>
                  <MessageCircle size={18} /> {photo.total_comments || 0}
                </span>
                <span>
                  <Eye size={18} /> {photo.acessos || 0}
                </span>
              </div>
            </div>
          </div>
        </Link>
        <div className={styles.footer}>
          <span>{photo.title}</span>
          <i
            className={`fa-solid fa-circle-plus ${styles.addIcon}`}
            onClick={() => onAddClick(photo.id)}
          />
        </div>
      </article>
    </div>
  );
};

export default PhotoCard;

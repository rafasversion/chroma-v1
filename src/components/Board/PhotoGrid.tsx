import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Eye } from "lucide-react";
import Masonry from "react-masonry-css";
import styles from "../../pages/Board/Board.module.css";
import PhotoOptions from "../Photo/PhotoOptions";
import type { PhotoAPI } from "../../types/photoApi";

interface PhotoGridProps {
  photos: PhotoAPI[];
  isOwnProfile: boolean;
  activeTab: "posts" | "likes";
  onLike: (
    e: React.MouseEvent,
    photoId: number,
    currentlyLiked: boolean,
  ) => void;
  onEditPhoto: (photo: PhotoAPI) => void;
  onDeletePhoto: (photo: PhotoAPI) => void;
}

const PhotoGrid = ({
  photos,
  isOwnProfile,
  activeTab,
  onLike,
  onEditPhoto,
  onDeletePhoto,
}: PhotoGridProps) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles.myMasonryGrid}
      columnClassName={styles.myMasonryGridColumn}
    >
      {photos.map((item) => {
        if (!item.src) return null;
        return (
          <div key={item.id} className={styles.photoCard}>
            <Link to={`/photo/${item.id}`} className={styles.photoLink}>
              <div className={styles.imgWrapper}>
                <button
                  type="button"
                  className={styles.heartBtn}
                  onClick={(e) => onLike(e, item.id, !!item.user_liked)}
                >
                  <Heart
                    size={20}
                    fill={item.user_liked ? "red" : "none"}
                    stroke={item.user_liked ? "red" : "white"}
                  />
                </button>
                {item.is_video ? (
                  <video src={item.src} muted loop playsInline />
                ) : (
                  <img src={item.src} alt={item.title} />
                )}
                <div className={styles.photoOverlay}>
                  <div className={styles.overlayStats}>
                    <span>
                      <Heart size={18} /> {item.total_likes || 0}
                    </span>
                    <span>
                      <MessageCircle size={18} /> {item.total_comments || 0}
                    </span>
                    <span>
                      <Eye size={18} /> {item.acessos || 0}
                    </span>
                  </div>
                </div>
              </div>
              {isOwnProfile && activeTab === "posts" && (
                <>
                  <PhotoOptions
                    onEdit={() => onEditPhoto(item)}
                    onDelete={() => onDeletePhoto(item)}
                  />
                </>
              )}
            </Link>
          </div>
        );
      })}
    </Masonry>
  );
};

export default PhotoGrid;

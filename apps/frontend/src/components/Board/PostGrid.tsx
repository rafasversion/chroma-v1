import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Eye } from "lucide-react";
import Masonry from "react-masonry-css";
import styles from "../../pages/Board/Board.module.css";
import PostOptions from "../Post/PostOptions";
import type { PostAPI } from "../../types/postApi";

interface PostGridProps {
  posts: PostAPI[];
  isOwnProfile: boolean;
  activeTab: "posts" | "likes";
  onLike: (
    e: React.MouseEvent,
    photoId: number,
    currentlyLiked: boolean,
  ) => void;
  onEditPhoto: (photo: PostAPI) => void;
  onDeletePhoto: (photo: PostAPI) => void;
}

const PhotoGrid = ({
  posts,
  isOwnProfile,
  activeTab,
  onLike,
  onEditPhoto,
  onDeletePhoto,
}: PostGridProps) => {
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
      {posts.map((item) => {
        if (!item.file_url) return null;
        return (
          <div key={item.id} className={styles.photoCard}>
            <Link to={`/post/${item.id}`} className={styles.photoLink}>
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
                  <video src={item.file_url} muted loop playsInline />
                ) : (
                  <img src={item.file_url} alt={item.title} />
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
                      <Eye size={18} /> {item.access_number || 0}
                    </span>
                  </div>
                </div>
              </div>
              {isOwnProfile && activeTab === "posts" && (
                <>
                  <PostOptions
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

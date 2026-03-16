import React from "react";
import styles from "./Photo.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { photoService } from "../../services/photoService";
import type { PhotoAPI } from "../../types/photoApi";
import CommentPost from "../../components/Comments/CommentPost";
import { likeService } from "../../services/likeService";
import ShareButton from "../../components/ShareButton";
import SavePhotoFolder from "../Folder/SavePhotoFolder";
import { CirclePlus, Ellipsis, MessageCircle } from "lucide-react";
import photoUserDefault from "../../assets/user.svg";

const Photo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [photo, setPhoto] = React.useState<PhotoAPI | null>(null);
  const [comments, setComments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const inputCommentRef = React.useRef<HTMLInputElement>(null);
  const [modalSelectFolder, setModalSelectFolder] = React.useState(false);
  const [idPhotoSelected, setIdPhotoSelected] = React.useState<number | null>(
    null,
  );
  const [commentsOpen, setCommentsOpen] = React.useState(false);
  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const optionsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target as Node)
      ) {
        setOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    async function getPhoto() {
      setLoading(true);
      const response = await photoService({ id });
      if (response && "photo" in response && response.photo) {
        setPhoto(response.photo);
        setIdPhotoSelected(response.photo.id);
        setComments(response.comments || []);
      } else if (response && !Array.isArray(response)) {
        setPhoto(response as unknown as PhotoAPI);
      }
      setLoading(false);
    }
    getPhoto();
  }, [id]);

  async function handleLike() {
    if (!id) return;
    const token = window.localStorage.getItem("token");
    if (!token) return;
    const response = await likeService(id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response) return;
    setPhoto((prevPhoto) => {
      if (!prevPhoto) return null;
      return {
        ...prevPhoto,
        total_likes: response.count,
        user_liked: !prevPhoto.user_liked,
      };
    });
  }

  function handleDownload() {
    if (!photo?.src) return;
    const a = document.createElement("a");
    a.href = photo.src;
    a.download = photo.title || "photo";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setOptionsOpen(false);
  }

  function handleOutsideClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      if (commentsOpen) {
        setCommentsOpen(false);
        return;
      }
      navigate(-1);
    }
  }

  const focusInputComment = () => {
    setCommentsOpen(true);
    setTimeout(() => inputCommentRef.current?.focus(), 300);
  };

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (loading) return <div className={styles.photo}>Carregando...</div>;
  if (!photo) return null;

  return (
    <section className={styles.photo} onClick={handleOutsideClick}>
      <div className={styles.photoContent}>
        <button className={styles.closeModal} onClick={() => navigate(-1)}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className={styles.imageContainer}>
          {photo.is_video ? (
            <video src={photo.src} controls autoPlay className={styles.img} />
          ) : (
            <img src={photo.src} alt={photo.title} className={styles.img} />
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              {photo.author} • {photo.title}
            </h1>
            <p className={styles.description}>{photo.content}</p>
            <div className={styles.comments}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div
                    key={comment.comment_ID || index}
                    className={styles.comment}
                  >
                    <img
                      src={comment.user_picture || photoUserDefault}
                      alt={comment.comment_author}
                      className={styles.commentAvatar}
                      onError={(e) => {
                        e.currentTarget.src = photoUserDefault;
                      }}
                    />
                    <div>
                      <span className={styles.commentAuthor}>
                        {comment.comment_author}
                      </span>
                      <p className={styles.commentText}>
                        {comment.comment_content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noComments}>No comments yet.</p>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.actions}>
              <div className={styles.userLiked}>
                <button className={styles.iconButton} onClick={handleLike}>
                  {photo.user_liked ? (
                    <i className="fa-solid fa-heart"></i>
                  ) : (
                    <i className="fa-regular fa-heart"></i>
                  )}
                </button>
                <span className={styles.likeCount}>
                  {photo.total_likes || 0}
                </span>
              </div>

              <button
                className={styles.iconButton}
                onClick={() => setCommentsOpen(!commentsOpen)}
              >
                <MessageCircle size={20} />
              </button>

              <ShareButton
                className={styles.iconButton}
                title={photo.title}
                text="share"
                url={window.location.href}
                size={20}
              />

              <button
                className={styles.iconButton}
                onClick={() => setModalSelectFolder(true)}
              >
                <CirclePlus size={20} />
              </button>

              <div ref={optionsRef} style={{ position: "relative" }}>
                <button
                  className={styles.iconButton}
                  onClick={() => setOptionsOpen(!optionsOpen)}
                >
                  <Ellipsis size={20} />
                </button>

                {optionsOpen && (
                  <div className={styles.optionsDropdown}>
                    <button onClick={handleDownload}>
                      <i className="fa-solid fa-download"></i> Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            <CommentPost ref={inputCommentRef} id={photo.id} />
          </div>

          {commentsOpen && (
            <div className={styles.commentsDrawer}>
              <div
                className={styles.commentsDrawerHandle}
                onClick={() => setCommentsOpen(false)}
              />
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div
                    key={comment.comment_ID || index}
                    className={styles.comment}
                  >
                    <img
                      src={comment.user_picture || photoUserDefault}
                      alt={comment.comment_author}
                      className={styles.commentAvatar}
                      onError={(e) => {
                        e.currentTarget.src = photoUserDefault;
                      }}
                    />
                    <div>
                      <span className={styles.commentAuthor}>
                        {comment.comment_author}
                      </span>
                      <p className={styles.commentText}>
                        {comment.comment_content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noComments}>No comments yet.</p>
              )}
              <CommentPost ref={inputCommentRef} id={photo.id} />
            </div>
          )}
        </div>
      </div>

      {modalSelectFolder && (
        <SavePhotoFolder
          setModal={setModalSelectFolder}
          photoId={idPhotoSelected!}
        />
      )}
    </section>
  );
};

export default Photo;

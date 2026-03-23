import React from "react";
import styles from "./Post.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { postService } from "../../services/postService";
import { likeService } from "../../services/likeService";
import { commentService } from "../../services/commentService";
import type { PostAPI } from "../../types/postApi";
import type { PostCommentAPI } from "../../types/postCommentApi";
import CommentPost from "../Comments/CommentPost";
import CommentItem from "../Comments/CommentItem";
import ShareButton from "../ShareButton";
import SavePhotoFolder from "../Folder/SavePhotoFolder";
import userDefault from "../../assets/user.svg";
import { CirclePlus, Ellipsis, MessageCircle } from "lucide-react";

const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = React.useState<PostAPI | null>(null);
  const [comments, setComments] = React.useState<PostCommentAPI[]>([]);
  const [currentUserId, setCurrentUserId] = React.useState<
    number | undefined
  >();
  const [loading, setLoading] = React.useState(true);
  const [commentsOpen, setCommentsOpen] = React.useState(false);
  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const [modalSelectFolder, setModalSelectFolder] = React.useState(false);
  const [expandedDesc, setExpandedDesc] = React.useState(false);

  const inputCommentRef = React.useRef<HTMLInputElement>(null);
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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const loadComments = React.useCallback(async () => {
    if (!id) return;
    const data = await commentService(id);
    if (data) setComments(data);
  }, [id]);

  React.useEffect(() => {
    async function getPost() {
      setLoading(true);
      const response = await postService({ id });
      if (response && "post" in response && response.post) {
        const p = response.post as PostAPI & { author_id?: number };
        setPost(p);
        setComments(
          (response as { post: PostAPI; comments: PostCommentAPI[] })
            .comments || [],
        );
      }
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setCurrentUserId(payload.id);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    }
    getPost();
  }, [id]);

  async function handleLike() {
    if (!id) return;
    const token = window.localStorage.getItem("token");
    if (!token) return;
    const response = await likeService(id);
    if (!response) return;
    setPost((prev) =>
      prev
        ? { ...prev, total_likes: response.count, user_liked: !prev.user_liked }
        : null,
    );
  }

  function handleDownload() {
    if (!post?.file_url) return;
    const a = document.createElement("a");
    a.href = post.file_url;
    a.download = post.title || "post";
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

  if (loading)
    return (
      <div className={styles.post}>
        <div style={{ color: "#fff", margin: "auto" }}>Loading...</div>
      </div>
    );
  if (!post) return null;

  const MAX_DESC = 80;
  const isLongDesc = (post.description?.length || 0) > MAX_DESC;

  const commentList = (
    <>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
            postId={post.id}
            currentUserId={currentUserId}
            onRefresh={loadComments}
          />
        ))
      ) : (
        <p className={styles.noComments}>No comments yet.</p>
      )}
    </>
  );

  const totalComments = comments.reduce(
    (acc, comment) => acc + 1 + (comment.replies?.length || 0),
    0,
  );

  return (
    <section className={styles.post} onClick={handleOutsideClick}>
      <div className={styles.postContent}>
        <button className={styles.closeModal} onClick={() => navigate(-1)}>
          <i className="fa-solid fa-xmark" />
        </button>

        <div className={styles.imageContainer}>
          {post.is_video ? (
            <video
              src={post.file_url}
              controls
              autoPlay
              className={styles.img}
            />
          ) : (
            <img src={post.file_url} alt={post.title} className={styles.img} />
          )}
        </div>

        <div className={styles.details}>
          {/* DESKTOP CONTENT */}
          <div className={styles.content}>
            <div className={styles.header}>
              <img
                src={post.author_picture || userDefault}
                alt={post.author}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.currentTarget.src = userDefault;
                }}
              />
              <h1 className={styles.title}>
                {post.author} • {post.title}
              </h1>
            </div>
            <div style={{ marginTop: "0px", paddingLeft: "2rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
            <p className={styles.description}>{post.description}</p>
            <div className={styles.comments}>{commentList}</div>
          </div>

          <div className={styles.footer}>
            <div className={styles.actions}>
              <div className={styles.userLiked}>
                <button className={styles.iconButton} onClick={handleLike}>
                  {post.user_liked ? (
                    <i className="fa-solid fa-heart" style={{ color: "red" }} />
                  ) : (
                    <i className="fa-regular fa-heart" />
                  )}
                </button>
                <span className={styles.likeCount}>
                  {post.total_likes || 0}
                </span>
              </div>

              <div className={styles.userLiked}>
                <button
                  className={styles.iconButton}
                  onClick={focusInputComment}
                >
                  <MessageCircle size={20} />
                </button>
                <span className={styles.likeCount}>{totalComments}</span>
              </div>

              <ShareButton
                className={styles.iconButton}
                title={post.title}
                text="Check this out"
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
                      <i className="fa-solid fa-download" /> Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.postInfo}>
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
              >
                <img
                  src={post.author_picture || userDefault}
                  alt={post.author}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.currentTarget.src = userDefault;
                  }}
                />
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "#1a1a1a",
                  }}
                >
                  {post.author} • {post.title}
                </span>
              </div>
              {post.description && (
                <p className={styles.postInfoDesc}>
                  {expandedDesc || !isLongDesc
                    ? post.description
                    : `${post.description.slice(0, MAX_DESC)}...`}
                  {isLongDesc && (
                    <button
                      onClick={() => setExpandedDesc(!expandedDesc)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#1a1a1a",
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: "0 4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {expandedDesc ? "see less" : "see more"}
                    </button>
                  )}
                </p>
              )}
            </div>

            <CommentPost
              ref={inputCommentRef}
              postId={post.id}
              onSuccess={loadComments}
            />
          </div>

          {commentsOpen && (
            <div className={styles.commentsDrawer}>
              <div
                className={styles.commentsDrawerHandle}
                onClick={() => setCommentsOpen(false)}
              />
              {commentList}
              <CommentPost postId={post.id} onSuccess={loadComments} />
            </div>
          )}
        </div>
      </div>

      {modalSelectFolder && (
        <SavePhotoFolder setModal={setModalSelectFolder} photoId={post.id} />
      )}
    </section>
  );
};

export default Post;

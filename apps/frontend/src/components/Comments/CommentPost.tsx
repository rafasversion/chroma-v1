import React from "react";
import styles from "./CommentPost.module.css";
import { createCommentService } from "../../services/commentService";

interface CommentPostProps {
  postId: number | string;
  parentId?: number;
  placeholder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CommentPost = React.forwardRef<HTMLInputElement, CommentPostProps>(
  (
    { postId, parentId, placeholder = "Add a comment...", onSuccess, onCancel },
    ref,
  ) => {
    const [comment, setComment] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(event: React.FormEvent) {
      event.preventDefault();
      if (!comment.trim()) return;
      const token = window.localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      const result = await createCommentService(postId, comment, parentId);
      setLoading(false);

      if (result) {
        setComment("");
        onSuccess?.();
      }
    }

    return (
      <form className={styles.formComment} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            className={styles.commentInput}
            type="text"
            placeholder={placeholder}
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            disabled={loading}
          />
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 6px",
                color: "#aaa",
              }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
          <button
            type="submit"
            className={styles.sendComment}
            disabled={loading}
          >
            <i className="fa-solid fa-paper-plane" />
          </button>
        </div>
      </form>
    );
  },
);

export default CommentPost;

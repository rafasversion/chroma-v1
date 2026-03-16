import React from "react";
import styles from "./CommentPost.module.css";
import { commentService } from "../../services/commentService";
interface CommentPostProps {
  id: number | string;
}
const CommentPost = React.forwardRef<HTMLInputElement, CommentPostProps>(
  ({ id }, ref) => {
    const [comment, setComment] = React.useState("");

    async function handleSubmit(event: React.FormEvent) {
      event.preventDefault();
      if (comment.trim() === "") return;

      const token = window.localStorage.getItem("token");
      const response = await commentService(id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
      if (response) {
        setComment("");
      }
    }
    return (
      <form className={styles.formComment} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            className={styles.commentInput}
            type="text"
            placeholder="Comment..."
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit" className={styles.sendComment}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    );
  },
);

export default CommentPost;

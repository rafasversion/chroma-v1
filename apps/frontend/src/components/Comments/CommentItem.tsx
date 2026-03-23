import React from "react";
import { Heart, Reply } from "lucide-react";
import { toggleCommentLikeService } from "../../services/commentLikeService";
import { deleteCommentService } from "../../services/commentService";
import CommentPost from "./CommentPost";
import type { PostCommentAPI } from "../../types/postCommentApi";
import userDefault from "../../assets/user.svg";

interface CommentItemProps {
  comment: PostCommentAPI;
  postId: number;
  currentUserId?: number;
  onRefresh: () => void;
  isReply?: boolean;
}

const CommentItem = ({
  comment,
  postId,
  currentUserId,
  onRefresh,
  isReply = false,
}: CommentItemProps) => {
  const [showReply, setShowReply] = React.useState(false);
  const [liked, setLiked] = React.useState(comment.user_liked_comment || false);
  const [likeCount, setLikeCount] = React.useState(comment.total_likes || 0);

  const handleLike = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) return;
    const result = await toggleCommentLikeService(comment.comment_id);
    if (result) {
      setLiked(result.liked);
      setLikeCount(result.total_likes);
    }
  };

  const handleDelete = async () => {
    await deleteCommentService(comment.comment_id);
    onRefresh();
  };

  const isOwn = currentUserId === comment.user_id;

  return (
    <div
      style={{
        marginLeft: isReply ? "2.5rem" : "0.5rem",
        marginBottom: "0.75rem",
        marginTop: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "flex-start",
        }}
      >
        <img
          src={comment.user_picture || userDefault}
          alt={comment.comment_author}
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
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "#f5f5f5",
              borderRadius: "12px",
              padding: "8px 12px",
            }}
          >
            <strong style={{ fontSize: "0.85rem" }}>
              @{comment.comment_author}
            </strong>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#333" }}>
              {comment.comment_content}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              marginTop: "4px",
              paddingLeft: "4px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
              {new Date(comment.comment_date).toLocaleDateString()}
            </span>

            <button
              onClick={handleLike}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.8rem",
                color: liked ? "red" : "#888",
                padding: 0,
              }}
            >
              <Heart
                size={13}
                fill={liked ? "red" : "none"}
                stroke={liked ? "red" : "#888"}
              />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReply(!showReply)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: "0.8rem",
                  color: "#888",
                  padding: 0,
                }}
              >
                <Reply size={13} /> Reply
              </button>
            )}

            {isOwn && (
              <button
                onClick={handleDelete}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  color: "#e60023",
                  padding: 0,
                }}
              >
                Delete
              </button>
            )}
          </div>

          {showReply && (
            <div style={{ marginTop: "8px" }}>
              <CommentPost
                postId={postId}
                parentId={comment.comment_id}
                placeholder={`Reply to @${comment.comment_author}...`}
                onSuccess={() => {
                  setShowReply(false);
                  onRefresh();
                }}
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.comment_id}
          comment={reply}
          postId={postId}
          currentUserId={currentUserId}
          onRefresh={onRefresh}
          isReply
        />
      ))}
    </div>
  );
};

export default CommentItem;

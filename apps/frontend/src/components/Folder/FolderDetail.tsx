import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./FolderDetail.module.css";
import { getFolderByIdService } from "../../services/folderService";
import { deleteFolderService } from "../../services/deleteFolderService";
import { deletePostService } from "../../services/deletePostService";
import { removePostFromFolderService } from "../../services/removePostFromFolderService";
import Masonry from "react-masonry-css";
import {
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  Lock,
  Globe,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import type { FolderAPI } from "../../types/folderApi";
import type { PostAPI } from "../../types/postApi";
import DeleteFolderModal from "./DeleteFolderModal";
import EditFolderModal from "./EditFolderModal";
import DeletePostModal from "../Post/DeletePostModal";
import EditPostModal from "../Post/EditPostModal";
import ShareButton from "../ShareButton";
import AddPhotoToFolderModal from "./AddPhotoToFolderModal";
import PhotoOptions from "../Post/PostOptions";
import { UserContext } from "../../contexts/UserContext";

const FolderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { username } = React.useContext(UserContext);

  const [folder, setFolder] = React.useState<FolderAPI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [addPostModal, setAddPostModal] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [postToEdit, setPostToEdit] = React.useState<PostAPI | null>(null);
  const [postToDelete, setPostToDelete] = React.useState<PostAPI | null>(null);
  const [isDeletingPhoto, setIsDeletingPhoto] = React.useState(false);
  const [error, setError] = React.useState("");

  const isOwner = folder?.author === username;
  const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 2 };

  const refresh = React.useCallback(async () => {
    if (!id) return;
    const data = await getFolderByIdService(id);
    if (data) setFolder(data);
  }, [id]);

  React.useEffect(() => {
    async function fetchFolderData() {
      if (!id) return;
      setLoading(true);
      const data = await getFolderByIdService(id);
      setFolder(data);
      setLoading(false);
    }
    fetchFolderData();
  }, [id]);

  const handleDeleteFolder = async (folderId: number) => {
    try {
      setIsDeleting(true);
      await deleteFolderService(folderId);
      navigate("/board");
    } catch (err) {
      console.error(err);
      setError("The folder could not be deleted.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      setIsDeletingPhoto(true);
      await deletePostService(photoId);
      await refresh();
      setPostToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const handleRemoveFromFolder = async (post: PostAPI) => {
    if (!folder) return;
    try {
      await removePostFromFolderService(post.id, folder.id);
      await refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loader}>Loading folder...</div>;
  if (!folder) return <div className={styles.error}>Folder not found.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/board" className={styles.backButton}>
          <ArrowLeft size={20} /> Back to Board
        </Link>

        <div className={styles.folderHeaderMain}>
          <div className={styles.folderInfo}>
            <div className={styles.titleRow}>
              <h1>{folder.title}</h1>
              {folder.is_private ? <Lock size={24} /> : <Globe size={24} />}
            </div>
            <p>{folder.total_items || 0} posts saved in this folder</p>
            {folder.description && (
              <p style={{ color: "#888" }}>{folder.description}</p>
            )}
          </div>

          <div className={styles.actionButtons}>
            <ShareButton
              className={styles.actionIcon}
              title={folder.title}
              text="Check this folder"
              url={window.location.href}
              size={20}
            />
            {isOwner && (
              <>
                <button
                  className={styles.actionIcon}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil size={20} />
                </button>
                <button
                  className={`${styles.actionIcon} ${styles.deleteBtn}`}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 size={20} />
                </button>
                <button
                  className={styles.primaryAddBtn}
                  onClick={() => setAddPostModal(true)}
                >
                  <Plus size={20} /> Add Post
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div style={{ color: "#d32f2f", margin: "1rem 0" }}>
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </div>
      )}

      <div className={styles.contentSection}>
        {folder.posts && folder.posts.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.myMasonryGrid}
            columnClassName={styles.myMasonryGridColumn}
          >
            {folder.posts.map((post: PostAPI) => (
              <div key={post.id} className={styles.photoCard}>
                <Link to={`/post/${post.id}`} className={styles.photoLink}>
                  <div className={styles.imgWrapper}>
                    {post.is_video ? (
                      <video src={post.file_url || ""} muted loop playsInline />
                    ) : (
                      <img src={post.file_url || ""} alt={post.title} />
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

                {isOwner && (
                  <PhotoOptions
                    onRemoveFromFolder={() => handleRemoveFromFolder(post)}
                    onEdit={
                      post.author === username
                        ? () => setPostToEdit(post)
                        : undefined
                    }
                    onDelete={
                      post.author === username
                        ? () => setPostToDelete(post)
                        : undefined
                    }
                  />
                )}
              </div>
            ))}
          </Masonry>
        ) : (
          <div className={styles.emptyState}>
            <p>This folder is currently empty.</p>
          </div>
        )}
      </div>

      {addPostModal && (
        <AddPhotoToFolderModal
          folder={folder}
          onClose={() => setAddPostModal(false)}
          onUpdate={refresh}
        />
      )}
      {isEditModalOpen && (
        <EditFolderModal
          folder={folder}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={refresh}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteFolderModal
          folder={folder}
          loading={isDeleting}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteFolder}
        />
      )}
      {postToDelete && (
        <DeletePostModal
          post={postToDelete}
          loading={isDeletingPhoto}
          onClose={() => setPostToDelete(null)}
          onConfirm={handleDeletePhoto}
        />
      )}
      {postToEdit && (
        <EditPostModal
          post={postToEdit}
          onClose={() => setPostToEdit(null)}
          onUpdate={refresh}
        />
      )}
    </div>
  );
};

export default FolderDetail;

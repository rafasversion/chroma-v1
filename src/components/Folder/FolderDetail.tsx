import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./FolderDetail.module.css";
import { getFolderByIdService } from "../../services/folderService";
import { deleteFolderService } from "../../services/deleteFolderService";
import { deletePostService } from "../../services/deletePostService";
import { removePhotoFromFolderService } from "../../services/folderRemoveService";
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
import type { PhotoAPI } from "../../types/photoApi";
import DeleteFolderModal from "../Folder/DeleteFolderModal";
import EditFolderModal from "./EditFolderModal";
import DeletePhotoModal from "../Photo/DeletePhotoModal";
import EditPhotoModal from "../Photo/EditPhotoModal";
import ShareButton from "../../components/ShareButton";
import AddPhotoToFolderModal from "./AddPhotoToFolderModal";
import PhotoOptions from "../Photo/PhotoOptions";
import { UserContext } from "../../contexts/UserContext";

const FolderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { username } = React.useContext(UserContext);

  const [folder, setFolder] = React.useState<FolderAPI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [addPhotoModal, setAddPhotoModal] = React.useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const [photoToEdit, setPhotoToEdit] = React.useState<PhotoAPI | null>(null);
  const [photoToDelete, setPhotoToDelete] = React.useState<PhotoAPI | null>(
    null,
  );
  const [photoToRemove, setPhotoToRemove] = React.useState<PhotoAPI | null>(
    null,
  );
  const [isRemovingFromFolder, setIsRemovingFromFolder] = React.useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = React.useState(false);
  const [error, setError] = React.useState("");
  const isOwner = folder?.author === username;
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  const refresh = React.useCallback(async () => {
    if (!id) return;
    const data = await getFolderByIdService(id);
    setFolder(data);
  }, [id]);

  React.useEffect(() => {
    async function fetchFolderData() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getFolderByIdService(id);
        setFolder(data);
      } catch (error) {
        console.error("Error loading folder:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFolderData();
  }, [id]);

  const handleDeleteFolder = async (folderId: number) => {
    try {
      setIsDeleting(true);
      const token = window.localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");
      await deleteFolderService(folderId.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
      const token = window.localStorage.getItem("token");
      await deletePostService(photoId.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refresh();
      setPhotoToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const handleRemoveFromFolder = async (photoId: number) => {
    if (!folder) return;
    try {
      setIsRemovingFromFolder(true);
      await removePhotoFromFolderService(photoId, folder.id);
      await refresh();
      setPhotoToRemove(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRemovingFromFolder(false);
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
              <h1>{folder.titulo}</h1>
              {folder.privada ? <Lock size={24} /> : <Globe size={24} />}
            </div>
            <p>{folder.total || 0} photos saved in this folder</p>
          </div>

          <div className={styles.actionButtons}>
            <ShareButton
              className={styles.actionIcon}
              title={folder.titulo}
              text="share"
              url={window.location.href}
              size={20}
            />
            {isOwner && (
              <>
                <button
                  className={styles.actionIcon}
                  title="Edit Board"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil size={20} />
                </button>
                <button
                  className={`${styles.actionIcon} ${styles.deleteBtn}`}
                  onClick={() => setIsDeleteModalOpen(true)}
                  title="Delete Board"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  className={styles.primaryAddBtn}
                  onClick={() => setAddPhotoModal(true)}
                >
                  <Plus size={20} /> Add Photo
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={styles.contentSection}>
        {folder.posts && folder.posts.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.myMasonryGrid}
            columnClassName={styles.myMasonryGridColumn}
          >
            {folder.posts.map((post: PhotoAPI) => (
              <div key={post.id} className={styles.photoCard}>
                <Link to={`/photo/${post.id}`} className={styles.photoLink}>
                  <div className={styles.imgWrapper}>
                    {post.is_video ? (
                      <video src={post.src || ""} muted loop playsInline />
                    ) : (
                      <img src={post.src || ""} alt={post.title} />
                    )}
                    {error && (
                      <div style={{ color: "#d32f2f", marginBottom: "16px" }}>
                        <i className="fa-solid fa-circle-exclamation"></i>{" "}
                        {error}
                      </div>
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
                          <Eye size={18} /> {post.acessos || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {isOwner && (
                  <PhotoOptions
                    onRemoveFromFolder={() => setPhotoToRemove(post)}
                    onEdit={
                      post.author === username
                        ? () => setPhotoToEdit(post)
                        : undefined
                    }
                    onDelete={
                      post.author === username
                        ? () => setPhotoToDelete(post)
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

      {addPhotoModal && (
        <AddPhotoToFolderModal
          folder={folder}
          onClose={() => setAddPhotoModal(false)}
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

      {photoToDelete && (
        <DeletePhotoModal
          photo={photoToDelete}
          loading={isDeletingPhoto}
          onClose={() => setPhotoToDelete(null)}
          onConfirm={handleDeletePhoto}
        />
      )}

      {photoToRemove && (
        <DeletePhotoModal
          photo={photoToRemove}
          loading={isRemovingFromFolder}
          onClose={() => setPhotoToRemove(null)}
          onConfirm={handleRemoveFromFolder}
        />
      )}

      {photoToEdit && (
        <EditPhotoModal
          photo={photoToEdit}
          onClose={() => setPhotoToEdit(null)}
          onUpdate={refresh}
        />
      )}
    </div>
  );
};

export default FolderDetail;

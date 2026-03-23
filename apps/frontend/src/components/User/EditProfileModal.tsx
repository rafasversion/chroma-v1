import { useState } from "react";
import styles from "./EditProfileModal.module.css";
import photoUserDefault from "../../assets/user.svg";
import SubmitButton from "../Form/Button/SubmitButton";
import Input from "../Form/Input/Input";

interface UserData {
  username?: string;
  nome?: string;
  user_picture?: string;
  is_google_user?: boolean;
}

interface EditProfileModalProps {
  user: UserData;
  setModal: (value: boolean) => void;
  onUpdate: () => void;
}

export default function EditProfileModal({
  user,
  setModal,
  onUpdate,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(user?.username || user?.nome || "");
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.user_picture || "");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }
    setError("");
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }
    setError("");
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please fill in the required fields.");
      return;
    }
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", username);
    if (picture) formData.append("user_picture", picture);

    const response = await fetch("/api/user", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setLoading(false);

    if (response.ok) {
      await onUpdate();
      setModal(false);
    } else {
      setError("Error updating profile. Please try again.");
    }
  }

  return (
    <section className={styles.postModal} onClick={() => setModal(false)}>
      <div
        className={styles.postModalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "450px", padding: "2.5rem" }}
      >
        <button
          className={styles.closeModalPost}
          onClick={() => setModal(false)}
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className={styles.folderForm}>
          <div
            className={`${styles.folderPhotoPlaceholder} ${dragActive ? styles.dragActive : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.src = photoUserDefault;
                }}
              />
            ) : (
              <i className="fa-solid fa-user" />
            )}
            <label htmlFor="profilePicture" className={styles.uploadOverlay}>
              <i className="fa-solid fa-pencil" />
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className={styles.fileInput}
              onChange={handlePictureChange}
            />
          </div>

          <Input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            setValue={setUsername}
            autoFocus
          />

          {error && (
            <div style={{ color: "#d32f2f", marginTop: "10px" }}>
              <i className="fa-solid fa-circle-exclamation" /> {error}
            </div>
          )}

          <SubmitButton
            text={loading ? "Saving..." : "Save"}
            disabled={loading}
          />
        </form>
      </div>
    </section>
  );
}

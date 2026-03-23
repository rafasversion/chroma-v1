import React from "react";
import styles from "./CreateContentModal.module.css";
import { postService } from "../../services/postService";
import { Upload } from "lucide-react";
import SubmitButton from "../Form/Button/SubmitButton";
import Input from "../Form/Input/Input";
import TextArea from "../Form/Input/TextArea";

interface PhotoFormProps {
  handleBack: () => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PhotoForm = ({ handleBack, setModal }: PhotoFormProps) => {
  const [file, setFile] = React.useState<{
    preview: string;
    raw: File;
    type: string;
  } | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);

  const processFile = (selectedFile: File) => {
    if (
      selectedFile.type.startsWith("image/") ||
      selectedFile.type.startsWith("video/")
    ) {
      setFile({
        preview: URL.createObjectURL(selectedFile),
        raw: selectedFile,
        type: selectedFile.type,
      });
      setError("");
    } else {
      setError("Please select an image or video.");
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files[0]) {
      processFile(target.files[0]);
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(false);

    if (!file || !title || !description)
      return setError("Please fill in all the information..");
    if (title.length > 10)
      return setError("Title can have a maximum of 10 characters.");
    if (description.length > 600)
      return setError("Description can have a maximum of 600 characters.");

    setLoading(true);
    const formData = new FormData();
    formData.append("img", file.raw);
    formData.append("title", title);
    formData.append("description", description);

    const token = window.localStorage.getItem("token");

    try {
      const response = await postService(
        {},
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (response) {
        setModal(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Erro ao postar", err);
      setError(
        "An internal error occurred. Please wait a moment and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleBack} className={styles.backBtn}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <form className={styles.formModal} onSubmit={handleSubmit}>
        <div
          className={`${styles.imageSection} ${dragActive ? styles.dragActive : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file && (
            <label htmlFor="postPhoto" className={styles.fileLabel}>
              <Upload size={28} />
              <span>
                Drag & drop or <u>browse</u>
              </span>
              <small>Images and videos supported</small>
            </label>
          )}

          {file && (
            <div className={styles.previewContainer}>
              <button
                type="button"
                onClick={() => setFile(null)}
                className={styles.removeBtn}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              {file.type.startsWith("video/") ? (
                <video
                  src={file.preview}
                  className={styles.previewImg}
                  controls
                />
              ) : (
                <img
                  src={file.preview}
                  alt="Preview"
                  className={styles.previewImg}
                />
              )}
            </div>
          )}
        </div>

        <div className={styles.fieldsSection}>
          <Input
            id="title"
            label="Title"
            value={title}
            setValue={setTitle}
            type="text"
          />

          <TextArea
            id="descricao"
            label="Description"
            rows={4}
            value={description}
            setValue={setDescription}
          />

          {error && (
            <div>
              <span>
                <i className="fa-solid fa-circle-exclamation"></i> {error}
              </span>
            </div>
          )}

          <SubmitButton
            type="submit"
            disabled={loading}
            text={loading ? "Submitting..." : "Submit"}
          />
        </div>

        <input
          type="file"
          id="postPhoto"
          className={styles.fileInput}
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
      </form>
    </>
  );
};

export default PhotoForm;

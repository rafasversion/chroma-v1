import React from "react";
import Masonry from "react-masonry-css";
import { photoService } from "../../services/photoService";
import type { PhotoAPI } from "../../types/photoApi";
import styles from "./Feed.module.css";
import Photo from "../../components/Photo/Photo";
import SavePhotoFolder from "../../components/Folder/SavePhotoFolder";
import PhotoCard from "../../components/Feed/PhotoCard";
import ColorFilterButton from "../../components/Feed/ColorFilterButton";
import ColorFilterModal from "../../components/Feed/ColorFilterModal";
import { useColorFilter } from "../../hooks/useColorFilter";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useAuth } from "../../hooks/useAuth";

const BREAKPOINT_COLUMNS = {
  default: 7,
  1600: 6,
  1400: 5,
  1100: 3,
  700: 2,
  500: 2,
};

const Feed = () => {
  const [photos, setPhotos] = React.useState<PhotoAPI[]>([]);
  const [modalPhoto, setModalPhoto] = React.useState(false);
  const [modalSelectFolder, setModalSelectFolder] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [infinite, setInfinite] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [idPhotoSelected, setIdPhotoSelected] = React.useState<number | null>(
    null,
  );

  const {
    pickerColor,
    selectedColor,
    colorModal,
    setPickerColor,
    setColorModal,
    applyColor,
    clearColor,
  } = useColorFilter();

  useAuth();

  React.useEffect(() => {
    async function loadPhotos() {
      if (!infinite) return;
      setLoading(true);
      const totalPerRequest = 21;
      const data = await photoService(
        {
          _page: page,
          _total: totalPerRequest,
          _color: selectedColor ?? undefined,
        },
        { method: "GET" },
      );
      if (data && Array.isArray(data)) {
        setPhotos((prev) => [...prev, ...data]);
        if (data.length < totalPerRequest) setInfinite(false);
      }
      setLoading(false);
    }
    loadPhotos();
  }, [page, infinite, selectedColor]);

  useInfiniteScroll({
    loading,
    infinite,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
  });

  const handleApplyColor = () => {
    setPhotos([]);
    setInfinite(false);
    setTimeout(() => {
      setPage(1);
      setInfinite(true);
    }, 0);
    applyColor(() => {});
  };

  const handleClearColor = () => {
    setPhotos([]);
    setInfinite(false);
    setTimeout(() => {
      setPage(1);
      setInfinite(true);
    }, 0);
    clearColor(() => {});
  };

  const handleAddPhoto = (photoId: number) => {
    setModalSelectFolder(true);
    setIdPhotoSelected(photoId);
  };

  if (photos.length === 0 && loading) {
    return <p className={styles.container}>Loading feed...</p>;
  }

  return (
    <section className={styles.container}>
      {modalPhoto && <Photo />}

      {modalSelectFolder && (
        <SavePhotoFolder
          setModal={setModalSelectFolder}
          photoId={idPhotoSelected!}
        />
      )}

      <ColorFilterModal
        isOpen={colorModal}
        pickerColor={pickerColor}
        selectedColor={selectedColor}
        onColorChange={setPickerColor}
        onApply={handleApplyColor}
        onClear={handleClearColor}
        onClose={() => setColorModal(false)}
      />

      <ColorFilterButton
        selectedColor={selectedColor}
        onOpenModal={() => setColorModal(true)}
      />

      <Masonry
        breakpointCols={BREAKPOINT_COLUMNS}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {photos
          .filter((photo) => photo.src && photo.src.trim() !== "")
          .map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onAddClick={handleAddPhoto}
            />
          ))}
      </Masonry>

      {photos.length === 0 && !loading && (
        <p className={styles.container}>No photos.</p>
      )}
    </section>
  );
};

export default Feed;

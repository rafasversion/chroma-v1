import React from "react";
import Masonry from "react-masonry-css";
import { postService } from "../../services/postService";
import type { PostAPI } from "../../types/postApi";
import styles from "./Feed.module.css";
import Post from "../../components/Post/Post";
import SavePhotoFolder from "../../components/Folder/SavePhotoFolder";
import PostCard from "../../components/Feed/PostCard";
import ColorFilterButton from "../../components/Feed/ColorFilterButton";
import ColorFilterModal from "../../components/Feed/ColorFilterModal";
import { useColorFilter } from "../../hooks/useColorFilter";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useAuth } from "../../hooks/useAuth";
import { UserContext } from "../../contexts/UserContext";
import NotLoggedProfile from "../../components/User/NotLoggedProfile";

const BREAKPOINT_COLUMNS = {
  default: 7,
  1600: 6,
  1400: 5,
  1100: 3,
  700: 2,
  500: 2,
};

const Feed = () => {
  const [posts, setPosts] = React.useState<PostAPI[]>([]);
  const [modalPost] = React.useState(false);
  const [modalSelectFolder, setModalSelectFolder] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [infinite, setInfinite] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [idPhotoSelected, setIdPhotoSelected] = React.useState<number | null>(
    null,
  );
  const { isLogged } = React.useContext(UserContext);
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
      const data = await postService(
        {
          _page: page,
          _total: totalPerRequest,
          _color: selectedColor ?? undefined,
        },
        { method: "GET" },
      );
      if (data && Array.isArray(data)) {
        setPosts((prev) => [...prev, ...data]);
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
    setPosts([]);
    setInfinite(false);
    setTimeout(() => {
      setPage(1);
      setInfinite(true);
    }, 0);
    applyColor(() => {});
  };

  const handleClearColor = () => {
    setPosts([]);
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

  if (posts.length === 0 && loading) {
    return <p className={styles.container}>Loading feed...</p>;
  }

  if (!isLogged) return <NotLoggedProfile />;
  return (
    <section className={styles.container}>
      {modalPost && <Post />}

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
        {posts
          .filter((post) => post.file_url && post.file_url.trim() !== "")
          .map((post) => (
            <PostCard key={post.id} post={post} onAddClick={handleAddPhoto} />
          ))}
      </Masonry>

      {posts.length === 0 && !loading && (
        <p className={styles.container}>No posts.</p>
      )}
    </section>
  );
};

export default Feed;

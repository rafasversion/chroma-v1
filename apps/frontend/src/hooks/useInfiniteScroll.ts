import React from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  infinite: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  loading,
  infinite,
  onLoadMore,
}: UseInfiniteScrollOptions): void => {
  React.useEffect(() => {
    let wait = false;

    function infiniteScroll() {
      if (infinite && !loading) {
        const scroll = window.scrollY;
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        if (scroll > height * 0.75 && !wait) {
          onLoadMore();
          wait = true;
          setTimeout(() => (wait = false), 500);
        }
      }
    }

    window.addEventListener("wheel", infiniteScroll);
    window.addEventListener("scroll", infiniteScroll);

    return () => {
      window.removeEventListener("wheel", infiniteScroll);
      window.removeEventListener("scroll", infiniteScroll);
    };
  }, [infinite, loading, onLoadMore]);
};
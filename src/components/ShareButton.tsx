import React from "react";
import { Share2, Share } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  size?: number;
  className?: string;
  variant?: "icon" | "button";
  label?: string;
}

const ShareButton = ({
  title,
  text,
  url,
  size = 20,
  className,
  variant = "icon",
  label = "Share",
}: ShareButtonProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log("Erro ao compartilar", error);
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  if (variant === "button") {
    return (
      <button onClick={handleShare} className={className}>
        <Share size={size} />
        {label}
      </button>
    );
  }

  return (
    <button onClick={handleShare} className={className}>
      <Share2 size={size} />
    </button>
  );
};

export default ShareButton;

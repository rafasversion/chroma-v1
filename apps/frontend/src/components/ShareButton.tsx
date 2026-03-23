import React from "react";
import { Share2, Share, Check } from "lucide-react";

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
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log("Erro ao compartilhar", error);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleShare}
        className={className}
        title={copied ? "Copied!" : "Share"}
      >
        <Share size={size} />
        {copied ? "Copied!" : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={className}
      title={copied ? "Copied!" : "Share"}
    >
      {copied ? <Check size={size} /> : <Share2 size={size} />}
    </button>
  );
};

export default ShareButton;

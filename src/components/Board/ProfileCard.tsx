import React from "react";
import { Pencil } from "lucide-react";
import styles from "../../pages/Board/Board.module.css";
import photoUserDefault from "../../assets/user.svg";
import ShareButton from "../ShareButton";

interface ProfileCardProps {
  user: any;
  isOwnProfile: boolean;
  onEditProfile: () => void;
}

const ProfileCard = ({
  user,
  isOwnProfile,
  onEditProfile,
}: ProfileCardProps) => {
  return (
    <div className={styles.cardProfile}>
      <img
        src={user?.user_picture || photoUserDefault}
        alt="Photo Profile"
        onError={(e) => {
          e.currentTarget.src = photoUserDefault;
        }}
      />
      <div className={styles.profileInfos}>
        <h3>{user?.nome || ""}</h3>
        <p>@{user?.username}</p>
      </div>

      <div className={styles.profileActions}>
        <ShareButton
          variant="button"
          label="Share Profile"
          title={user.nome}
          text="Check my profile"
          url={window.location.href}
          className={styles.profileActions}
        />

        {isOwnProfile && (
          <button onClick={onEditProfile}>
            <Pencil size={12} />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;

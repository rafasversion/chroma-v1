import React from "react";
import styles from "./SubmitButton.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const SubmitButton = ({ text, ...props }: ButtonProps) => {
  return (
    <button className={styles.submitButton} {...props}>
      {text}
    </button>
  );
};

export default SubmitButton;

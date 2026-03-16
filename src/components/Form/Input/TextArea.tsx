import React from "react";
import styles from "./Input.module.css";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  setValue: (value: string) => void;
}

const TextArea = ({ id, label, setValue, ...props }: TextAreaProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        className={styles.input}
        id={id}
        name={id}
        onChange={({ target }) => setValue(target.value)}
        {...props}
      />
    </>
  );
};

export default TextArea;

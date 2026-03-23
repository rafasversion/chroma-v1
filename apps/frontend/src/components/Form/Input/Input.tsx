import React from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  setValue: (value: string) => void;
}

const Input = ({ id, label, setValue, ...props }: InputProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className={styles.input}
        id={id}
        name={id}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    </>
  );
};

export default Input;

import React from "react";

const validationTypes = {
  email: {
    regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "Enter a valid email address.",
  },
  username: {
    regex: /^[a-zA-Z0-9_]{3,}$/,
    message: "Username must be at least 3 characters.",
  },
  password: {
    regex: /^.{6,}$/,
    message: "Password must be at least 6 characters.",
  },
};

interface FieldError {
  [key: string]: string | null;
}

interface UseFormReturn<T extends Record<string, unknown>> {
  form: T;
  errors: FieldError;
  handleChange: (fieldName: keyof T) => (value: string) => void;
  validate: (fieldName: keyof T) => boolean;
  validateAll: () => boolean;
  error: (fieldName: keyof T) => string | null;
  onBlur: (fieldName: keyof T) => () => void;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  clearErrors: () => void;
}

type ValidationRuleKey = keyof typeof validationTypes | false;

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules?: Record<keyof T, ValidationRuleKey>,
): UseFormReturn<T> => {
  const [form, setForm] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<FieldError>({});

  const validateField = (fieldName: keyof T, value: unknown): string | null => {
    if (value === "" || value === null || value === undefined) {
      return `Please fill in ${String(fieldName)}.`;
    }
    const validationType = validationRules?.[fieldName];
    if (validationType && validationType !== false) {
      const validation =
        validationTypes[validationType as keyof typeof validationTypes];
      if (validation && !validation.regex.test(String(value))) {
        return validation.message;
      }
    }
    return null;
  };

  const handleChange = (fieldName: keyof T) => (value: string) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[String(fieldName)]) {
      const err = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [String(fieldName)]: err,
      }));
    }
  };

  const validate = (fieldName: keyof T): boolean => {
    const err = validateField(fieldName, form[fieldName]);
    if (err) {
      setErrors((prev) => ({ ...prev, [String(fieldName)]: err }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [String(fieldName)]: null }));
    return true;
  };

  const validateAll = (): boolean => {
    const newErrors: FieldError = {};
    let isValid = true;
    Object.keys(form).forEach((fieldName) => {
      const err = validateField(
        fieldName as keyof T,
        form[fieldName as keyof T],
      );
      if (err) {
        newErrors[fieldName] = err;
        isValid = false;
      } else {
        newErrors[fieldName] = null;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const error = (fieldName: keyof T): string | null => {
    return errors[String(fieldName)] || null;
  };

  const onBlur = (fieldName: keyof T) => () => {
    validate(fieldName);
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    form,
    errors,
    handleChange,
    validate,
    validateAll,
    error,
    onBlur,
    setForm,
    clearErrors,
  };
};
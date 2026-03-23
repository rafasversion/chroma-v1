import React from "react";

interface UseColorFilterReturn {
  pickerColor: string;
  selectedColor: string | null;
  colorModal: boolean;
  setPickerColor: (color: string) => void;
  setSelectedColor: (color: string | null) => void;
  setColorModal: (open: boolean) => void;
  applyColor: (onApply: () => void) => void;
  clearColor: (onClear: () => void) => void;
  hexToRgbString: (hex: string) => string;
}

export const useColorFilter = (): UseColorFilterReturn => {
  const [pickerColor, setPickerColor] = React.useState("#e63946");
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [colorModal, setColorModal] = React.useState(false);

  function hexToRgbString(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  function applyColor(onApply: () => void) {
    const rgb = hexToRgbString(pickerColor);
    setSelectedColor(rgb);
    setColorModal(false);
    onApply();
  }

  function clearColor(onClear: () => void) {
    setSelectedColor(null);
    setColorModal(false);
    onClear();
  }

  return {
    pickerColor,
    selectedColor,
    colorModal,
    setPickerColor,
    setSelectedColor,
    setColorModal,
    applyColor,
    clearColor,
    hexToRgbString,
  };
};
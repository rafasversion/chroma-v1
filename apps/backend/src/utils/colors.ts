import { Jimp } from 'jimp';

export const extractDominantColor = async (imagePath: string): Promise<string | null> => {
  try {
    const image = await Jimp.read(imagePath);
    image.resize({ w: 1, h: 1 });
    const color = image.getPixelColor(0, 0);

    const r = (color >> 24) & 255;
    const g = (color >> 16) & 255;
    const b = (color >> 8) & 255;

    return `${r},${g},${b}`;
  } catch (error) {
    console.error('Error extracting dominant color:', error);
    return null;
  }
};

export const compareColors = (
  rgb1: string,
  rgb2: string,
  tolerance: number = 120
): boolean => {
  if (!rgb1 || !rgb2) return false;
  const [r1, g1, b1] = rgb1.split(',').map(Number);
  const [r2, g2, b2] = rgb2.split(',').map(Number);
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
  return distance <= tolerance;
};
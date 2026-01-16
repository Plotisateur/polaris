import { snakeCase } from 'lodash';

export default function generateColorFromHashString(str: string) {
  const hash = hashCode(str);
  const hue = Math.floor(hash % 360);
  const saturation = 25 + (hash % 70);
  const lightness = 60 + (hash % 10);
  return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hashCode(str: string) {
  return snakeCase(str)
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
}

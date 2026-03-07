export function getColorShade(streak: number, habitType: "habit_maker" | "habit_breaker", baseColor: string) {
  if (streak <= 0) return 'transparent';

  const maxDays = 21;
  const level = Math.min(streak, maxDays);
  
  let ratio = (level - 1) / (maxDays - 1);
  
  if (habitType === "habit_breaker") {
    ratio = 1 - ratio;
  }

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const hex2rgb = (hex: string) => {
    const normalized = hex.replace('#', '').trim();
    const fullHex = normalized.length === 3
      ? normalized.split('').map((char) => `${char}${char}`).join('')
      : normalized;
    const n = parseInt(fullHex, 16);
    return [n >> 16, (n >> 8) & 0xff, n & 0xff] as const;
  };

  const rgb2hex = (r: number, g: number, b: number) => {
    const toHex = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === rn) h = ((gn - bn) / delta) % 6;
      else if (max === gn) h = (bn - rn) / delta + 2;
      else h = (rn - gn) / delta + 4;
      h *= 60;
      if (h < 0) h += 360;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return [h, s * 100, l * 100] as const;
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    const hn = h / 360;
    const sn = s / 100;
    const ln = l / 100;
    const hueToRgb = (p: number, q: number, t: number) => {
      let temp = t;
      if (temp < 0) temp += 1;
      if (temp > 1) temp -= 1;
      if (temp < 1 / 6) return p + (q - p) * 6 * temp;
      if (temp < 1 / 2) return q;
      if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
      return p;
    };

    if (sn === 0) {
      const gray = Math.round(ln * 255);
      return [gray, gray, gray] as const;
    }

    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    const r = hueToRgb(p, q, hn + 1 / 3);
    const g = hueToRgb(p, q, hn);
    const b = hueToRgb(p, q, hn - 1 / 3);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)] as const;
  };

  const [baseR, baseG, baseB] = hex2rgb(baseColor);
  const [h, s, l] = rgbToHsl(baseR, baseG, baseB);

  // Keep light shades airy, but keep the final darkest shade saturated and vivid.
  const lightestS = clamp(s * 0.45, 22, 60);
  const darkestS = clamp(s + 20, 72, 96);
  const lightestL = clamp(l + 38, 82, 95);
  const darkestL = clamp(l - 10, 30, 52);

  const adjustedRatio = Math.pow(ratio, 0.9);
  const shadeS = lightestS + (darkestS - lightestS) * adjustedRatio;
  const shadeL = lightestL + (darkestL - lightestL) * adjustedRatio;

  const [r, g, b] = hslToRgb(h, shadeS, shadeL);
  return rgb2hex(r, g, b);
}

export function generateGradientShades(habitType: "habit_maker" | "habit_breaker", baseColor: string) {
  const shades = [];
  for (let i = 1; i <= 21; i++) {
    shades.push(getColorShade(i, habitType, baseColor));
  }
  return shades;
}

export function getHabitColor(streak: number, habitType: "habit_maker" | "habit_breaker", baseColor: string) {
  return getColorShade(streak, habitType, baseColor);
}

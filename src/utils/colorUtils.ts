export function getColorShade(streak: number, habitType: "habit_maker" | "habit_breaker", baseColor: string) {
  if (streak <= 0) return 'transparent';

  const maxDays = 21;
  const level = Math.min(streak, maxDays);
  
  let ratio = (level - 1) / (maxDays - 1);
  
  if (habitType === "habit_breaker") {
    ratio = 1 - ratio;
  }
  
  const hex2rgb = (hex: string) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return [n >> 16, (n >> 8) & 0xFF, n & 0xFF];
  };
  
  const rgb2hex = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  };
  
  const baseRgb = hex2rgb(baseColor);
  
  // Lightest: 70% white
  const lightest = [
    Math.round(baseRgb[0] * 0.3 + 255 * 0.7),
    Math.round(baseRgb[1] * 0.3 + 255 * 0.7),
    Math.round(baseRgb[2] * 0.3 + 255 * 0.7)
  ];
  
  // Darkest: 40% black
  const darkest = [
    Math.round(baseRgb[0] * 0.6),
    Math.round(baseRgb[1] * 0.6),
    Math.round(baseRgb[2] * 0.6)
  ];
  
  const r = Math.round(lightest[0] + (darkest[0] - lightest[0]) * ratio);
  const g = Math.round(lightest[1] + (darkest[1] - lightest[1]) * ratio);
  const b = Math.round(lightest[2] + (darkest[2] - lightest[2]) * ratio);
  
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

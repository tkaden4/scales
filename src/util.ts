import Color from "color";

export type ColorLike = Color | string;

export function colorValue(like: ColorLike) {
  return like instanceof Color ? like.hsl().string(2) : like;
}

export function coerceColor(like: ColorLike): Color {
  return like instanceof Color ? like : new Color(like);
}

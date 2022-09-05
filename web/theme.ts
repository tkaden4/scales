import { coerceColor, ColorLike } from "../src/util";
import { GuitarColors } from "./Guitar";

export interface Theme {
  octaveColors: ColorLike[];
  backgroundColor: ColorLike;
  textColor: ColorLike;
  primaryColor: ColorLike;
  secondaryColor: ColorLike;
  guitarColors: GuitarColors;
  mutedColor: ColorLike;
  neutralColor: ColorLike;
}

export const defaultTheme: Theme = {
  octaveColors: ["red", "crimson", "slateblue", "forestgreen", "orangered", "dodgerblue", "purple"].map((color) =>
    coerceColor(color).lightness(65)
  ),
  primaryColor: "#30c2ba",
  secondaryColor: "#ff5070",
  mutedColor: "#dadada",
  backgroundColor: "ghostwhite",
  neutralColor: "grey",
  textColor: "#0a0a0c",
  guitarColors: {
    stringcolor: "#b0b0b0",
    nutColor: "#505060",
    fretColor: "#bbbbbb",
  },
};

const monokaiColors = ["#ff6188", "#fc9867", "#ffd866", "#a9dc76", "#78dce8", "#ab9df2"].map((x) => coerceColor(x));
const primary = monokaiColors[4].darken(0.25).desaturate(0.2);
const secondary = monokaiColors[0].darken(0.1).desaturate(0.2);

export const darkTheme: Theme = {
  ...defaultTheme,
  octaveColors: monokaiColors.map((x) => x.darken(0.1)),
  textColor: "ghostwhite",
  backgroundColor: "#272229",
  mutedColor: coerceColor("#272229").lighten(0.2).alpha(0.95),
  neutralColor: coerceColor("grey").darken(0.5),
  primaryColor: primary,
  secondaryColor: secondary,
  guitarColors: {
    fretColor: coerceColor("#272229").lighten(0.5),
    nutColor: coerceColor("#272229").lighten(0.3),
    stringcolor: coerceColor("#272229").lighten(0.4),
  },
};

export const themes = [
  { name: "light", theme: defaultTheme },
  { name: "dark", theme: darkTheme },
];

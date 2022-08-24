import React from "react";
import { darkTheme } from "./theme";

export const ThemeContext = React.createContext(darkTheme);

export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;

export type ThemeMode = "dark" | "light";

export interface AppTheme {
  primary: {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
  };
  secondary: {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
  };
  tertiary: {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
  };
  background: {
    body: string;
    card1: string;
    card2: string;
    card3: string;
    gray: string;
  };
  common: {
    white: string;
    black: string;
    grey: string;
  };
  success: {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
  };
  warning: {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
  };
  error: {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
  };
  other: {
    popupLine: string;
    popupTextBox: string;
    popupTextStroke: string;
    disabledButton: string;
    picksBg: string;
    separatorLine: string;
    lighterGrey: string;
    deleteIconBackground: string;
    timerEnding: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    error: string;
    warning: string;
    dark: string;
    disable: string;
  };
  transparent: {
    primary: string;
    primary10: string;
    primary20: string;
    secondary: string;
    secondary30: string;
    secondary50: string;
    teritiary10: string;
    teritiary30: string;
    purple50: string;
    purple10: string;
    card210: string;
    card310: string;
  };
  submitEntry: {
    winAmount: string;
    entryAmount: string;
  };
  blueShades: {
    primary: string;
    secondary: string;
    grey: string;
  };
}

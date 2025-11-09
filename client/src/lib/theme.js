// Global theme colors and styles
export const theme = {
  colors: {
    bg: {
      primary: "bg-black",
      secondary: "bg-gray-950",
      accent: "bg-gray-900",
      light: "bg-gray-800",
    },
    text: {
      primary: "text-white",
      secondary: "text-gray-300",
      accent: "text-pink-500",
    },
    button: {
      primary: "bg-pink-500 hover:bg-pink-600 text-white",
      secondary: "bg-gray-700 hover:bg-gray-600 text-white",
      outline: "border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white",
    },
    border: "border-gray-700",
    input: "bg-gray-800 border border-gray-700 text-white placeholder-gray-500",
  },
  className: {
    section: "px-6 py-16 sm:px-12 lg:px-24",
    card: "rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-lg",
    button: "px-4 py-2 rounded-lg font-semibold transition",
    input: "w-full rounded-md border px-4 py-2 text-white bg-gray-800 border-gray-700",
    label: "block text-sm font-medium text-white",
  },
};

export const buttonClasses = {
  primary: `${theme.colors.button.primary} ${theme.className.button}`,
  secondary: `${theme.colors.button.secondary} ${theme.className.button}`,
  outline: `${theme.colors.button.outline} ${theme.className.button}`,
  small: "px-3 py-1 text-sm rounded font-semibold transition",
};

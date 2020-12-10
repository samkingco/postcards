const sansStack =
  'system, -apple-system, "Helvetica Neue", Helvetica, "Segoe UI", "Roboto", sans-serif';

const fonts = {
  body: `"Loma", ${sansStack}`,
  heading: `${sansStack}`,
};

export default {
  fonts,
  space: [4, 8, 12, 16, 24, 32, 40, 64],
  colors: {
    background: "#F5F7FA",
    backgroundAlt: "#CAC4C8",
    foreground: "#000000",
    foregroundAlt: "#5C5C5C",
    accent: "#FF4747",
  },
};

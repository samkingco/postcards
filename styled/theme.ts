const sansStack =
  'system, -apple-system, "Helvetica Neue", Helvetica, "Segoe UI", "Roboto", sans-serif';

const fonts = {
  body: `${sansStack}`,
  heading: `${sansStack}`,
};

export default {
  fonts,
  space: [4, 8, 12, 16, 24, 32, 40, 64],
  colors: {
    background: "#ffffff",
    backgroundAlt: "#EDEDED",
    foreground: "#000000",
    foregroundAlt: "#5C5C5C",
    accent: "#FF4747",
  },
};

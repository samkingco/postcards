import { useEffect, useState } from "react";

export function useWindowSize() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const callback = () => {
      setWidth(document.body.clientWidth);
      setHeight(document.body.clientHeight);
    };
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, [setWidth, setHeight]);

  return { width, height };
}

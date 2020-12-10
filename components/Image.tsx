import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const Img = styled.img<{ $hasLoaded: boolean }>`
  margin: 0;
  opacity: ${(p) => (p.$hasLoaded ? "1" : "0")};
  transition: opacity 250ms ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div<{ $ratio: number; $background?: string }>`
  height: 0;
  padding-bottom: ${(p) => p.$ratio}%;
  position: relative;
  background: ${(p) => p.$background || p.theme.colors.backgroundAlt};
`;

interface ImageProps {
  className?: string;
  src: string;
  alt?: string;
  width: number;
  height: number;
  backgroundColour?: string;
}

export function Image({
  className,
  src,
  alt,
  width,
  height,
  backgroundColour,
  ...props
}: ImageProps) {
  const wrapperRef = useRef(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isInView } = useIntersectionObserver(wrapperRef, {
    threshold: 0,
    rootMargin: "50%",
  });

  return (
    <Wrapper
      className={className}
      ref={wrapperRef}
      $ratio={(height / width) * 100}
      $background={backgroundColour}
    >
      <Img
        src={isInView ? src : ""}
        alt={alt}
        onLoad={() => setHasLoaded(true)}
        $hasLoaded={hasLoaded}
        {...props}
      />
    </Wrapper>
  );
}

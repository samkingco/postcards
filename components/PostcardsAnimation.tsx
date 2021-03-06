import React from "react";
import styled from "styled-components";
import seed from "seed-random";
import { Postcard } from "../airtable";
import { randomInt } from "../utils";
import { Image } from "./Image";
import { SentStamp } from "./SentStamp";
import { useWindowSize } from "../hooks/useWindowSize";

const Grid = styled.div`
  position: relative;
`;

const PostcardContainer = styled.div`
  position: absolute;
  line-height: 0;
  overflow: hidden;
  width: 350px;
  height: 350px;
`;

interface PostcardsAnimationProps {
  postcards: Postcard[];
}

export function PostcardsAnimation(props: PostcardsAnimationProps) {
  const backgroundColours = ["#E05457", "#CAC4C8", "#495C9C", "#8E6C6F"];

  const width = 350;
  const height = 350;
  const windowDims = useWindowSize();

  return (
    <Grid>
      {props.postcards.map((postcard) => {
        const background =
          backgroundColours[
            randomInt(0, backgroundColours.length - 1, seed(postcard.id))
          ];

        return (
          <PostcardContainer key={postcard.id}>
            <Image
              src={postcard.images[0].url}
              width={postcard.images[0].width}
              height={postcard.images[0].height}
              backgroundColour={background}
            />
            {postcard.sent && (
              <SentStamp id={postcard.id} date={postcard.dateSent} />
            )}
          </PostcardContainer>
        );
      })}
    </Grid>
  );
}

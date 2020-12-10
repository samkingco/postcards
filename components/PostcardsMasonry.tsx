import React from "react";
import styled from "styled-components";
import Masonry from "react-masonry-css";
import seed from "seed-random";
import { Postcard } from "../airtable";
import { randomInt } from "../utils";
import { Image } from "./Image";
import { SentStamp } from "./SentStamp";

const PostcardContainer = styled.div`
  position: relative;
  line-height: 0;
  margin-bottom: 24px;
`;

const MasonryGrid = styled(Masonry)`
  padding: 40px;
  display: flex;
  margin-left: -24px;
  width: auto;

  .column {
    padding-left: 24px;
    background-clip: padding-box;
  }
`;

interface PostcardsMasonryProps {
  postcards: Postcard[];
}

export function PostcardsMasonry(props: PostcardsMasonryProps) {
  const backgroundColours = ["#E05457", "#CAC4C8", "#495C9C", "#8E6C6F"];

  return (
    <MasonryGrid
      breakpointCols={{
        default: 4,
        1200: 3,
        700: 2,
        400: 1,
      }}
      className=""
      columnClassName="column"
    >
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
    </MasonryGrid>
  );
}

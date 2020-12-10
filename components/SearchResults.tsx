import React, { useState } from "react";
import { mutate } from "swr";
import styled from "styled-components";
import seed from "seed-random";
import { Postcard } from "../airtable";
import { fetchPostJSON, randomInt } from "../utils";
import { Image } from "./Image";
import { SentStamp } from "./SentStamp";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
`;

const PostcardContainer = styled.div`
  position: relative;
  line-height: 0;
`;

const EmptyState = styled.div`
  max-width: 500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const SendButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 0;
  color: transparent;
  cursor: pointer;
  outline: inherit;
  background-image: url("/send-button.png");
  background-repeat: no-repeat;
  background-size: contain;
  width: 200px;
  height: 110px;
  position: absolute;
  right: -2vw;
  top: -2vw;
  transform: rotate(10deg);
`;

interface SearchResultsProps {
  results: Postcard[];
  term: string;
}

export function SearchResults({ results, term }: SearchResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState("");

  const result = results.length > 0 ? results[0] : undefined;
  const backgroundColours = ["#E05457", "#CAC4C8", "#495C9C", "#8E6C6F"];
  const background = result
    ? backgroundColours[
        randomInt(0, backgroundColours.length - 1, seed(result.id))
      ]
    : backgroundColours[0];

  async function onSend() {
    setSendError("");
    setIsLoading(true);

    const response = await fetchPostJSON("/api/send-postcard", {
      id: result.id,
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      setIsLoading(false);
      setSendError("Something unexpected happened. Please try again.");
      return;
    }

    setIsLoading(false);
    mutate("/api/postcards");
  }

  return result ? (
    <Container>
      {sendError && <p>{sendError}</p>}
      <PostcardContainer>
        <Image
          src={result.images[0].url}
          width={result.images[0].width}
          height={result.images[0].height}
          backgroundColour={background}
        />
        {result.sent ? (
          <SentStamp id={result.id} date={result.dateSent} isLarger />
        ) : (
          <SendButton onClick={onSend}>Send</SendButton>
        )}
      </PostcardContainer>
    </Container>
  ) : (
    <EmptyState>
      <p>No results for {term}</p>
      <Image src="/sad-mailbox.jpg" width={500} height={738} />
    </EmptyState>
  );
}

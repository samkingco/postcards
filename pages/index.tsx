import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import Fuse from "fuse.js";
import { Postcard } from "../airtable";
import { fetchGetJSON } from "../api-helpers";

const SearchInput = styled.input`
  width: 100%;
  margin: none;
  padding: 16px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: ${(p) => p.theme.fonts.body};
  font-size: 20px;
  border: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.backgroundAlt};
  appearance: none;
  outline: none;

  &:focus {
    background: ${(p) => p.theme.colors.backgroundAlt};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.foreground};
    opacity: 0.4;
  }
`;

const PostcardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: ${(p) => p.theme.space[6]}px;
  align-items: center;
  justify-content: center;
`;

const PostcardContainer = styled.div`
  position: relative;
`;

const SentStamp = styled.div`
  width: 200px;
  height: 200px;
  border: 2px solid red;
  border-radius: 50%;
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  bottom: -30px;
  right: -30px;
`;

interface ResultsState {
  term: string;
  postcards: Postcard[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    ResultsState | undefined
  >();

  const { data: postcards, error } = useSWR<Postcard[]>(
    `/api/postcards`,
    fetchGetJSON
  );

  function getFallbackContent() {
    if (error) {
      return (
        <>
          <Head>
            <title>Postcards—Something went wrong</title>
          </Head>
          <p>Something went wrong. Please try again.</p>
        </>
      );
    }
    if (!postcards) {
      return (
        <>
          <Head>
            <title>Postcards…</title>
          </Head>
          <p>Loading…</p>
        </>
      );
    }
    if (postcards.length <= 0) {
      return (
        <div>
          <Head>
            <title>Postcards</title>
          </Head>
          <p>No postcards</p>
        </div>
      );
    }
    return null;
  }
  const fallbackContent = getFallbackContent();

  const postcardGrid = postcards || [];

  const fuse = new Fuse(
    postcardGrid.filter((i) => !i.sent),
    {
      keys: ["tags"],
      threshold: 0.2,
    }
  );

  function onSearch() {
    const postcards = fuse.search(searchTerm).map((results) => results.item);
    setSearchResults({ term: searchTerm, postcards });
  }

  function clearSearch() {
    setSearchTerm("");
    setSearchResults(undefined);
  }

  return (
    <main>
      <h1>Postcards</h1>

      {fallbackContent ? (
        <>{fallbackContent}</>
      ) : (
        <>
          <SearchInput
            type="text"
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />
          <button onClick={clearSearch}>Cancel</button>
          {searchResults ? (
            <>
              {searchResults.postcards && searchResults.postcards.length > 0 ? (
                <PostcardContainer>
                  <Image
                    src={searchResults.postcards[0].images[0].url}
                    width={searchResults.postcards[0].images[0].width}
                    height={searchResults.postcards[0].images[0].height}
                  />
                  {searchResults.postcards[0].sent && (
                    <SentStamp>{searchResults.postcards[0].dateSent}</SentStamp>
                  )}
                </PostcardContainer>
              ) : (
                <h2>No results for {searchResults.term}</h2>
              )}
            </>
          ) : (
            <PostcardGrid>
              {postcardGrid.map((postcard) => (
                <PostcardContainer key={postcard.id}>
                  <Image
                    src={postcard.images[0].url}
                    width={postcard.images[0].width}
                    height={postcard.images[0].height}
                  />
                  {postcard.sent && <SentStamp>{postcard.dateSent}</SentStamp>}
                </PostcardContainer>
              ))}
            </PostcardGrid>
          )}
        </>
      )}
    </main>
  );
}

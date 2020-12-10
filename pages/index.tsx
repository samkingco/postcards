import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import Fuse from "fuse.js";
import { Postcard } from "../airtable";
import { fetchGetJSON, shuffle } from "../utils";

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
  background: lightgrey;
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

interface SearchState {
  term: string;
  results: Postcard[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState<SearchState | undefined>();

  const { data: postcards, error } = useSWR<Postcard[]>(
    "/api/postcards",
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

  const fuseOptions = {
    keys: ["tags"],
    threshold: 0.2,
  };

  function onSearch() {
    const fuse = new Fuse(
      postcardGrid.filter((i) => !i.sent),
      fuseOptions
    );
    const results = fuse.search(searchTerm).map((results) => results.item);
    setSearch({ term: searchTerm, results: shuffle(results) });
  }

  function randomiseResults() {
    const currentResult = search.results[0];
    const fuse = new Fuse(
      postcardGrid.filter((i) => !i.sent && i.id !== currentResult.id),
      fuseOptions
    );
    const results = fuse.search(searchTerm).map((results) => results.item);
    setSearch({
      term: searchTerm,
      results: [...shuffle(results), currentResult],
    });
  }

  function clearSearch() {
    setSearchTerm("");
    setSearch(undefined);
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
          {search && search.results.length > 1 && (
            <button onClick={randomiseResults}>Shuffle</button>
          )}
          {search ? (
            <>
              {search.results && search.results.length > 0 ? (
                <PostcardContainer>
                  <Image
                    src={search.results[0].images[0].url}
                    width={search.results[0].images[0].width}
                    height={search.results[0].images[0].height}
                  />
                  {search.results[0].sent && (
                    <SentStamp>{search.results[0].dateSent}</SentStamp>
                  )}
                </PostcardContainer>
              ) : (
                <h2>No results for {search.term}</h2>
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

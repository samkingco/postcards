import React, { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import useSWR from "swr";
import Fuse from "fuse.js";
import seed from "seed-random";
import { Postcard } from "../airtable";
import { fetchGetJSON, randomInt, shuffle } from "../utils";
import { SearchResults } from "../components/SearchResults";
import { SentStamp } from "../components/SentStamp";
import { PostcardsAnimation } from "../components/PostcardsAnimation";

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
  grid-gap: 24px;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const PostcardContainer = styled.div<{ background: string }>`
  position: relative;
  line-height: 0;
  background: ${(p) => p.background};
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
    fetchGetJSON,
    {
      revalidateOnFocus: false,
    }
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
            <SearchResults {...search} />
          ) : (
            <PostcardsAnimation postcards={postcards} />
          )}
        </>
      )}
    </main>
  );
}

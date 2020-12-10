import React, { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import useSWR from "swr";
import Fuse from "fuse.js";
import { Postcard } from "../airtable";
import { fetchGetJSON, shuffle } from "../utils";
import { SearchResults } from "../components/SearchResults";
import { PostcardsMasonry } from "../components/PostcardsMasonry";

const PageWrapper = styled.main`
  max-width: 1280px;
  margin: 0 auto;
`;

const Logo = styled.img`
  width: 100%;
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-gap: 40px;
  align-items: center;
  padding: 40px;
`;

const SearchContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-gap: 24px;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  margin: none;
  padding: 16px 96px 16px 0;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: ${(p) => p.theme.fonts.body};
  font-size: 20px;
  border: none;
  border-bottom: 2px solid ${(p) => p.theme.colors.foreground};
  background: transparent;
  appearance: none;
  outline: none;

  &::placeholder {
    color: ${(p) => p.theme.colors.foreground};
    opacity: 0.4;
  }
`;

const Button = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 20px;
  cursor: pointer;
  outline: inherit;
`;

const ShuffleButton = styled(Button)`
  background-image: url("/refresh-button.png");
  background-repeat: no-repeat;
  background-size: contain;
  padding: 4px 24px;
`;

const ClearButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
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
          <EmptyState>
            <p>Something went wrong. Please try again.</p>
          </EmptyState>
        </>
      );
    }
    if (!postcards) {
      return (
        <>
          <Head>
            <title>Postcards…</title>
          </Head>
          <EmptyState>
            <p>Loading…</p>
          </EmptyState>
        </>
      );
    }
    if (postcards.length <= 0) {
      return (
        <div>
          <Head>
            <title>Postcards</title>
          </Head>
          <EmptyState>
            <p>No postcards</p>
          </EmptyState>
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
    const fuse = new Fuse(postcardGrid, fuseOptions);
    const results = fuse.search(searchTerm).map((results) => results.item);

    setSearch({
      term: searchTerm,
      results: results.length > 0 ? shuffle(results) : [],
    });
  }

  function randomiseResults() {
    const currentResult = search.results[0];
    const fuse = new Fuse(
      postcardGrid.filter((i) => i.id !== currentResult.id),
      fuseOptions
    );
    const results = fuse.search(searchTerm).map((results) => results.item);
    setSearch({
      term: searchTerm,
      results: results.length > 0 ? [...shuffle(results), currentResult] : [],
    });
  }

  function clearSearch() {
    setSearchTerm("");
    setSearch(undefined);
  }

  return (
    <PageWrapper>
      <Header>
        <Logo src="/logo.png" alt="Postcards" />
        <SearchContainer>
          <SearchInputWrapper>
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
            {search && <ClearButton onClick={clearSearch}>X</ClearButton>}
          </SearchInputWrapper>
          {search && search.results.length > 1 && (
            <ShuffleButton onClick={randomiseResults}>Refresh</ShuffleButton>
          )}
        </SearchContainer>
      </Header>
      {fallbackContent ? (
        <>{fallbackContent}</>
      ) : (
        <>
          {search ? (
            <SearchResults {...search} />
          ) : (
            <PostcardsMasonry postcards={postcards} />
          )}
        </>
      )}
    </PageWrapper>
  );
}

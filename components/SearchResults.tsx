import React from "react";
import { Postcard } from "../airtable";
import { Image } from "./Image";
import { SentStamp } from "./SentStamp";

interface SearchResultsProps {
  results: Postcard[];
  term: string;
}

export function SearchResults({ results, term }: SearchResultsProps) {
  return results && results.length > 0 ? (
    <div>
      <Image src={results[0].images[0].url} />
      {results[0].sent && (
        <SentStamp id={results[0].id} date={results[0].dateSent} />
      )}
    </div>
  ) : (
    <h2>No results for {term}</h2>
  );
}

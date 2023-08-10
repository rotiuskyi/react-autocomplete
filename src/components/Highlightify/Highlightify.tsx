import { Fragment } from "react";

export interface HighligtifyProps {
  fullText: string;
  highlightedText: string;
  highlightingClass?: string;
}

function Highlightify({
  fullText,
  highlightedText,
  highlightingClass = 'highlight'
}: HighligtifyProps) {
  const pointers = parseMatchingPointers(fullText, highlightedText);
  const left = fullText.slice(0, pointers[0]);

  return (
    <>
      {left}{...pointers.flatMap((pointer, idx) => [
        <span key={`highlight-${pointer}`} className={highlightingClass}>{fullText.slice(pointer, highlightedText.length)}</span>,
        <Fragment key={`regular-${pointer}`}>{fullText.slice(pointer + highlightedText.length, pointers[idx + 1])}</Fragment>
      ])}
    </>
  )
}

function parseMatchingPointers(
  fullText: string,
  searchText: string,
  matchingTextPointers: number[] = []
): number[] {
  if (searchText === "") {
    return matchingTextPointers;
  }
  if (fullText.length === 0) {
    return matchingTextPointers;
  }

  const pointer = fullText.toLowerCase().indexOf(searchText.toLowerCase());
  if (pointer === -1) {
    return matchingTextPointers;
  }

  matchingTextPointers.push(pointer);
  return parseMatchingPointers(fullText.slice(pointer + searchText.length), searchText, matchingTextPointers);
}

export default Highlightify;

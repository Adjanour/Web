// search-utils.d.ts

declare module "search-utils" {
  // Type definitions for the utility functions in your library
  export function createIndex(data: Array<any>, key: string): object;
  export function cacheResults(
    searchFunction: (query: string) => any,
  ): (query: string) => any;
  export function filterResults(index: object, query: string): Array<any>;
  export function debounceSearch(
    searchFunction: (query: string) => any,
    delay: number,
  ): (query: string) => void;
}

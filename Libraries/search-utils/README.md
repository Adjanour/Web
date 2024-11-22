# SearchUtils

**SearchUtils** is a lightweight JavaScript utility library for implementing efficient and responsive search functionalities. It provides features like indexing, caching, filtering, and debouncing to enhance the performance and user experience of search bars or sidebars.

## Features

- **Indexing**: Efficiently index large datasets for quick search operations.
- **Caching**: Cache search results to minimize redundant computations.
- **Filtering**: Real-time search filtering to narrow down results based on user input.
- **Debouncing**: Prevent excessive function calls by delaying the execution of the search operation.

## Installation

You can install SearchUtils via npm:

```bash
npm install search-utils
```

## Usage

Here’s how you can use SearchUtils in your project:

### Basic Example

```javascript
import { createIndex, cacheResults, filterResults, debounceSearch } from 'search-utils';

// Sample dataset
const data = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

// Create an index
const index = createIndex(data, 'name');

// Cache the results
const cachedSearch = cacheResults((query) => filterResults(index, query));

// Debounce the search function
const debouncedSearch = debounceSearch(cachedSearch, 300);

// Example usage in a search bar event handler
searchInput.addEventListener('input', (event) => {
  const query = event.target.value;
  const results = debouncedSearch(query);
  console.log(results);
});
```

## API Reference

### `createIndex(data: Array, key: String)`

Creates an index from the provided dataset.

- **Parameters:**
  - `data`: The array of objects to index.
  - `key`: The key to index by (e.g., `name`).

- **Returns:** An indexed object for quick search operations.

### `cacheResults(searchFunction: Function)`

Caches the results of a search function to avoid redundant computations.

- **Parameters:**
  - `searchFunction`: The search function whose results should be cached.

- **Returns:** A function that performs cached searches.

### `filterResults(index: Object, query: String)`

Filters the indexed data based on the search query.

- **Parameters:**
  - `index`: The indexed data to search through.
  - `query`: The search query.

- **Returns:** An array of objects that match the query.

### `debounceSearch(searchFunction: Function, delay: Number)`

Debounces a search function to delay its execution.

- **Parameters:**
  - `searchFunction`: The function to debounce.
  - `delay`: The delay in milliseconds.

- **Returns:** A debounced function that executes after the specified delay.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Make sure to write tests and update the documentation where necessary.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- **Bernard** - [GitHub Profile](https://github.com/adjanour)

## Acknowledgements

Thanks to everyone who contributed to this project by reporting bugs, suggesting features, or submitting pull requests.

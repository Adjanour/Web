/**
 * Filters data based on a search term and caches the result.
 * @param {Array} data - The array of data objects to filter.
 * @param {string} searchTerm - The term to search for in the data.
 * @param {string} key - The key in each data object to search within.
 * @param {Object} cache - A cache object with get, set, and has methods.
 * @returns {Array} An array of filtered data objects.
 */
export function filterData(data, searchTerm, key, cache) {
    if (cache.has(searchTerm)) {
        return cache.get(searchTerm);
    }

    const result = data.some(item => item[key].includes(searchTerm)) 
        ? data.filter(item => item[key].includes(searchTerm)) 
        : [];
        
    cache.set(searchTerm, result);
    return result;
}

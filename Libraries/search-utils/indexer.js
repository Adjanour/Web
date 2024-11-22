/**
 * Creates an index of the given data based on a specified key.
 * @param {Array} data - The array of data objects to index.
 * @param {string} key - The key in each data object to use for indexing.
 * @returns {Object} An object where keys are unique values of the specified key,
 *                   and values are arrays of data objects with that key value.
 */
export function createIndex(data, key) {
    const index = {};
    data.forEach(item => {
        const fieldValue = item[key];
        if (!index[fieldValue]) {
            index[fieldValue] = [];
        }
        index[fieldValue].push(item);
    });
    return index;
}

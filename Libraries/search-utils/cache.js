/**
 * Creates and returns a simple cache object with basic operations.
 * @returns {Object} An object with methods to interact with the cache.
 */
export function createCache() {
    const cache = {};

    return {
        /**
         * Retrieves a value from the cache.
         * @param {string} key - The key to look up.
         * @returns {*} The value associated with the key, or undefined if not found.
         */
        get: (key) => cache[key],

        /**
         * Sets a value in the cache.
         * @param {string} key - The key to associate with the value.
         * @param {*} value - The value to store.
         * @returns {*} The value that was set.
         */
        set: (key, value) => cache[key] = value,

        /**
         * Checks if a key exists in the cache.
         * @param {string} key - The key to check.
         * @returns {boolean} True if the key exists, false otherwise.
         */
        has: (key) => key in cache,

        /**
         * Clears all entries from the cache.
         */
        clear: () => {
            for (let key in cache) {
                delete cache[key];
            }
        }
    };
}

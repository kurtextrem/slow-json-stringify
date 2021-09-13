const _stringRegex = /string/;

const _replaceString = (type) => _stringRegex.test(type) ? '"__par__"' : "__par__";

const _isLastRegex = /^("}|})/;

const chunkRegex = /"\w+__sjs"/gm;

// 3 possibilities after arbitrary property:
// - ", => non-last string property
// - , => non-last non-string property
// - " => last string property
const _matchStartRe = /^(\"\,|\,|\")/;

/**
 * @param {string} str - prepared string already validated.
 * @param {array} queue - queue containing the property name to match
 * (used for building dynamic regex) needed for the preparation of
 * chunks used in different scenarios.
 */
const _makeChunks = (str, queue) => {
  chunkRegex.lastIndex = 0;
  const chunks = str
      // Matching prepared properties and replacing with target with or without
      // double quotes.
      // => Avoiding unnecessary concatenation of doublequotes during serialization.
      .replace(chunkRegex, _replaceString)
      .split("__par__"),
    result = [];

  for (let i = 0; i < chunks.length; ++i) {
    const chunk = chunks[i];

    // Using dynamic regex to ensure that only the correct property
    // at the end of the string it's actually selected.
    // => e.g. ,"a":{"a": => ,"a":{
    const matchProp = `("${queue[i]?.name}":(\"?))$`;

    // Check if current chunk is the last one inside a nested property
    const isLast = _isLastRegex.test(chunks[i + 1] || "");

    // If the chunk is the last one the `isUndef` case should match
    // the preceding comma too.
    const matchPropRe = new RegExp(isLast ? `(\,?)${matchProp}` : matchProp);

    result.push({
      // notify that the chunk preceding the current one has not
      // its corresponding property undefined.
      // => This is a V8 optimization as it's way faster writing
      // the value of a property than writing the entire property.
      flag: false,
      pure: chunk,
      // Without initial part
      prevUndef: chunk.replace(_matchStartRe, ""),
      // Without property chars
      isUndef: chunk.replace(matchPropRe, ""),
      // Only remaining chars (can be zero chars)
      bothUndef: chunk.replace(_matchStartRe, "").replace(matchPropRe, ""),
    });
  }

  return result;
};

export { _makeChunks };

const _replaceString = type => (type[1] === 's' ? '"__par__"' : '__par__')

const _chunkRegex = /"\w+?__sjs"/g

/**
 * @param {string} str - prepared string already validated.
 * @param {array} queue - queue containing the property name to match
 * (used for building dynamic regex) needed for the preparation of
 * chunks used in different scenarios.
 */
const _makeChunks = (str, queue) => {
	const chunks = str
			// Matching prepared properties and replacing with target with or without
			// double quotes.
			// => Avoiding unnecessary concatenation of doublequotes during serialization.
			.replace(_chunkRegex, _replaceString)
			.split('__par__'),
		result = []

	let chunk, matchProp, nextChunk, _i, isLast, matchPropRe, firstChar, isQuote, withoutInitial
	const length = chunks.length
	for (let i = 0; i < length; ++i) {
		chunk = chunks[i]

		// Using dynamic regex to ensure that only the correct property
		// at the end of the string it's actually selected.
		// => e.g. ,"a":{"a": => ,"a":{
		matchProp = `(?:"${queue[i]?.name}":(?:"?))$`

		// Check if current chunk is the last one inside a nested property
		_i = i + 1
		isLast = _i === length || ((nextChunk = chunks[_i]) && (nextChunk[0] === '{' || nextChunk[1] === '{'))

		// If the chunk is the last one the `isUndef` case should match
		// the preceding comma too.
		matchPropRe = new RegExp(isLast ? `(?:,?)${matchProp}` : matchProp)

		// 3 possibilities after arbitrary property:
		// - ", => non-last string property
		// - , => non-last non-string property
		// - " => last string property
		firstChar = chunk[0]
		isQuote = firstChar === '"'
		if (isQuote || firstChar === ',') withoutInitial = chunk.slice(1)
		else if (isQuote && chunk[1] === ',') withoutInitial = chunk.slice(2)
		else withoutInitial = chunk

		result.push({
			// notify that the chunk preceding the current one has not
			// its corresponding property undefined.
			// => This is a V8 optimization as it's way faster writing
			// the value of a property than writing the entire property.
			flag: false,
			pure: chunk,
			// Without initial part
			prevUndef: withoutInitial,
			// Without property chars
			isUndef: chunk.replace(matchPropRe, ''),
			// Only remaining chars (can be zero chars)
			bothUndef: withoutInitial.replace(matchPropRe, ''),
		})
	}

	return result
}

export { _makeChunks }

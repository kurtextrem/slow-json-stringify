/**
 * `_find` is a super fast deep property finder.
 * It dynamically build the function needed to reach the desired
 * property.
 *
 * e.g.
 * obj = {a: {b: {c: 1}}}
 * _find(['a','b','c']) => (obj) => (((obj || {}).a || {}).b || {}).c
 *
 * @param {array} path - path to reach object property.
 */
const _find = (path) => {
  let str = 'obj';

  for (let i = 0; i < path.length; ++i) {
    str = `(${str}||{}).${path[i]}`;
  }

  return eval(`(obj=>${str})`);
};

const __find = (path) => {
  let str = 'obj';

  for (let i = 0; i < path.length; ++i) {
    str += `?.['${path[i]}']`;
  }

  return eval(`(obj=>${str})`);
};

/**
 * `_makeArraySerializer` is simply a wrapper of another `sjs` schema
 * used for the serialization of arrais.
 *
 * @param {array} array - Array to serialize.
 * @param {any} method - `sjs` serializer.
 */
const _makeArraySerializer = (serializer) => {
  if (serializer instanceof Function) {
    return (array) => {
      // Stringifying more complex array using the provided sjs schema
      let acc = '';
      const len = array.length - 1;
      for (let i = 0; i < len; ++i) {
        acc += `${serializer(array[i])},`;
      }

      // Prevent slice for removing unnecessary comma.
      acc += serializer(array[len]);
      return `[${acc}]`;
    };
  }

  return array => JSON.stringify(array);
};

const TYPES = ['number', 'string', 'boolean', 'array', 'null'];

/*#__PURE__*/
function checkType(type) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && !TYPES.includes(type)) {
    throw new Error(
      `Expected one of: "number", "string", "boolean", "array", "null". received "${type}" instead`,
    );
  }
}

/**
 * @param type number|string|boolean|array|null
 * @param serializer
 * @returns
 */
const attr = (type, serializer) => {
  /*#__PURE__*/checkType(type);

  const usedSerializer = serializer || (value => value);

  return {
    isSJS: true,
    type,
    serializer:
      type === 'array' ? _makeArraySerializer(serializer) : usedSerializer,
  };
};

// Little utility for escaping convenience.
// => if no regex is provided, a default one will be used.
const _defaultRegex = new RegExp('\\n|\\r|\\t|\\"|\\\\', 'gm');
const _escapeCallback = char => '\\' + char;
const escape = (regex = _defaultRegex) => str => str.replace(regex, _escapeCallback);

export { __find, _find, escape, attr };


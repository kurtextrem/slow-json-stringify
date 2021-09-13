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

function _arraySerializer(serializer, array) {
  // Stringifying more complex array using the provided sjs schema
  let acc = '';
  const len = array.length - 1;
  for (let i = 0; i < len; ++i) {
    acc += `${serializer(array[i])},`;
  }

  // Prevent slice for removing unnecessary comma.
  acc += serializer(array[len]);
  return `[${acc}]`;
}

/**
 * `_makeArraySerializer` is simply a wrapper of another `sjs` schema
 * used for the serialization of arrais.
 */
const _makeArraySerializer = (serializer) => {
  if (serializer instanceof Function) return _arraySerializer.bind(null, serializer);
  return JSON.stringify;
};

function _arrayNullSerializer(serializer, array) {
  if (array === null) return 'null';
  return serializer(array);
}

const _makeNullArraySerializer = (serializer) => {
  const arraySerliazer = _makeArraySerializer(serializer);
  return _arrayNullSerializer.bind(null, arraySerliazer);
};

const TYPES = {
  number: null,
  string: null,
  boolean: null,
  array: _makeArraySerializer,
  null: null,
  nullArray: _makeNullArraySerializer,
};

/* #__PURE__ */
function checkType(type) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && TYPES[type] === undefined) {
    throw new Error(
      `Expected one of: "number", "string", "boolean", "array", "null", "nullArray". received "${type}" instead`,
    );
  }
}

const fnUser = (value) => value;

/**
 * @param type number|string|boolean|array|null|nullArray
 * @param serializer
 * @returns
 */
const attr = (type, serializer) => {
  /* #__PURE__ */checkType(type);

  return {
    isSJS: true,
    type,
    serializer: TYPES[type]?.(serializer) || (serializer || fnUser),
  };
};

// Little utility for escaping convenience.
// => if no regex is provided, a default one will be used.
const _defaultRegex = new RegExp('\\n|\\r|\\t|\\"|\\\\', 'gm');
const _escapeCallback = (char) => '\\' + char;
const escape = (regex = _defaultRegex) => (str) => str.replace(regex, _escapeCallback);

export { __find, _find, escape, attr };

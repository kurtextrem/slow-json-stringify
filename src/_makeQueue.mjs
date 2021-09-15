import { __find, _find } from "./_utils.mjs";

function _prepareQueue(originalSchema, queue, obj, acc = []) {
    const usedAcc = [...acc];
    const find = __find(usedAcc);
  if (obj.indexOf("__sjs") !== -1) {
    const { serializer } = find(originalSchema);

    queue.push({
      serializer,
      find,
      name: acc[acc.length - 1],
    });
    return;
  }

  // Recursively going deeper.
  // NOTE: While going deeper, the current prop is pushed into the accumulator
  // to keep track of the position inside of the object.
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    _prepareQueue(originalSchema, queue, obj[key], [...acc, key]);
  }
}

/**
 * @param {object} preparedSchema - schema already validated
 * with modified prop values to avoid clashes.
 * @param {object} originalSchema - User provided schema
 * => contains array stringification serializers that are lost during preparation.
 */
const _makeQueue = (preparedSchema, originalSchema) => {
  const queue = [];
  _prepareQueue(originalSchema, queue, preparedSchema);
  return queue;
};

export { _makeQueue };

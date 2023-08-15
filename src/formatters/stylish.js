import _ from 'lodash';
import { STATUS, STYLISH_SYMBOLS } from '../constants.js';

const getIndent = (count, depth, shift = 0) => ' '.repeat(count * depth - shift);
const getBracketIndent = (count, depth) => ' '.repeat(count * depth - count);

const stringify = (value, depth, stepCount) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indentCount = getIndent(stepCount, depth);
  const lines = Object.entries(value).map(([key, val]) => `${indentCount}${key}: ${stringify(val, depth + 1, stepCount)}`);

  return ['{', ...lines, `${getBracketIndent(stepCount, depth)}}`].join('\n');
};

const stylishFormatter = (tree, count) => {
  const iter = (node, depth) => {
    const indentCount = getIndent(count, depth, 2);

    const lines = node.map((item) => {
      const { key, status, value } = item;

      if (Object.hasOwn(item, 'children')) {
        const { children } = item;
        return `${indentCount}  ${key}: ${iter(children, depth + 1)}`;
      }

      if (status === STATUS.changed) {
        const { to, from } = item;
        const oldValue = stringify(from, depth + 1, count);
        const newValue = stringify(to, depth + 1, count);

        return `${indentCount}${STYLISH_SYMBOLS.deleted} ${key}: ${oldValue}\n${indentCount}${STYLISH_SYMBOLS.added} ${key}: ${newValue}`;
      }

      return `${indentCount}${STYLISH_SYMBOLS[status]} ${key}: ${stringify(value, depth + 1, count)}`;
    });

    return ['{', ...lines, `${getBracketIndent(count, depth)}}`].join('\n');
  };

  return iter(tree, 1);
};

export default stylishFormatter;

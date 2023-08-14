import _ from 'lodash';
import { STATUS, STYLISH_SYMBOLS } from '../constants.js';

const getIndent = (count) => ' '.repeat(count);

const stringify = (value, indent, stepCount) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indentCount = indent + stepCount;
  const bracketIndent = getIndent(indentCount - stepCount);
  const lines = Object.entries(value).map(([key, val]) => `${getIndent(indentCount)}${key}: ${stringify(val, indentCount, stepCount)}`);

  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

const stylishFormatter = (tree, count) => {
  const iter = (node, depth) => {
    const leftShift = 2;
    const indentCount = depth * count - leftShift;
    const bracketIndent = getIndent(depth * count - count);

    const lines = node.map((item) => {
      const { key, status, value } = item;

      if (Object.hasOwn(item, 'children')) {
        const { children } = item;
        return `${getIndent(indentCount)}  ${key}: ${iter(children, depth + 1)}`;
      }

      if (status === STATUS.changed) {
        const { to, from } = item;
        const oldValue = stringify(from, indentCount + leftShift, count);
        const newValue = stringify(to, indentCount + leftShift, count);

        return `${getIndent(indentCount)}${STYLISH_SYMBOLS.deleted} ${key}: ${oldValue}\n${getIndent(indentCount)}${STYLISH_SYMBOLS.added} ${key}: ${newValue}`;
      }

      return `${getIndent(indentCount)}${STYLISH_SYMBOLS[status]} ${key}: ${stringify(value, indentCount + leftShift, count)}`;
    });

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(tree, 1);
};

export default stylishFormatter;

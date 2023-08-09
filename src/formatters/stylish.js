import _ from 'lodash';

const stringify = (value, indent, stepCount) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indentCount = indent + stepCount;
  const repeatIndent = ' '.repeat(indentCount);
  const bracketIndent = ' '.repeat(indentCount - stepCount);

  const lines = Object.entries(value).map(([key, val]) => `${repeatIndent}${key}: ${stringify(val, indentCount, stepCount)}`);

  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

const stylishFormatter = (tree, count) => {
  const smbl = {
    added: '+',
    deleted: '-',
    unchanged: ' ',
  };

  const iter = (node, depth) => {
    const leftShift = 2;
    const indentCount = depth * count - leftShift;
    const repeatIndent = ' '.repeat(indentCount);
    const bracketIndent = ' '.repeat(indentCount + leftShift - count);

    const lines = node.map((item) => {
      const { key, status, value } = item;

      if (Object.hasOwn(item, 'children')) {
        const { children } = item;
        return `${repeatIndent}  ${key}: ${iter(children, depth + 1, count)}`;
      }

      if (status === 'changed') {
        const { to, from } = item;
        const oldValue = stringify(from, indentCount + leftShift, count);
        const newValue = stringify(to, indentCount + leftShift, count);

        return `${repeatIndent}${smbl.deleted} ${key}: ${oldValue}\n${repeatIndent}${smbl.added} ${key}: ${newValue}`;
      }

      return `${repeatIndent}${smbl[status]} ${key}: ${stringify(value, indentCount + leftShift, count)}`;
    });

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(tree, 1);
};

export default stylishFormatter;

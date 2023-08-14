import _ from 'lodash';
import { STATUS } from '../constants.js';

const updateValue = (value) => {
  const type = typeof value;

  if (type === 'string') {
    return `'${value}'`;
  }

  if (_.isObject(value)) {
    return '[complex value]';
  }

  return value;
};

const plainFormatter = (tree) => {
  const iter = (node, path) => {
    const lines = node
      .filter((item) => {
        const { status } = item;
        return status !== STATUS.unchanged;
      })
      .map((item) => {
        const { key } = item;
        if (Object.hasOwn(item, 'children')) {
          const { children } = item;
          return iter(children, [...path, key]);
        }

        const {
          status, value, from, to,
        } = item;
        const joinPath = [...path, key].join('.');

        switch (status) {
          case STATUS.added:
            return `Property '${joinPath}' was added with value: ${updateValue(value)}`;;
          case STATUS.deleted:
            return `Property '${joinPath}' was removed`;;
          default:
            return `Property '${joinPath}' was updated. From ${updateValue(from)} to ${updateValue(to)}`;
        }
      });

    return [...lines].join('\n');
  };

  return iter(tree, []);
};

export default plainFormatter;

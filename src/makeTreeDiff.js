import _ from 'lodash';
import { STATUS } from './constants.js';

const getSortUnionKeys = (obj1, obj2) => {
  const unionKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortKeys = _.sortBy((unionKeys), (key) => key);

  return sortKeys;
};

const getStatus = (obj1, obj2, key) => {
  if (!Object.hasOwn(obj1, key)) {
    return STATUS.added;
  }

  if (!Object.hasOwn(obj2, key)) {
    return STATUS.deleted;
  }

  if (obj1[key] !== obj2[key]) {
    return STATUS.changed;
  }

  return STATUS.unchanged;
};

const makeTreeDiff = (data1, data2) => {
  const tree = getSortUnionKeys(data1, data2).map((key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      return { key, children: makeTreeDiff(data1[key], data2[key]) };
    }

    const status = getStatus(data1, data2, key);

    switch (status) {
      case STATUS.changed:
        return {
          key, status, from: data1[key], to: data2[key],
        };
      case STATUS.added:
        return { key, status, value: data2[key] };
      default:
        return { key, status, value: data1[key] };
    }
  });

  return tree;
};

export default makeTreeDiff;

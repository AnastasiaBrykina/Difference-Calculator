import _ from 'lodash';

const makeTreeDiff = (data1, data2) => {
  const sortKeys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)), (key) => key);
  const tree = sortKeys.map((key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      return { key, children: makeTreeDiff(data1[key], data2[key]) };
    }

    if (!Object.hasOwn(data1, key)) {
      return { key, status: 'added', value: data2[key] };
    }

    if (!Object.hasOwn(data2, key)) {
      return { key, status: 'deleted', value: data1[key] };
    }

    if (data1[key] !== data2[key]) {
      return {
        key,
        status: 'changed',
        from: data1[key],
        to: data2[key],
      };
    }

    return { key, status: 'unchanged', value: data1[key] };
  });

  return tree;
};

export default makeTreeDiff;

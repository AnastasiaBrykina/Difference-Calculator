import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const parseContent = (content, type) => {
  let result;

  switch (type) {
    case '.json':
      result = JSON.parse(content);
      break;
    default:
      throw new Error('Unknown type');
  }

  return result;
};

const findDiff = (path1, path2) => {
  const absolutePath1 = path.resolve(path1);
  const absolutePath2 = path.resolve(path2);

  const contentFile1 = fs.readFileSync(path.resolve(path1), 'utf8');
  const contentFile2 = fs.readFileSync(path.resolve(path2), 'utf8');

  const data1 = parseContent(contentFile1, path.extname(absolutePath1));
  const data2 = parseContent(contentFile2, path.extname(absolutePath2));

  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const sortKeys = _.sortBy(keys, (key) => key[0]);

  const lines = sortKeys.map((key) => {
    if (!Object.hasOwn(data1, key)) {
      return ` + ${key}: ${data2[key]}`;
    }
    if (!Object.hasOwn(data2, key)) {
      return ` - ${key}: ${data1[key]}`;
    }
    if (data1[key] !== data2[key]) {
      return ` - ${key}: ${data1[key]}\n + ${key}: ${data2[key]}`;
    }
    return `   ${key}: ${data1[key]}`;
  });

  const result = `{\n${lines.join('\n')}\n}`;

  return result;
};

export default findDiff;
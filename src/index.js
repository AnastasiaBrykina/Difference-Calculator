import fs from 'fs';
import path from 'path';
import formatSelectioner from './formatters/index.js';
import parseContent from './parsers.js';
import makeTreeDiff from './makeTreeDiff.js';

const fileReader = (pathToFile) => {
  try {
    const content = fs.readFileSync(pathToFile, 'utf8');
    return content;
  } catch {
    throw new Error('path non-exist');
  }
};

const makeData = (pathToFile) => {
  const absolute = path.resolve(pathToFile);
  const content = fileReader(absolute);
  const data = parseContent(content, path.extname(absolute));

  return data;
};

const genDiff = (path1, path2, formatName = 'stylish') => {
  const treeDiff = makeTreeDiff(makeData(path1), makeData(path2));

  return formatSelectioner(treeDiff, formatName);
};

export default genDiff;
export { fileReader };

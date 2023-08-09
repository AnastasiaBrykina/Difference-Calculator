import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import genDiff, { fileReader } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

const expectedStylishResult = fileReader(getFixturePath('expectedStylishResult.txt'));
const expectedPlainResult = fileReader(getFixturePath('expectedPlainResult.txt'));

test('existing path-json', () => {
  const path1 = getFixturePath('recFile1.json');
  const path2 = getFixturePath('recFile2.json');
  expect(genDiff(path1, path2)).toEqual(expectedStylishResult);
  expect(genDiff(path1, path2, 'plain')).toEqual(expectedPlainResult);
});

test('existing path-yml', () => {
  const path1 = getFixturePath('recFile1.yml');
  const path2 = getFixturePath('recFile2.yml');
  expect(genDiff(path1, path2)).toEqual(expectedStylishResult);
  expect(genDiff(path1, path2, 'plain')).toEqual(expectedPlainResult);
});

test('non-existing path', () => {
  const path1 = getFixturePath('non-existing1.json');
  const path2 = getFixturePath('non-existing2.json');
  expect(() => {
    genDiff(path1, path2);
  }).toThrow('path non-exist');
});

test('unknown file type', () => {
  const path1 = getFixturePath('unknownFile1.xml');
  const path2 = getFixturePath('unknownFile2.xml');
  expect(() => {
    genDiff(path1, path2);
  }).toThrow('Unknown type');
});

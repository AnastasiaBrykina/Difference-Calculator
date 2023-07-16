import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('existing path', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');
  expect(genDiff(path1, path2)).toEqual(
    '{\n - follow: false\n   host: hexlet.io\n - proxy: 123.234.53.22\n - timeout: 50\n + timeout: 20\n + verbose: true\n}',
  );
});

test('non-existing path', () => {
  const path1 = getFixturePath('non-existing1.json');
  const path2 = getFixturePath('non-existing2.json');
  expect(() => {
    genDiff(path1, path2);
  }).toThrow('path non-exist');
});

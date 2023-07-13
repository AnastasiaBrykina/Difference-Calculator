#!/usr/bin/env node

import { program } from 'commander';
import findDiff from '../src/index.js';

const genDiff = (path1, path2) => findDiff(path1, path2);

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => {
    genDiff(filepath1, filepath2);
  });

program.parse();

export default genDiff;

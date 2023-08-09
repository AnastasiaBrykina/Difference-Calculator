import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

const formatSelectioner = (diffTree, format) => {
  switch (format) {
    case 'stylish':
      return stylishFormatter(diffTree, 4);
    case 'plain':
      return plainFormatter(diffTree);
    case 'json':
      return JSON.stringify(diffTree);
    default:
      throw new Error('Unknown format');
  }
};

export default formatSelectioner;

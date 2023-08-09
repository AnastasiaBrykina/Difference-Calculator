import { parse } from 'yaml';

const parseContent = (content, type) => {
  switch (type) {
    case '.json':
      return JSON.parse(content);
    case '.yml' || '.yaml':
      return parse(content);
    default:
      throw new Error('Unknown type');
  }
};

export default parseContent;

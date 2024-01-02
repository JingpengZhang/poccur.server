import * as fs from 'fs';

export class MarkdownService {
  constructor() {}

  async create(content: string, filePath: string) {
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

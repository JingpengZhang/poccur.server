import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export class MarkdownService {
  constructor() {}

  create(content: string, filePath: string) {
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    fs.writeFileSync(filePath, content, 'utf8');
  }

  write(content: string, filePath: string) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  read(filePath: string) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  deleteMarkdown(filePath: string) {
    try {
      fs.rmSync(filePath);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}

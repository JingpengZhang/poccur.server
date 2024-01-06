import * as fs from 'fs';
import { FileType } from '../../constants/file-type.enum';
import * as dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';

export class StorageService {
  public baseURL = './storage';
  public publicBaseURL = './public';

  public usersFolderPath = this.baseURL + '/userData';
  public articleFolderName = 'articles';
  public filesFolderName = 'files';

  constructor() {}

  getUserStoragePath(
    userId: number,
    fileType: FileType,
    withDateFolder = false,
  ) {
    if (!fs.existsSync(this.usersFolderPath))
      fs.mkdirSync(this.usersFolderPath);

    const userFolder = this.usersFolderPath + '/' + userId;
    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder);

    let path = userFolder;

    switch (fileType) {
      case FileType.Article:
        path += '/' + this.articleFolderName;
        break;
      default:
        path += '/' + this.filesFolderName;
    }

    if (!fs.existsSync(path)) fs.mkdirSync(path);

    if (withDateFolder) {
      path += '/' + dayjs().format('YYYYMMDD');
      if (!fs.existsSync(path)) fs.mkdirSync(path);
    }

    return path;
  }

  transferToPublicPath(storagePath: string) {
    return storagePath.replace(this.baseURL, this.publicBaseURL).substring(1);
  }

  getRandomString(size: number = 4) {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', size);
    return nanoid();
  }
}

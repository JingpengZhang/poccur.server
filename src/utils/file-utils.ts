import { FileType } from '../constants/file-type.enum';

const sizeOf = require('image-size');

class FileUtils {
  constructor() {}

  static splitFileNameAndExtension(filename: string) {
    let i = filename.lastIndexOf('.');
    let name = filename.substring(0, i);
    let extension = filename.substring(i + 1, filename.length);

    return {
      name,
      extension,
    };
  }

  static getFileExtension(filename: string) {
    return filename.split('.').pop();
  }

  static getFileTypeByExtension(extension: string) {
    let fileType: FileType = FileType.UNKNOWN;
    let _extension = extension.toLowerCase();
    switch (_extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
      case 'gif':
        fileType = FileType.Image;
        break;
      case 'mp4':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'avi':
      case 'avchd':
      case 'webm':
      case 'mkv':
        fileType = FileType.Video;
        break;
      case 'mp3':
      case 'wma':
      case 'wav':
      case 'ape':
      case 'flac':
      case 'ogg':
      case 'aac':
        fileType = FileType.Audio;
        break;
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
      case 'text':
      case 'json':
      case 'js':
      case 'ts':
      case 'php':
      case 'py':
      case 'java':
      case 'javac':
      case 'rua':
      case 'rs':
      case 'c':
        fileType = FileType.DOCUMENT;
        break;
      case 'zip':
      case '7z':
      case 'rar':
        fileType = FileType.ZIP;
        break;
    }

    return fileType;
  }

  static getFileStorageLocationByType(type: FileType) {
    let location = './storage';
    switch (type) {
      case FileType.Image:
        location += '/image';
        break;
      case FileType.Video:
        location += '/video';
        break;
      case FileType.Audio:
        location += '/audio';
        break;
      case FileType.DOCUMENT:
        location += '/document';
        break;
      case FileType.ZIP:
        location += '/zip';
        break;
      case FileType.UNKNOWN:
        location += '/other';
        break;
    }
    return location;
  }

  static getImageDimensions(imagePath: string) {
    return sizeOf(imagePath);
  }
}

export default FileUtils;

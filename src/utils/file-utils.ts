import { FileType } from '../constants/file-type.enum';
import { exec } from 'child_process';
const sizeOf = require('image-size');

class FileUtils {
  constructor() {}

  // 获取视频时长
  static getVideoTime(videoPath: string): Promise<number> {
    return new Promise((resolve) => {
      // 获取视频时长目录指令
      const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 ${videoPath}`;

      // 执行指令
      exec(cmd, (err, stdout, errout) => {
        if (!err) {
          // 返回时长
          resolve(parseFloat(stdout));
        } else {
          console.error(errout);
          resolve(0);
        }
      });
    });
  }

  // 获取音频时长
  static getAudioDuration(audioPath: string): Promise<number> {
    return new Promise((resolve) => {
      // 指令
      const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -i ${audioPath}`;

      // 执行指令
      exec(cmd, (err, stdout, errout) => {
        if (!err) {
          // 返回时长
          resolve(parseFloat(stdout));
        } else {
          console.error(errout);
          resolve(0);
        }
      });
    });
  }

  // 自动获取视频指定帧画面作为视频封面
  static generateVideoThumb(
    videoPath: string,
    thumbSavePath: string,
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // 获取视频时长
      const duration = await FileUtils.getVideoTime(videoPath);

      // 视频截取时间点
      const sec = duration > 5 ? 5 : duration / 2;

      // 生成封面指令
      const cmd = `ffmpeg -i ${videoPath} -y -f image2 -ss ${sec} -frames 1 ${thumbSavePath}`;

      // 执行指令
      exec(cmd, (err, _, errout) => {
        if (!err) {
          resolve(thumbSavePath);
        } else {
          console.error(errout);
          reject(errout);
        }
      });
    });
  }

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

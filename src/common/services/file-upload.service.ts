import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ensureDir } from 'fs-extra';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = 'uploads';

  constructor() {
    this.initializeUploadDirectory();
  }

  private async initializeUploadDirectory() {
    await ensureDir(this.uploadDir);
    await ensureDir(path.join(this.uploadDir, 'avatars'));
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const hash = crypto.createHash('md5').update(`${originalName}${timestamp}`).digest('hex');
    const ext = path.extname(originalName);
    return `${hash}${ext}`;
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    const fileName = this.generateFileName(file.originalname);
    const filePath = path.join(this.uploadDir, 'avatars', fileName);
    
    await fs.writeFile(filePath, file.buffer);
    
    return `/avatars/${fileName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath.replace(/^\//, ''));
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

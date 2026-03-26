import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export function getThumbFilename(filename: string, width: number, height: number): string {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const safeExt = ext.length > 0 ? ext : '.jpg';
  return `${base}-${width}x${height}${safeExt}`;
}

export function getInputImagePath(filename: string): string {
  return path.join(process.cwd(), 'assets', 'full', filename);
}

export function getThumbPath(filename: string, width: number, height: number): string {
  const thumbFilename = getThumbFilename(filename, width, height);
  return path.join(process.cwd(), 'assets', 'thumbs', thumbFilename);
}

export type ResizeImageArgs = {
  inputPath: string;
  outputPath: string;
  width: number;
  height: number;
};

export async function resizeImage(args: ResizeImageArgs): Promise<void> {
  await sharp(args.inputPath)
    .resize(args.width, args.height, { fit: 'fill' })
    .toFile(args.outputPath);
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

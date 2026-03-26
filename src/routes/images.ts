import fs from 'fs';
import path from 'path';
import { Router, type Request, type Response } from 'express';
import {
  getInputImagePath,
  getThumbFilename,
  getThumbPath,
  resizeImage,
} from '../utilities/imageProcessor';

interface ImageResizeRequestBody {
  filename: string;
  width: number;
  height: number;
}

interface ImageResizeResponseBody {
  cached: boolean;
  thumbFilename: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function isValidFilename(value: string): boolean {
  if (value !== path.basename(value)) return false;
  return /^[a-zA-Z0-9._-]+$/.test(value);
}

function isImageResizeRequestBody(value: unknown): value is ImageResizeRequestBody {
  if (typeof value !== 'object' || value === null) return false;
  const maybeBody = value as { filename?: unknown; width?: unknown; height?: unknown };
  return (
    isNonEmptyString(maybeBody.filename) &&
    isValidFilename(maybeBody.filename) &&
    isPositiveInteger(maybeBody.width) &&
    isPositiveInteger(maybeBody.height)
  );
}

const imagesRouter = Router();

imagesRouter.post(
  '/images',
  async (
    req: Request<Record<string, never>, ImageResizeResponseBody, unknown>,
    res: Response<ImageResizeResponseBody>,
  ) => {
    if (!isImageResizeRequestBody(req.body)) {
      res.status(400).json({ cached: false, thumbFilename: '' });
      return;
    }

    const { filename, width, height } = req.body;

    const inputPath = getInputImagePath(filename);
    const thumbFilename = getThumbFilename(filename, width, height);
    const thumbPath = getThumbPath(filename, width, height);

    // Ensure the cache directory exists.
    await fs.promises.mkdir(path.dirname(thumbPath), { recursive: true });

    const inputExists = fs.existsSync(inputPath);
    if (!inputExists) {
      res.status(404).json({ cached: false, thumbFilename });
      return;
    }

    // Caching: check if the resized image already exists in assets/thumbs before processing.
    const cached = fs.existsSync(thumbPath);
    if (!cached) {
      await resizeImage({ inputPath, outputPath: thumbPath, width, height });
    }

    res.status(200).json({ cached, thumbFilename });
  },
);

export { imagesRouter };

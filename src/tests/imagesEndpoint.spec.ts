import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import request from 'supertest';
import { app } from '../app';
import {
  fileExists,
  getInputImagePath,
  getThumbFilename,
  getThumbPath
} from '../utilities/imageProcessor';

interface ImageResizeResponseBody {
  cached: boolean;
  thumbFilename: string;
}

describe('Image resize API', () => {
  const filename = 'original.png';
  const inputWidth = 40;
  const inputHeight = 30;
  const width = 10;
  const height = 8;

  const inputPath = getInputImagePath(filename);
  const thumbPath = getThumbPath(filename, width, height);

  beforeAll(async () => {
    await fs.promises.mkdir(path.dirname(inputPath), { recursive: true });
    await fs.promises.mkdir(path.dirname(thumbPath), { recursive: true });

    const thumbAlreadyExists = await fileExists(thumbPath);
    if (thumbAlreadyExists) {
      await fs.promises.unlink(thumbPath);
    }

    await sharp({
      create: {
        width: inputWidth,
        height: inputHeight,
        channels: 3,
        background: { r: 0, g: 128, b: 0 }
      }
    })
      .png()
      .toFile(inputPath);
  });

  it('processes and caches the resized thumb in assets/thumbs/', async () => {
    const requestBody: { filename: string; width: number; height: number } = {
      filename,
      width,
      height
    };

    const response1 = await request(app)
      .post('/api/images')
      .send(requestBody)
      .set('Content-Type', 'application/json');

    const body1 = response1.body as unknown as ImageResizeResponseBody;
    expect(response1.status).toBe(200);
    expect(body1.cached).toBe(false);
    expect(body1.thumbFilename).toBe(getThumbFilename(filename, width, height));
    expect(await fileExists(thumbPath)).toBe(true);

    const stat1 = await fs.promises.stat(thumbPath);
    expect(stat1.isFile()).toBe(true);

    const metadata1 = await sharp(thumbPath).metadata();
    expect(metadata1.width).toBe(width);
    expect(metadata1.height).toBe(height);

    const response2 = await request(app)
      .post('/api/images')
      .send(requestBody)
      .set('Content-Type', 'application/json');

    const body2 = response2.body as unknown as ImageResizeResponseBody;
    expect(response2.status).toBe(200);
    expect(body2.cached).toBe(true);

    const stat2 = await fs.promises.stat(thumbPath);
    expect(stat2.isFile()).toBe(true);
    expect(stat2.mtimeMs).toBe(stat1.mtimeMs);
  });
});


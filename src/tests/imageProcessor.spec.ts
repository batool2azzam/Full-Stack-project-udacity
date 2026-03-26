import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { resizeImage } from '../utilities/imageProcessor';

describe('Sharp resizing utility', () => {
  it('resizes an image to the requested width and height', async () => {
    const tmpRoot = path.join(process.cwd(), 'assets', 'thumbs', '__unit_test__');
    const inputPath = path.join(tmpRoot, 'input.png');
    const outputPath = path.join(tmpRoot, 'output.png');

    const inputWidth = 25;
    const inputHeight = 10;
    const width = 12;
    const height = 7;

    await fs.promises.mkdir(tmpRoot, { recursive: true });

    await sharp({
      create: {
        width: inputWidth,
        height: inputHeight,
        channels: 3,
        background: { r: 20, g: 20, b: 200 },
      },
    })
      .png()
      .toFile(inputPath);

    await resizeImage({ inputPath, outputPath, width, height });

    const outputExists = await fs.promises
      .access(outputPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    expect(outputExists).toBe(true);

    const metadata = await sharp(outputPath).metadata();
    expect(metadata.width).toBe(width);
    expect(metadata.height).toBe(height);
  });
});

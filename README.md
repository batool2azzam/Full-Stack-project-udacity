# TypeScript Image Processing API

Express + TypeScript API that resizes images with Sharp and caches resized output in `assets/thumbs/`.

## Project structure

- Source images: `assets/full/`
- Cached resized images: `assets/thumbs/`
- TypeScript source: `src/`
- Compiled JavaScript: `dist/`

## Scripts

- `npm run start`: run compiled app from `dist/server.js`
- `npm run build`: compile TypeScript from `src` to `dist`
- `npm run test`: run Jasmine test suite (unit + endpoint tests)
- `npm run lint`: run ESLint on `src/**/*.ts`
- `npm run format`: format code and config files with Prettier

## Setup and run

```bash
npm install
npm run build
npm run start
```

## API

- `POST /api/images`
  - Body fields:
    - `filename` (string): file name that must exist in `assets/full/`
    - `width` (number): positive integer
    - `height` (number): positive integer
  - Behavior:
    - checks if resized image already exists in `assets/thumbs/`
    - if cached, returns without resizing
    - if not cached, resizes with Sharp and stores new file in `assets/thumbs/`
  - Status codes:
    - `200`: processed or fetched from cache
    - `400`: invalid request body (`filename`, `width`, or `height`)
    - `404`: source image not found in `assets/full/`

Example:

```bash
curl -X POST http://localhost:3000/api/images \
  -H "Content-Type: application/json" \
  -d '{"filename":"original.png","width":200,"height":200}'
```

Example response:

```json
{
  "cached": false,
  "thumbFilename": "original-200x200.png"
}
```

## Test and quality checks

```bash
npm run format
npm run lint
npm run test
```

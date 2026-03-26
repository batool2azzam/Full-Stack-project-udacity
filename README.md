# TypeScript Image Processing API

Express + TypeScript API that resizes images with Sharp and caches results in `assets/thumbs/`.

## Setup

```bash
npm install
```

## Scripts

```bash
npm run build
npm run start
npm test
npm run lint
npm run format
```

## API

- `POST /api/images`
  - Body:
    - `filename` (string): original image name in `assets/full/`
    - `width` (number): positive integer
    - `height` (number): positive integer

Example:

```bash
curl -X POST http://localhost:3000/api/images \
  -H "Content-Type: application/json" \
  -d '{"filename":"original.png","width":200,"height":200}'
```

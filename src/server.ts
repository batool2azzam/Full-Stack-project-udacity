import { app } from './app';

const portValue = process.env.PORT;
const port = portValue ? Number(portValue) : 3000;

if (!Number.isFinite(port) || port <= 0) {
  throw new Error(`Invalid PORT value: ${portValue ?? '(not set)'}`);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

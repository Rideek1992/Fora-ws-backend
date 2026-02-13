// @ts-ignore
import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/health', (_, res) => res.send('OK'))



export default app;
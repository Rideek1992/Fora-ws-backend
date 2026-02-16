
import express from 'express';
import router from "./routes/index";
import helmet from "helmet";
import cors from "cors";


const app = express();

app.use(cors({
    origin: ['https://fora-ws.pl','http://localhost:4200'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

app.use(helmet());

app.use('/api', router);

export default app;
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const POST = process.env.PORT || 3001;



app.listen(POST, () => console.log(`Server running on port ${POST}`));
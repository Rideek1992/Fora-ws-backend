import dotenv from 'dotenv';
dotenv.config();
import app from './app';



const POST = process.env.PORT || 3001;



app.listen(POST, () => console.log(`Server running on port ${POST}`));
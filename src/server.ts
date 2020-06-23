import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Hello GoStack.' }));

app.listen(3333, () => {
  console.log('Server running on port 3333. 🏍 💨');
});

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/analyze', analyzeRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

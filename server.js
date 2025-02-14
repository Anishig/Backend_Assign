const express = require('express');
const identifyRoute = require('./routes/identify');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', identifyRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
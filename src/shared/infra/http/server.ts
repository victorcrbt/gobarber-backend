import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';
import routes from './routes';
import exceptionHandler from './middlewares/exceptionHandler';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);
app.use(exceptionHandler);

const PORT = 3333;

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

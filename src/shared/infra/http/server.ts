import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppErros';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const server = express();

server.use(cors());
server.use(express.json());
server.use('/files', express.static(uploadConfig.uploadsFolder));
server.use(routes);

server.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'err',
      message: err.message,
    });
  }

  console.log(err);

  return res.status(500).json({
    status: 'err',
    message: 'Internal server error',
  });
});

server.listen(3333);

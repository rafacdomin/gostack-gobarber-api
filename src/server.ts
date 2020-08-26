import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppErros';

import './database';

const server = express();

server.use(express.json());
server.use('/files', express.static(uploadConfig.directory));
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

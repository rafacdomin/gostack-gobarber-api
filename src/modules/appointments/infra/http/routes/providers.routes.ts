import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';
import ProvidersController from '../controllers/ProvidersController';
import MonthAvailabilityController from '../controllers/MonthAvailabilityController';
import DayAvailabilityController from '../controllers/DayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const monthAvailabilityController = new MonthAvailabilityController();
const dayAvailabilityController = new DayAvailabilityController();

providersRouter.use(ensureAuth);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  monthAvailabilityController.index,
);
providersRouter.get(
  '/:id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  dayAvailabilityController.index,
);

export default providersRouter;

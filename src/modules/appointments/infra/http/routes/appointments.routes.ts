import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentRouter.use(ensureAuth);

// appointmentRouter.get('/', async (req, res) => {
//   const appointmentRepository = new AppointmentRepository();

//   const appointments = await appointmentRepository.find();

//   return res.json(appointments);
// });

appointmentRouter.post('/', appointmentsController.create);

export default appointmentRouter;

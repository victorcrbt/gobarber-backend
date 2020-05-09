import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const routes = Router();
const appoinmentController = new AppointmentController();

routes.use(ensureAuthenticated);

routes.post('/', appoinmentController.create);

export default routes;

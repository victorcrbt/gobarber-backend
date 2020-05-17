import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const routes = Router();
const appoinmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsController();

routes.use(ensureAuthenticated);

routes.post('/', appoinmentController.create);
routes.get('/me', providerAppointmentsController.index);

export default routes;

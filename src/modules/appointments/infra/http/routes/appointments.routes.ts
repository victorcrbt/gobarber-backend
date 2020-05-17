import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const routes = Router();
const appoinmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsController();

routes.use(ensureAuthenticated);

routes.post(
  '/',
  celebrate(
    {
      [Segments.BODY]: {
        provider_id: Joi.string().uuid().required(),
        date: Joi.date(),
      },
    },
    { abortEarly: false }
  ),
  appoinmentController.create
);
routes.get('/me', providerAppointmentsController.index);

export default routes;

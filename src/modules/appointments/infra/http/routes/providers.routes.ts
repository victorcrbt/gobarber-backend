import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';

const routes = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

routes.use(ensureAuthenticated);

routes.get('/', providersController.index);

routes.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index
);
routes.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index
);

export default routes;

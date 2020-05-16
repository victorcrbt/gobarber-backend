import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

const routes = Router();
const providersController = new ProvidersController();

routes.use(ensureAuthenticated);

routes.get('/', providersController.index);

export default routes;

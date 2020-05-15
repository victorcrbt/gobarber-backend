import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
const profileController = new ProfileController();

routes.use(ensureAuthenticated);

routes.put('/', profileController.update);
routes.get('/', profileController.show);

export default routes;

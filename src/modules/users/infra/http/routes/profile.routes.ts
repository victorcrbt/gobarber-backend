import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
const profileController = new ProfileController();

routes.use(ensureAuthenticated);

routes.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.when('old_password', {
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }),
      password_confirmation: Joi.when('old_password', {
        then: Joi.string().required().valid(Joi.ref('password')),
        otherwise: Joi.string(),
      }),
    },
  }),
  profileController.update
);
routes.get('/', profileController.show);

export default routes;

import { Router } from 'express';

import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController';
import ResetPasswordController from '@modules/users/infra/http/controllers/ResetPasswordController';

const routes = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

routes.post('/forgot', forgotPasswordController.create);
routes.post('/reset', resetPasswordController.create);

export default routes;

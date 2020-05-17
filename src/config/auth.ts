export default {
  jwt: {
    secret: process.env.APP_JWT_SECRET,
    expiresIn: '1d',
  },
};

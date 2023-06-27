import { Api } from '../swagger/Bot';

export default new Api({
  baseUrl: process.env['REST_SERVER'],
});

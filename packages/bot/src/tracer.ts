import tracer from 'dd-trace';
tracer.init({
  logInjection: process.env['NODE_ENV'] === 'production',
  service: 'bot',
  env: process.env['NODE_ENV'],
  version: process.env['SHA1'],
});
tracer.use('graphql');
export default tracer;

import tracer from 'dd-trace';
const mytracer = tracer.init({
  logInjection: true,
  env: process.env['NODE_ENV'],
  service: 'bot',
});
mytracer.use('bunyan', {
  enabled: true,
  service: 'bot',
});

export default mytracer;

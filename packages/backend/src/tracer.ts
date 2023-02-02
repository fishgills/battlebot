import tracer from 'dd-trace';
const mytracer = tracer.init({
  logInjection: true,
  env: process.env['NODE_ENV'],
  service: 'server',
});
mytracer.use('bunyan', {
  enabled: true,
  service: 'server',
});

mytracer.use('graphql');
export default mytracer;

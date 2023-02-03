import tracer from 'dd-trace';
const mytracer = tracer.init({
  logInjection: true,
  env: process.env['NODE_ENV'],
  service: 'backend',
});
mytracer.use('bunyan', {
  enabled: true,
  service: 'backend',
});

mytracer.use('graphql');
export default mytracer;

import tracer from 'dd-trace';
const mytracer = tracer.init({
  env: process.env['NODE_ENV'],
  service: 'server',
});
mytracer.use('graphql');

export default tracer;

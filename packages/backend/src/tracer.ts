import tracer from 'dd-trace';
tracer.init({
  logInjection: process.env['NODE_ENV'] === 'production',
  service: 'backend',
  env: process.env['NODE_ENV'],
  version: process.env['SHA1'],
});
tracer.use('mysql2');
tracer.use('graphql');
export default tracer;

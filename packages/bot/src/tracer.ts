import tracer from 'dd-trace';
// const mytracer = tracer.init({
//   logInjection: true,
//   env: process.env['NODE_ENV'],
//   service: 'bot',
// });
// mytracer.use('bunyan', {
//   enabled: true,
//   service: 'bot',
// });
// mytracer.use('graphql');
tracer.init({
  logInjection: true,
  service: 'bot',
  env: process.env['NODE_ENV'],
});
export default tracer;

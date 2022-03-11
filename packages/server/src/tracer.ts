import tracer from 'dd-trace';
if (process.env.NODE_ENV === 'production') {
  const mytracer = tracer.init({
    env: process.env['NODE_ENV'],
    service: 'server',
  });
  mytracer.use('graphql');
}

export default tracer;

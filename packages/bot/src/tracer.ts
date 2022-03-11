import tracer from 'dd-trace';
if (process.env.NODE_ENV === 'production') {
  tracer.init({
    env: process.env['NODE_ENV'],
    service: 'bot',
  });
}

export default tracer;

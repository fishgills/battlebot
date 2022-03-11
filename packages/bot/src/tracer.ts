import tracer from 'dd-trace';
import axios from 'axios';

// const getGitVersion = () => execSync('git rev-parse HEAD').toString().trim();

// initialized in a different file to avoid hoisting.
if (process.env.NODE_ENV === 'production') {
  const mytracer = tracer.init({
    env: process.env['NODE_ENV'],
    service: 'bot',
  });

  axios
    .get('http://169.254.169.254/latest/meta-data/local-ipv4')
    .then((resp) => {
      console.log('Got IPV4 Info: ', JSON.stringify(resp));
      mytracer.setUrl(`http://${resp.data}:8126`);
    });
}

export default tracer;

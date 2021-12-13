import tracer from 'dd-trace';

import { execSync } from 'child_process';

// const getGitVersion = () => execSync('git rev-parse HEAD').toString().trim();

// initialized in a different file to avoid hoisting.
if (process.env.NODE_ENV === 'production') {
  tracer.init({
    env: process.env['DD_ENV'],
    service: 'GraphQL',
    // version: getGitVersion(),
  });
  tracer.use('graphql');
}

export default tracer;

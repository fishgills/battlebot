import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import got from 'got';
import { fileURLToPath } from 'url';
import * as envfile from 'envfile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestFile = path.join(__dirname, 'manifest.json');
const envFile = path.normalize(path.join(__dirname, '../../', '.env'));
console.log(envFile);
console.log(manifestFile);

function updateRefreshToken(token) {
  let parsedFile = envfile.parse(fs.readFileSync(envFile));
  parsedFile.SLACK_REFRESH_TOKEN = token;
  let newContents = envfile.stringify(parsedFile);
  fs.writeFileSync(envFile, newContents);
}

async function main() {
  console.log('Rotataing token');
  const resp = await got
    .get('https://slack.com/api/tooling.tokens.rotate', {
      searchParams: {
        refresh_token: process.env.SLACK_REFRESH_TOKEN
      }
    })
    .json();
  if (!resp.ok) {
    throw new Error(resp.error);
  }
  const token = resp.token;
  console.log('Writing new token');
  updateRefreshToken(resp.refresh_token);
  console.log('Validating new manifest');
  let manifest = fs.readFileSync(manifestFile, 'utf-8');
  const validResp = await got
    .post('https://slack.com/api/apps.manifest.validate', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`
      },
      json: {
        manifest
      }
    })
    .json();

  if (!validResp.ok) {
    console.log(validResp.errors);
    throw new Error(validResp.errors.join('\n'));
  }

  console.log('Updating manifest');
  const updateResp = await got
    .post('https://slack.com/api/apps.manifest.update', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`
      },
      json: {
        manifest,
        app_id: process.env.SLACK_APP_ID
      }
    })
    .json();
  if (!updateResp.ok) {
    throw new Error(updateResp.errors);
  }
}

(async () => {
  main();
})();

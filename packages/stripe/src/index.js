const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env['STRIPE_KEY']);
const { Not, IsNull } = require('typeorm');
const typeorm = require('typeorm');
let cycle_stop = false;
let timer;
let connection;
let repo;
let charRepo;
const database = {
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'botdb',
  host: process.env.DB_HOST,
  port: 3306,
  dropSchema: false,
  synchronize: false,
  migrationsRun: false,
  logging: true,
  cache: true,
  entities: [require('./install.entity'), require('./character.entity')],
};

// process.on('SIGTERM', () => {
//   console.log('stopping');
//   cycle_stop = true;
//   clearTimeout(timer);
// });

const runTask = async () => {
  console.log('aasdf');
  const installs = await repo.find({
    where: {
      stripeId: Not(IsNull()),
    },
  });
  installs.forEach(async (install) => {
    const charCount = await charRepo.findAndCount({
      teamId: install.team_id,
    });
    console.log(charCount);
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      'si_LCT9q4LTRpWoUX',
      { quantity: 100, timestamp: 1571252444 },
    );
  });
  console.log(installs);
};

const cycle = () => {
  timer = setTimeout(() => {
    runTask().then();
    if (!cycle_stop) cycle();
  }, process.env['INTERVAL']);
};

(async () => {
  connection = await typeorm.createConnection(database);
  repo = connection.getRepository('Install');
  charRepo = connection.getRepository('Character');
  cycle();
})().then();

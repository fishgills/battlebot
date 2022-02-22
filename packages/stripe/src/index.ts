import dotenv from 'dotenv';
dotenv.config();

let cycle_stop = false;
let timer: NodeJS.Timeout;

process.on('SIGTERM', () => {
  console.log('stopping');
  cycle_stop = true;
  clearTimeout(timer);
});

const runTask = () => {
  console.log('aasdf');
};

const cycle = () => {
  timer = setTimeout(() => {
    runTask();
    if (!cycle_stop) cycle();
  }, process.env['INTERVAL'] as unknown as number);
};

cycle();

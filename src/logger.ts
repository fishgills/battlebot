import winston from 'winston';
import colorizeJson from 'json-colorizer';
import chalk from 'chalk';
import dateFormat from 'dateformat';

const logFormat = winston.format.printf((info) => {
  const date = new Date();
  const dateSttring = `${chalk.gray(dateFormat(date, 'isoUtcDateTime'))}`;
  return `${dateSttring}-${info.level}: ${colorizeJson(
    JSON.stringify(info.message, null, 2),
  )}`;
});

export default winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        logFormat,
      ),
    }),
  ],
});

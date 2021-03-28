import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  host: 'battlebot.cr3pgaa5yxmd.us-west-2.rds.amazonaws.com',
  username: 'admin',
  password: 'battlebot',
  database: 'battlebot',
  dialect: 'mysql',
});

export default sequelize;

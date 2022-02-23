var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Install',
  tableName: 'slack_install_model',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    team_id: {
      type: 'varchar',
    },
    stripeId: {
      type: 'varchar',
    },
  },
});

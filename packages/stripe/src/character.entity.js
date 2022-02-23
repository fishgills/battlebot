var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Character',
  tableName: 'character_model',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      generated: true,
    },
    teamId: {
      type: 'varchar',
    },
  },
});

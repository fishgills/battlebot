import logger from '../logger';
import Abilities from './abilities';
import Character from './character';

logger.debug('Creating relationships');

const createRelationships = () => {
  Character.hasOne(Abilities, {
    sourceKey: 'id',
    foreignKey: 'abilitiesId',
    as: 'abilities',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Abilities.belongsTo(Character, {
    foreignKey: 'abilitiesId',
    targetKey: 'id',
  });
};

export default createRelationships;

import './config';
import './tracer';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer, createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { CharacterResolver } from './resolvers/character.resolver';
import { Character } from './entities/character';
import { Context } from 'apollo-server-core';
import { Participant } from './entities/participant';
import { ParticipantResolver } from './resolvers/participant.resolver';
import { Battle } from './entities/battle';
import { BattleResolver } from './resolvers/battle.resolver';
import { Combat } from './entities/combat';
import { CombatResolver } from './resolvers/combat.resolver';

useContainer(Container);

async function bootstrap() {
  try {
    await createConnection({
      type: 'mysql',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'botdb',
      host: process.env.DB_HOST,
      port: 3306,
      dropSchema: false,
      synchronize: true,
      logging: true,
      entities: [Character, Participant, Battle, Combat],
      cache: true,
    });

    const schema = await buildSchema({
      resolvers: [
        CharacterResolver,
        ParticipantResolver,
        BattleResolver,
        CombatResolver,
      ],
      container: Container,
    });

    const context: Context = {};

    const server = new ApolloServer({ schema, context, introspection: true });
    const { url } = await server.listen(4000);
    console.log(`Server running: ${url}`);
  } catch (err) {
    console.error(err);
  }
}
(async () => {
  await bootstrap();
})();

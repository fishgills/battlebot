import { gql } from 'graphql-request';
import { Blocks, HomeTab, HomeTabBuilder } from 'slack-block-builder';
import {
  AllowedDirections,
  CharacterType,
  RewardScore,
} from '../generated/graphql';
import { t } from '../locale';
import { client, sdk } from '../utils/gql';
import { characterSheetBlocks } from './character';

const characterStats = (character: CharacterType, home: HomeTabBuilder) => {
  character.active = true;
  home.blocks(
    ...characterSheetBlocks(character),
    Blocks.Section().fields([
      '*Meetings Called*',
      character.attacking.length + '',
      '*Meetings Attended*',
      character.defending.length + '',
    ]),
  );
};

const rewardScores = (
  toScoreBoard: RewardScore[],
  fromScoreBoard: RewardScore[],
  home: HomeTabBuilder,
) => {
  const rewardScoreReduce = (prev, curr, index, arr) => {
    prev.push(`${index + 1}) <@${curr.userId}>`, curr.count + '');
    return prev;
  };

  home.blocks(
    Blocks.Section({
      text: `*${t('received_reward_score_board')}*`,
    }),
    Blocks.Divider(),
    Blocks.Section().fields(
      toScoreBoard.reduce<Array<string>>(rewardScoreReduce, []),
    ),
    Blocks.Section({
      text: '*Given Rewards Scoreboard*',
    }),
    Blocks.Divider(),
    Blocks.Section().fields(
      fromScoreBoard.reduce<Array<string>>(rewardScoreReduce, []),
    ),
  );
};

export const homePage = async (teamId: string, userId: string) => {
  const { ScoreBoard: toScoreBoard } = await sdk.ScoreBoard({
    input: {
      teamId: teamId,
      direction: AllowedDirections.To,
    },
  });
  const { ScoreBoard: fromScoreBoard } = await sdk.ScoreBoard({
    input: {
      teamId: teamId,
      direction: AllowedDirections.From,
    },
  });

  const { findByOwner: character } = await client.request(
    gql`
      query OwnerCharacter($owner: String!, $teamId: String) {
        findByOwner(owner: $owner, teamId: $teamId) {
          defending {
            id
          }
          attacking {
            id
          }
          xp
          hp
          gold
          level
          vitality
          defense
          strength
          id
          name
        }
      }
    `,
    {
      owner: userId,
      teamId: teamId,
    },
  );

  const home = HomeTab();

  home.callbackId('home-tab');
  home.externalId(`home-${teamId}`);
  characterStats(character, home);
  rewardScores(toScoreBoard, fromScoreBoard, home);

  return home.buildToObject();
};

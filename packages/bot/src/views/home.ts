import gql from 'graphql-tag';
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
  home.blocks(
    ...characterSheetBlocks(character),
    Blocks.Section({
      text: t('battle_stats'),
    }),
    Blocks.Section().fields([
      t('leaderboard_attacks'),
      character.attacking.length + '',
      t('leaderboard_defends'),
      character.defending.length + '',
    ]),
  );
};

const rewardScores = (
  toScoreBoard: RewardScore[],
  fromScoreBoard: RewardScore[],
  home: HomeTabBuilder,
) => {
  const rewardScoreReduce = (
    prev: string[],
    curr: RewardScore,
    index: number,
  ) => {
    prev.push(`${index + 1}) <@${curr.userId}>`, curr.count + '');
    return prev;
  };

  const fromScoreBlocks = fromScoreBoard.reduce<Array<string>>(
    rewardScoreReduce,
    [],
  );
  const toScoreBlocks = toScoreBoard.reduce<Array<string>>(
    rewardScoreReduce,
    [],
  );
  home.blocks(
    Blocks.Divider(),
    Blocks.Section({
      text: t('received_reward_score_board', t('reward_emoji')),
    }),

    Blocks.Section().fields(toScoreBlocks.length > 0 ? toScoreBlocks : 'None'),
    Blocks.Divider(),
    Blocks.Section({
      text: t('given_reward_score_board', t('reward_emoji')),
    }),
    Blocks.Section().fields(
      fromScoreBlocks.length > 0 ? fromScoreBlocks : 'None',
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

  const { data } = (await client.query({
    variables: {
      owner: userId,
      teamId: teamId,
    },
    query: gql`
      query characterByOwner($owner: String!, $teamId: String!) {
        findByOwner(owner: $owner, teamId: $teamId) {
          defense
          vitality
          strength
          name
          xp
          rolls
          hp
          level
          owner
          id
          created_at
          gold
          teamId
          updated_at
          extraPoints
          active
          attacking {
            id
          }
          defending {
            id
          }
        }
      }
    `,
  })) as any;

  const home = HomeTab();

  home.callbackId('home-tab');
  home.externalId(`home-${teamId}`);
  if (data) {
    characterStats(data.findByOwner, home);
  }
  rewardScores(toScoreBoard, fromScoreBoard, home);

  return home.buildToObject();
};

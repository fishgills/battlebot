import { Blocks, HomeTab, HomeTabBuilder } from 'slack-block-builder';
import {
  AllowedDirections,
  CharacterType,
  RewardScore,
} from '../generated/graphql';
import { t } from '../locale';
import { sdk } from '../utils/gql';
import { characterSheetBlocks } from './character';

const characterStats = (
  character: Omit<CharacterType, 'attacking' | 'defending'> & {
    defending?: { __typename?: 'CombatModel'; id: string }[];
    attacking?: { __typename?: 'CombatModel'; id: string }[];
  },
  home: HomeTabBuilder,
) => {
  home.blocks(
    ...characterSheetBlocks(character as CharacterType),
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

  const fromScoreBlocks = fromScoreBoard.reduce<Array<string>>(
    rewardScoreReduce,
    [],
  );
  const toScoreBlocks = toScoreBoard.reduce<Array<string>>(
    rewardScoreReduce,
    [],
  );
  home.blocks(
    Blocks.Section({
      text: `*${t('received_reward_score_board')}*`,
    }),
    Blocks.Divider(),
    Blocks.Section().fields(toScoreBlocks.length > 0 ? toScoreBlocks : 'None'),
    Blocks.Section({
      text: '*Given Rewards Scoreboard*',
    }),
    Blocks.Divider(),
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

  const { findByOwner: character } = await sdk.characterByOwner({
    owner: userId,
    teamId,
    withCombats: true,
  });

  const home = HomeTab();

  home.callbackId('home-tab');
  home.externalId(`home-${teamId}`);
  characterStats(character, home);
  rewardScores(toScoreBoard, fromScoreBoard, home);

  return home.buildToObject();
};

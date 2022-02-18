import {
  Blocks,
  HomeTab,
  HomeTabBuilder,
  Section,
  SectionBuilder,
  user,
} from 'slack-block-builder';
import { AllowedDirections } from '../generated/graphql';
import { sdk } from '../utils/gql';
import { numToEmoji } from '../utils/helpers';

const userStats = async (
  teamId: string,
  home: HomeTabBuilder,
  userId: string,
) => {
  const { findByOwner } = await sdk.characterByOwner({
    owner: userId,
    teamId: teamId,
  });
  // home.blocks(
  //   Blocks.Section().fields(),
  // );
};

const scoreBoard = async (teamId: string, home: HomeTabBuilder) => {
  const { ScoreBoard } = await sdk.ScoreBoard({
    input: {
      teamId,
      direction: AllowedDirections.To,
    },
  });

  home.blocks(
    Blocks.Section({
      text: '*Received Rewards Scoreboard*',
    }),
    Blocks.Divider(),
    ScoreBoard.map((score, index) => {
      return Blocks.Section({
        text: `${index + 1}) <@${score.userId}> ${numToEmoji(score.count)}`,
      });
    }),
  );
};

export const homePage = async (teamId: string, userId: string) => {
  const home = HomeTab();

  home.callbackId('home-tab');
  home.externalId(`home-${teamId}`);
  await userStats(teamId, home, userId);
  await scoreBoard(teamId, home);

  return home.buildToObject();
};

// import { Blocks, HomeTab, HomeTabBuilder } from 'slack-block-builder';

// import { t } from '../locale';
// import { characterSheetBlocks } from './character';
// import { CharacterEntity, RewardEntity, RewardScore } from '../swagger/Bot';
// import api from '../utils/api';

// const characterStats = (character: CharacterEntity, home: HomeTabBuilder) => {
//   home.blocks(
//     ...characterSheetBlocks(character),
//     Blocks.Section({
//       text: t('battle_stats'),
//     }),
//     Blocks.Section().fields([
//       t('leaderboard_attacks'),
//       character.attacking.length + '',
//       t('leaderboard_defends'),
//       character.defending.length + '',
//     ]),
//   );
// };

// const rewardScores = (
//   toScoreBoard: RewardScore[],
//   fromScoreBoard: RewardScore[],
//   home: HomeTabBuilder,
// ) => {
//   const rewardScoreReduce = (
//     prev: string[],
//     curr: RewardScore,
//     index: number,
//   ) => {
//     prev.push(`${index + 1}) <@${curr.userId}>`, curr.count + '');
//     return prev;
//   };

//   const fromScoreBlocks = fromScoreBoard.reduce<Array<string>>(
//     rewardScoreReduce,
//     [],
//   );
//   const toScoreBlocks = toScoreBoard.reduce<Array<string>>(
//     rewardScoreReduce,
//     [],
//   );
//   home.blocks(
//     Blocks.Divider(),
//     Blocks.Section({
//       text: t('received_reward_score_board', t('reward_emoji')),
//     }),

//     Blocks.Section().fields(toScoreBlocks.length > 0 ? toScoreBlocks : 'None'),
//     Blocks.Divider(),
//     Blocks.Section({
//       text: t('given_reward_score_board', t('reward_emoji')),
//     }),
//     Blocks.Section().fields(
//       fromScoreBlocks.length > 0 ? fromScoreBlocks : 'None',
//     ),
//   );
// };

// export const homePage = async (teamId: string, userId: string) => {
//   const home = HomeTab();
//   home.callbackId('home-tab');
//   home.externalId(`home-${teamId}`);
//   const { data: toScoreBoard } = await api.reward.rewardControllerScoreBoard({
//     teamId: teamId,
//     direction: 'destination',
//   });

//   const { data: fromScoreBoard } = await api.reward.rewardControllerScoreBoard({
//     teamId: teamId,
//     direction: 'source',
//   });

//   try {
//     const { data } = await api.characters.charactersControllerFindByOwner(
//       userId,
//       teamId,
//     );
//     if (data) {
//       characterStats(data, home);
//     }
//   } catch (e) {
//     if (e.error.status == 404) Logger.info(`No character found in home page`);
//     else console.error(e.error);
//   }

//   rewardScores(toScoreBoard, fromScoreBoard, home);
//   return home.buildToObject();
// };

import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher';
import { sdk } from '../utils/gql';
import { Logger } from '../logger';
import { tl } from '../i18n';
import { Character } from '../generated/graphql';
import { BlockBuilder, Blocks, SectionBuilder } from 'slack-block-builder';

export function deleteCharacter(app: App) {
  onCommand('delete').subscribe(async (value) => {
    let char: Character;
    try {
      char = (
        await sdk.getCharacterByOwner({
          userId: value.args.payload.user_id,
          teamId: value.args.payload.team_id,
        })
      ).getCharacterByOwner;
    } catch (err) {
      value.args.respond(tl.t('ns1:character_not_found'));
      return;
    }
    try {
      const resp = await sdk.deleteCharacter({
        id: char.id,
      });
      if (resp.deleteCharacter.affected > 0) {
        await value.args.respond(tl.t('ns1:character_deleted'));
      } else {
        await value.args.respond(tl.t('ns1:character_not_found'));
        return;
      }
      Logger.info(resp);
    } catch (err) {
      Logger.error(err);
      return;
    }
  });

  return new Promise<SectionBuilder[]>((resolve) => {
    const help = [
      Blocks.Section({
        text: tl.t('delete_help_description'),
      }),
      Blocks.Section({
        text: tl.t('delete_help_command', tl.t('command')),
      }),
    ];
    resolve(help);
  });
}

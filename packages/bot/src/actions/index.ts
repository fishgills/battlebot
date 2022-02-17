import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import { Subject } from 'rxjs';
import { DoneObserver } from './done-observer';
import { RerollObserver } from './reroll-observer';
import { StatsObserver } from './stats-observer';

export type ObserveType = SlackActionMiddlewareArgs<BlockButtonAction> &
  AllMiddlewareArgs;

export const ActionsRegex = new RegExp(
  ['reroll', 'stat-inc', 'complete'].join('|'),
  'gi',
);

export const Action$ = new Subject<ObserveType>();

[StatsObserver, RerollObserver, DoneObserver].forEach((t) => {
  const temp = new t();
  Action$.subscribe((e) => temp.listener(e));
});

import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import { Subject } from 'rxjs';
import { RerollObserver } from './reroll-observer';
import { StatsObserver } from './stats-observer';

export type ObserveType = SlackActionMiddlewareArgs<BlockButtonAction> &
  AllMiddlewareArgs;

export const ActionsRegex = new RegExp(['reroll', 'stat-inc'].join('|'), 'gi');

export const Action$ = new Subject<ObserveType>();
const statsAction = new StatsObserver();
const rerollAction = new RerollObserver();

Action$.subscribe((e) => rerollAction.listener(e));
Action$.subscribe((e) => statsAction.listener(e));

import { ActionSubject } from './action-subject';
import { StatsObserver } from './stats';

export const Action$ = new ActionSubject();

Action$.attach(new StatsObserver('stat-incr'));

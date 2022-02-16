// import { ActionSubject } from './action-subject';
import { Subject } from 'rxjs';
// import { StatsObserver } from './stats';

export const Action$ = new Subject();
// export const Action$ = new ActionSubject();

// Action$.attach(new StatsObserver('stat-incr'));

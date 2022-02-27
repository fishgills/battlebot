import { LessThan, Repository } from 'typeorm';
import { Store } from 'express-session';
import { SessionModel } from './session-model';
import { Logger } from '@nestjs/common';
import { addSeconds } from 'date-fns';

export interface Options {
  repository: Repository<SessionModel>;

  /**
   * Session TTL in seconds. Defaults to 86400 (1 day).
   */
  ttl?: number;

  logger: Logger;

  /**
   * Whether to remove expired sessions from the database. Defaults to true.
   */
  clearExpired?: boolean;

  /**
   * The interval between checking for expired sessions in seconds. Defaults to 86400 (1 day).
   */
  expirationInterval?: number;
}

export class DBStore extends Store {
  private readonly repository: Repository<SessionModel>;
  private readonly ttl?: number;
  private readonly expirationInterval: number;
  private expirationIntervalId?: NodeJS.Timer;
  private readonly logger: Logger;

  constructor(options: Options) {
    super();

    this.logger = options.logger;
    if (!options.repository) {
      throw new Error('The repository option is required');
    }
    this.logger.log('creating session store');

    this.repository = options.repository;
    this.ttl = options.ttl;
    this.expirationInterval = options.expirationInterval || 30 * 60 * 1000;

    if (options.clearExpired === undefined || options.clearExpired) {
      this.setExpirationInterval(this.expirationInterval);
    }
  }

  /**
   * Get all sessions.
   * @param {(error: any, result?: any) => void} callback
   */
  all = (callback: (error: any, result?: any) => void): void => {
    this.logger.log('getting all');
    this.repository
      .find()
      .then((sessions: SessionModel[]) =>
        sessions.map((session) => session.data),
      )
      .then((data: any) => callback(null, data))
      .catch((error: any) => callback(error));
  };

  /**
   * Destroy a session
   * @param {string} id
   * @param {(error: any) => void} callback
   */
  destroy = (id: string, callback?: (error: any) => void): void => {
    this.logger.log(`Destroy`);
    this.repository
      .delete(id)
      .then(() => callback && callback(null))
      .catch((error: any) => callback && callback(error));
  };

  /**
   * Clear all sessions.
   * @param {(error: any) => void} callback
   */
  clear = (callback?: (error: any) => void): void => {
    this.logger.log(`Clear`);
    this.repository
      .clear()
      .then(() => callback && callback(null))
      .catch((error: any) => callback && callback(error));
  };

  /**
   * Get the session count.
   * @param {(error: any, length?: number) => void} callback
   */
  length = (callback: (error: any, length: number) => void): void => {
    this.logger.log(`Length`);

    this.repository
      .count()
      .then((length: number) => callback(null, length))
      .catch((error: any) => callback(error, 0));
  };

  /**
   * Get a session.
   * @param {string} id
   * @param {(error: any, session?: any) => any} callback
   */
  get = (id: string, callback: (error: any, session?: any) => void): void => {
    this.logger.log(`Get`);

    this.repository
      .findOne(id)
      .then((session: SessionModel | undefined) => {
        if (!session) {
          return callback(null);
        }
        const data = session.data;
        callback(null, data);
      })
      .catch((error: any) => callback(error));
  };

  /**
   * Set a session.
   * @param {string} id
   * @param session
   * @param {(error: any) => void} callback
   */
  set = (id: string, session: any, callback?: (error: any) => void): void => {
    this.logger.log(`Set`);

    let data;
    try {
      data = session;
    } catch (error) {
      if (callback) {
        return callback(error);
      }
      throw error;
    }

    const ttl = this.getTTL(session);
    const expiresAt = addSeconds(new Date(), ttl);

    this.repository
      .save({ id, data, expiresAt })
      .then(() => callback && callback(null))
      .catch((error: any) => callback && callback(error));
  };

  /**
   * Refresh the session expiry time.
   * @param {string} id
   * @param session
   * @param {(error: any) => void} callback
   */
  touch = (id: string, session: any, callback?: (error: any) => void): void => {
    this.logger.log(`Touch`);

    const ttl = this.getTTL(session);
    const expiresAt = addSeconds(new Date(), ttl);

    this.repository
      .update(id, { expiresAt })
      .then(() => callback && callback(null))
      .catch((error: any) => callback && callback(error));
  };

  /**
   * Remove all expired sessions from the database.
   * @param {(error: any) => void} callback
   */
  private clearExpiredSessions = (callback?: (error: any) => void) => {
    this.logger.log(`ClearExpired`);

    const timestamp = new Date();

    this.repository
      .delete({ expiresAt: LessThan(timestamp) })
      .then(() => callback && callback(null))
      .catch((error: any) => callback && callback(error));
  };

  /**
   * Set the expiration interval in seconds. If the interval in seconds is not set, it defaults to the store's expiration interval.
   * @param {number} interval
   */
  private setExpirationInterval = (interval?: number) => {
    interval = interval || this.expirationInterval;

    this.clearExpirationInterval();
    this.expirationIntervalId = setInterval(
      this.clearExpiredSessions,
      interval * 1000,
    );
  };

  /**
   * Clear the expiration interval if it exists.
   */
  private clearExpirationInterval = () => {
    if (this.expirationIntervalId) {
      clearInterval(this.expirationIntervalId);
    }

    this.expirationIntervalId = undefined;
  };

  /**
   * Get the session TTL (time to live) in seconds.
   * @param session
   * @return {number}
   */
  private getTTL = (session: any): number => {
    if (this.ttl) {
      return this.ttl;
    }
    return session.cookie && session.cookie.maxAge
      ? Math.floor(session.cookie.maxAge / 1000)
      : 86400;
  };
}

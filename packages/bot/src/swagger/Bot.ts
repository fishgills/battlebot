/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateCharacterDto {
  /** @example "Mister Dude" */
  name: string;
  /** Slack User Id */
  owner: string;
  /** Slack Team Id */
  teamId: string;
}

export interface CharacterEntity {
  id: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  attacking: CombatEntity[];
  defending: CombatEntity[];
  name: string;
  owner: string;
  strength: number;
  defense: number;
  vitality: number;
  level: number;
  xp: number;
  hp: number;
  rolls: number;
  gold: number;
  teamId: string;
  extraPoints: number;
  active: boolean;
}

export interface CombatRound {
  attacker: CharacterEntity;
  defender: CharacterEntity;
  hit: boolean;
  damage: number;
  attackRoll: number;
  attackBonus: number;
  defenderDefense: number;
  defenderHealth: number;
}

export interface CombatLog {
  combat: CombatRound[];
}

export interface CombatEntity {
  id: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  log: CombatLog;
  attacker: CharacterEntity;
  attackerId: string;
  defender: CharacterEntity;
  defenderId: string;
  winner: CharacterEntity;
  loser: CharacterEntity;
  rewardGold: number;
}

export interface UpdateCharacterDto {
  /** @example "Mister Dude" */
  name?: string;
  /** Slack User Id */
  owner?: string;
  /** Slack Team Id */
  teamId?: string;
}

export interface CreateCombatDto {
  attackerId: string;
  defenderId: string;
}

export type UpdateCombatDto = object;

export interface CreateRewardDto {
  source: string;
  destination: string;
  value?: number;
  teamId: string;
}

export interface RewardEntity {
  id: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  destination: string;
  source: string;
  teamId: string;
  value?: number;
}

export interface UpdateRewardDto {
  source?: string;
  destination?: string;
  value?: number;
  teamId?: string;
}

export interface CreateInstallDto {
  team_id: string;
  installObj: {
    bot?: {
      token: string;
    };
  };
  channelId: string;
}

export interface InstallEntity {
  id: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  team_id: string;
  installObj: {
    bot?: {
      token: string;
    };
  };
  channelId: string;
  stripeSubId?: string;
  stripeCOSId?: string;
  stripeCusId?: string;
}

export interface UpdateInstallDto {
  team_id?: string;
  installObj: {
    bot?: {
      token: string;
    };
  };
  channelId?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === 'number' ? value : `${value}`,
    )}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => 'undefined' !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal: cancelToken
          ? this.createAbortSignal(cancelToken)
          : requestParams.signal,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Bot API
 * @version 1.0.0
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/`,
      method: 'GET',
      format: 'json',
      ...params,
    });

  characters = {
    /**
     * No description
     *
     * @name CharactersControllerCreate
     * @request POST:/characters
     */
    charactersControllerCreate: (
      data: CreateCharacterDto,
      params: RequestParams = {},
    ) =>
      this.request<CharacterEntity, any>({
        path: `/characters`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CharactersControllerFindAll
     * @request GET:/characters
     */
    charactersControllerFindAll: (params: RequestParams = {}) =>
      this.request<CharacterEntity[], any>({
        path: `/characters`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CharactersControllerFindOne
     * @request GET:/characters/{id}
     */
    charactersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<CharacterEntity, any>({
        path: `/characters/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CharactersControllerUpdate
     * @request PATCH:/characters/{id}
     */
    charactersControllerUpdate: (
      id: string,
      data: UpdateCharacterDto,
      params: RequestParams = {},
    ) =>
      this.request<object[], any>({
        path: `/characters/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CharactersControllerRemove
     * @request DELETE:/characters/{id}
     */
    charactersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/characters/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name CharactersControllerFindByOwner
     * @request GET:/characters/owner/{team}/{id}
     */
    charactersControllerFindByOwner: (
      id: string,
      team: string,
      params: RequestParams = {},
    ) =>
      this.request<CharacterEntity, any>({
        path: `/characters/owner/${team}/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  combat = {
    /**
     * No description
     *
     * @name CombatControllerCreate
     * @request POST:/combat
     */
    combatControllerCreate: (
      data: CreateCombatDto,
      params: RequestParams = {},
    ) =>
      this.request<CombatEntity, any>({
        path: `/combat`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CombatControllerFindAll
     * @request GET:/combat
     */
    combatControllerFindAll: (params: RequestParams = {}) =>
      this.request<CombatEntity[], any>({
        path: `/combat`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CombatControllerFindOne
     * @request GET:/combat/{id}
     */
    combatControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<CombatEntity, any>({
        path: `/combat/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CombatControllerUpdate
     * @request PATCH:/combat/{id}
     */
    combatControllerUpdate: (
      id: string,
      data: UpdateCombatDto,
      params: RequestParams = {},
    ) =>
      this.request<object[], any>({
        path: `/combat/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CombatControllerRemove
     * @request DELETE:/combat/{id}
     */
    combatControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/combat/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name CombatControllerStart
     * @request POST:/combat/start
     */
    combatControllerStart: (
      data: CreateCombatDto,
      params: RequestParams = {},
    ) =>
      this.request<CombatEntity, any>({
        path: `/combat/start`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  health = {
    /**
     * No description
     *
     * @name HealthControllerCheck
     * @request GET:/health
     */
    healthControllerCheck: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          status?: string;
          /** @example {"database":{"status":"up"}} */
          info?: Record<
            string,
            {
              status?: string;
              [key: string]: any;
            }
          >;
          /** @example {} */
          error?: Record<
            string,
            {
              status?: string;
              [key: string]: any;
            }
          >;
          /** @example {"database":{"status":"up"}} */
          details?: Record<
            string,
            {
              status?: string;
              [key: string]: any;
            }
          >;
        },
        {
          /** @example "error" */
          status?: string;
          /** @example {"database":{"status":"up"}} */
          info?: Record<
            string,
            {
              status?: string;
              [key: string]: any;
            }
          >;
          /** @example {"redis":{"status":"down","message":"Could not connect"}} */
          error?: Record<
            string,
            {
              status?: string;
              [key: string]: any;
            }
          >;
          /** @example {"database":{"status":"up"},"redis":{"status":"down","message":"Could not connect"}} */
          details?: Record<
            string,
            {
              status?: string;
              [key: string]: any;
            }
          >;
        }
      >({
        path: `/health`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  reward = {
    /**
     * No description
     *
     * @name RewardControllerCreate
     * @request POST:/reward
     */
    rewardControllerCreate: (
      data: CreateRewardDto,
      params: RequestParams = {},
    ) =>
      this.request<RewardEntity, any>({
        path: `/reward`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name RewardControllerFindAll
     * @request GET:/reward
     */
    rewardControllerFindAll: (params: RequestParams = {}) =>
      this.request<RewardEntity[], any[]>({
        path: `/reward`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name RewardControllerFindOne
     * @request GET:/reward/{id}
     */
    rewardControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<RewardEntity, any>({
        path: `/reward/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name RewardControllerUpdate
     * @request PATCH:/reward/{id}
     */
    rewardControllerUpdate: (
      id: string,
      data: UpdateRewardDto,
      params: RequestParams = {},
    ) =>
      this.request<object[], any>({
        path: `/reward/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name RewardControllerRemove
     * @request DELETE:/reward/{id}
     */
    rewardControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reward/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name RewardControllerRewardsGivenToday
     * @request GET:/reward/rewards-today
     */
    rewardControllerRewardsGivenToday: (
      user: string,
      teamId: string,
      params: RequestParams = {},
    ) =>
      this.request<number, number>({
        path: `/reward/rewards-today`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name RewardControllerGiveReward
     * @request POST:/reward/give
     */
    rewardControllerGiveReward: (
      query: {
        source: string;
        destination: string;
        value?: number;
        teamId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<boolean, any>({
        path: `/reward/give`,
        method: 'POST',
        query: query,
        format: 'json',
        ...params,
      }),
  };
  install = {
    /**
     * No description
     *
     * @name InstallControllerCreate
     * @request POST:/install
     */
    installControllerCreate: (
      data: CreateInstallDto,
      params: RequestParams = {},
    ) =>
      this.request<InstallEntity, any>({
        path: `/install`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name InstallControllerFindAll
     * @request GET:/install
     */
    installControllerFindAll: (params: RequestParams = {}) =>
      this.request<InstallEntity[], any>({
        path: `/install`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name InstallControllerFindOne
     * @request GET:/install/{id}
     */
    installControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<InstallEntity, any>({
        path: `/install/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name InstallControllerUpdate
     * @request PATCH:/install/{id}
     */
    installControllerUpdate: (
      id: string,
      data: UpdateInstallDto,
      params: RequestParams = {},
    ) =>
      this.request<object[], any>({
        path: `/install/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name InstallControllerRemove
     * @request DELETE:/install/{id}
     */
    installControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/install/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
}

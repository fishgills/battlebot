import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

/** Supported scoreboard directions */
export enum AllowedDirections {
  /** rewards from users */
  From = 'FROM',
  /** rewards to users */
  To = 'TO',
}

export type CharacterType = {
  __typename?: 'CharacterType';
  active: Scalars['Boolean'];
  attacking?: Maybe<Array<CombatModel>>;
  created_at: Scalars['DateTime'];
  defending?: Maybe<Array<CombatModel>>;
  defense: Scalars['Float'];
  extraPoints: Scalars['Float'];
  gold: Scalars['Float'];
  hp: Scalars['Float'];
  id: Scalars['String'];
  level: Scalars['Float'];
  name: Scalars['String'];
  owner: Scalars['String'];
  rolls: Scalars['Float'];
  strength: Scalars['Float'];
  teamId: Scalars['String'];
  updated_at: Scalars['DateTime'];
  vitality: Scalars['Float'];
  xp: Scalars['Float'];
};

export type CombatLog = {
  __typename?: 'CombatLog';
  combat: Array<CombatRound>;
};

export type CombatModel = {
  __typename?: 'CombatModel';
  attacker?: Maybe<CharacterType>;
  attackerId: Scalars['String'];
  created_at: Scalars['DateTime'];
  defender?: Maybe<CharacterType>;
  defenderId: Scalars['String'];
  id: Scalars['String'];
  log: CombatLog;
  loser: CharacterType;
  rewardGold: Scalars['Float'];
  updated_at: Scalars['DateTime'];
  winner: CharacterType;
};

export type CombatRound = {
  __typename?: 'CombatRound';
  attackBonus: Scalars['Float'];
  attackRoll: Scalars['Float'];
  attacker: CharacterType;
  damage?: Maybe<Scalars['Float']>;
  defender: CharacterType;
  defenderDefense: Scalars['Float'];
  defenderHealth: Scalars['Float'];
  hit: Scalars['Boolean'];
};

export type ConvoType = {
  __typename?: 'ConvoType';
  convoId: Scalars['String'];
  expiresAt: Scalars['Float'];
  id: Scalars['String'];
  value: Scalars['String'];
};

export type CreateCharacterInput = {
  name: Scalars['String'];
  owner: Scalars['String'];
  teamId: Scalars['String'];
};

export type CreateCombatInput = {
  attackerId: Scalars['String'];
  defenderId: Scalars['String'];
};

export type CreateConvoInput = {
  convoId: Scalars['String'];
  expiresAt: Scalars['Float'];
  value: Scalars['String'];
};

export type CreateRewardInput = {
  from: Scalars['String'];
  teamId: Scalars['String'];
  to: Scalars['String'];
  value?: InputMaybe<Scalars['Float']>;
};

export type CreateSlackInstallInput = {
  channelId?: InputMaybe<Scalars['String']>;
  installObj: Scalars['JSON'];
  team_id: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CharacterUpdate: Scalars['Int'];
  CreateStripeCheckoutSession: StripeSession;
  createCharacter: CharacterType;
  createCombat: CombatModel;
  createConvo: ConvoType;
  createInstall: SlackInstallModel;
  deleteConvo: Scalars['Int'];
  giveReward: Scalars['Boolean'];
  removeInstall: Scalars['String'];
  reroll: CharacterType;
  start: CombatModel;
  updateInstall: SlackInstallModel;
};

export type MutationCharacterUpdateArgs = {
  id: Scalars['String'];
  input: UpdateCharacterInput;
};

export type MutationCreateStripeCheckoutSessionArgs = {
  priceId: Scalars['String'];
};

export type MutationCreateCharacterArgs = {
  input: CreateCharacterInput;
};

export type MutationCreateCombatArgs = {
  input: CreateCombatInput;
};

export type MutationCreateConvoArgs = {
  input: CreateConvoInput;
};

export type MutationCreateInstallArgs = {
  input: CreateSlackInstallInput;
};

export type MutationDeleteConvoArgs = {
  convoId: Scalars['String'];
};

export type MutationGiveRewardArgs = {
  input: CreateRewardInput;
};

export type MutationRemoveInstallArgs = {
  team_id: Scalars['String'];
};

export type MutationRerollArgs = {
  id: Scalars['String'];
};

export type MutationStartArgs = {
  input: CreateCombatInput;
};

export type MutationUpdateInstallArgs = {
  input: UpdateSlackInstallInput;
};

export type Query = {
  __typename?: 'Query';
  ScoreBoard: Array<RewardScore>;
  characters: Array<CharacterType>;
  combats: Array<CombatModel>;
  convo: ConvoType;
  findByOwner: CharacterType;
  getUserScore: Array<RewardType>;
  install: SlackInstallModel;
  installs: Array<SlackInstallModel>;
  rewards: Array<RewardType>;
  rewardsGivenToday: Scalars['Int'];
};

export type QueryScoreBoardArgs = {
  input: RewardsScoreBoardInput;
};

export type QueryCombatsArgs = {
  attacker?: InputMaybe<Scalars['String']>;
};

export type QueryConvoArgs = {
  convoId: Scalars['String'];
};

export type QueryFindByOwnerArgs = {
  owner: Scalars['String'];
  teamId?: InputMaybe<Scalars['String']>;
};

export type QueryGetUserScoreArgs = {
  listType?: InputMaybe<Scalars['String']>;
  teamId: Scalars['String'];
  userId: Scalars['String'];
};

export type QueryInstallArgs = {
  team_id: Scalars['String'];
};

export type QueryRewardsGivenTodayArgs = {
  teamId: Scalars['String'];
  user: Scalars['String'];
};

export type RewardScore = {
  __typename?: 'RewardScore';
  count: Scalars['Float'];
  teamId: Scalars['String'];
  userId: Scalars['String'];
};

export type RewardType = {
  __typename?: 'RewardType';
  created_at: Scalars['DateTime'];
  from: Scalars['String'];
  id: Scalars['String'];
  teamId: Scalars['String'];
  to: Scalars['String'];
  updated_at: Scalars['DateTime'];
  value: Scalars['Float'];
};

export type RewardsScoreBoardInput = {
  direction: AllowedDirections;
  teamId: Scalars['String'];
  today?: InputMaybe<Scalars['Boolean']>;
};

export type SlackInstallModel = {
  __typename?: 'SlackInstallModel';
  channelId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  installObj: Scalars['JSON'];
  team_id: Scalars['String'];
};

export type StripeSession = {
  __typename?: 'StripeSession';
  id: Scalars['String'];
};

/** Update a character's properties */
export type UpdateCharacterInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  defense?: InputMaybe<Scalars['Float']>;
  extraPoints?: InputMaybe<Scalars['Float']>;
  strength?: InputMaybe<Scalars['Float']>;
  vitality?: InputMaybe<Scalars['Float']>;
};

export type UpdateSlackInstallInput = {
  channelId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  installObj?: InputMaybe<Scalars['JSON']>;
  team_id?: InputMaybe<Scalars['String']>;
};

export type WhoGoesFirst = {
  __typename?: 'WhoGoesFirst';
  modifier: Scalars['Float'];
  roll: Scalars['Float'];
};

export type CharacterPartsFragment = {
  __typename?: 'CharacterType';
  defense: number;
  vitality: number;
  strength: number;
  name: string;
  xp: number;
  rolls: number;
  hp: number;
  level: number;
  owner: string;
  id: string;
  created_at: any;
  gold: number;
  teamId: string;
  updated_at: any;
  extraPoints: number;
  active: boolean;
};

export type SlackInstallPartsFragment = {
  __typename?: 'SlackInstallModel';
  id: string;
  team_id: string;
  installObj: any;
};

export type AddCharacterMutationVariables = Exact<{
  input: CreateCharacterInput;
}>;

export type AddCharacterMutation = {
  __typename?: 'Mutation';
  createCharacter: {
    __typename?: 'CharacterType';
    defense: number;
    vitality: number;
    strength: number;
    name: string;
    xp: number;
    rolls: number;
    hp: number;
    level: number;
    owner: string;
    id: string;
    created_at: any;
    gold: number;
    teamId: string;
    updated_at: any;
    extraPoints: number;
    active: boolean;
  };
};

export type StartCombatMutationVariables = Exact<{
  input: CreateCombatInput;
}>;

export type StartCombatMutation = {
  __typename?: 'Mutation';
  start: {
    __typename?: 'CombatModel';
    rewardGold: number;
    attacker?: {
      __typename?: 'CharacterType';
      id: string;
      name: string;
    } | null;
    defender?: {
      __typename?: 'CharacterType';
      id: string;
      name: string;
    } | null;
    loser: { __typename?: 'CharacterType'; id: string; name: string };
    winner: {
      __typename?: 'CharacterType';
      id: string;
      name: string;
      level: number;
      xp: number;
    };
    log: {
      __typename?: 'CombatLog';
      combat: Array<{
        __typename?: 'CombatRound';
        hit: boolean;
        damage?: number | null;
        attackRoll: number;
        attackBonus: number;
        defenderDefense: number;
        defenderHealth: number;
        attacker: { __typename?: 'CharacterType'; id: string; name: string };
        defender: { __typename?: 'CharacterType'; id: string; name: string };
      }>;
    };
  };
};

export type CharacterByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
  teamId: Scalars['String'];
}>;

export type CharacterByOwnerQuery = {
  __typename?: 'Query';
  findByOwner: {
    __typename?: 'CharacterType';
    defense: number;
    vitality: number;
    strength: number;
    name: string;
    xp: number;
    rolls: number;
    hp: number;
    level: number;
    owner: string;
    id: string;
    created_at: any;
    gold: number;
    teamId: string;
    updated_at: any;
    extraPoints: number;
    active: boolean;
  };
};

export type RollCharacterMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type RollCharacterMutation = {
  __typename?: 'Mutation';
  reroll: {
    __typename?: 'CharacterType';
    defense: number;
    vitality: number;
    strength: number;
    name: string;
    xp: number;
    rolls: number;
    hp: number;
    level: number;
    owner: string;
    id: string;
    created_at: any;
    gold: number;
    teamId: string;
    updated_at: any;
    extraPoints: number;
    active: boolean;
  };
};

export type GetInstallQueryVariables = Exact<{
  team_id: Scalars['String'];
}>;

export type GetInstallQuery = {
  __typename?: 'Query';
  install: {
    __typename?: 'SlackInstallModel';
    id: string;
    team_id: string;
    installObj: any;
  };
};

export type UpdateInstallMutationVariables = Exact<{
  input: UpdateSlackInstallInput;
}>;

export type UpdateInstallMutation = {
  __typename?: 'Mutation';
  updateInstall: {
    __typename?: 'SlackInstallModel';
    id: string;
    team_id: string;
    installObj: any;
  };
};

export type CreateInstallMutationVariables = Exact<{
  input: CreateSlackInstallInput;
}>;

export type CreateInstallMutation = {
  __typename?: 'Mutation';
  createInstall: {
    __typename?: 'SlackInstallModel';
    id: string;
    team_id: string;
    installObj: any;
  };
};

export type RemoveInstallMutationVariables = Exact<{
  team_id: Scalars['String'];
}>;

export type RemoveInstallMutation = {
  __typename?: 'Mutation';
  removeInstall: string;
};

export type GiveRewardMutationVariables = Exact<{
  from: Scalars['String'];
  to: Scalars['String'];
  tid: Scalars['String'];
}>;

export type GiveRewardMutation = {
  __typename?: 'Mutation';
  giveReward: boolean;
};

export type RewardsGivenTodayQueryVariables = Exact<{
  user: Scalars['String'];
  teamId: Scalars['String'];
}>;

export type RewardsGivenTodayQuery = {
  __typename?: 'Query';
  rewardsGivenToday: number;
};

export type CharacterUpdateMutationVariables = Exact<{
  characterUpdateId: Scalars['String'];
  input: UpdateCharacterInput;
}>;

export type CharacterUpdateMutation = {
  __typename?: 'Mutation';
  CharacterUpdate: number;
};

export type ScoreBoardQueryVariables = Exact<{
  input: RewardsScoreBoardInput;
}>;

export type ScoreBoardQuery = {
  __typename?: 'Query';
  ScoreBoard: Array<{
    __typename?: 'RewardScore';
    teamId: string;
    userId: string;
    count: number;
  }>;
};

export type CombatTotalsQueryVariables = Exact<{
  attacker?: InputMaybe<Scalars['String']>;
}>;

export type CombatTotalsQuery = {
  __typename?: 'Query';
  combats: Array<{
    __typename?: 'CombatModel';
    attackerId: string;
    defenderId: string;
  }>;
};

export type DeleteConvoMutationVariables = Exact<{
  convoId: Scalars['String'];
}>;

export type DeleteConvoMutation = {
  __typename?: 'Mutation';
  deleteConvo: number;
};

export type ConvoQueryVariables = Exact<{
  convoId: Scalars['String'];
}>;

export type ConvoQuery = {
  __typename?: 'Query';
  convo: {
    __typename?: 'ConvoType';
    convoId: string;
    expiresAt: number;
    value: string;
  };
};

export type CreateConvoMutationVariables = Exact<{
  input: CreateConvoInput;
}>;

export type CreateConvoMutation = {
  __typename?: 'Mutation';
  createConvo: {
    __typename?: 'ConvoType';
    expiresAt: number;
    value: string;
    convoId: string;
    id: string;
  };
};

export type CreateStripeSessionMutationVariables = Exact<{
  priceId: Scalars['String'];
}>;

export type CreateStripeSessionMutation = {
  __typename?: 'Mutation';
  CreateStripeCheckoutSession: { __typename?: 'StripeSession'; id: string };
};

export const CharacterPartsFragmentDoc = gql`
  fragment CharacterParts on CharacterType {
    defense
    vitality
    strength
    name
    xp
    rolls
    hp
    level
    owner
    id
    created_at
    gold
    teamId
    updated_at
    extraPoints
    active
  }
`;
export const SlackInstallPartsFragmentDoc = gql`
  fragment SlackInstallParts on SlackInstallModel {
    id
    team_id
    installObj
  }
`;
export const AddCharacterDocument = gql`
  mutation addCharacter($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      ...CharacterParts
    }
  }
  ${CharacterPartsFragmentDoc}
`;
export const StartCombatDocument = gql`
  mutation startCombat($input: CreateCombatInput!) {
    start(input: $input) {
      attacker {
        id
        name
      }
      defender {
        id
        name
      }
      rewardGold
      loser {
        id
        name
      }
      winner {
        id
        name
        level
        xp
      }
      log {
        combat {
          attacker {
            id
            name
          }
          defender {
            id
            name
          }
          hit
          damage
          attackRoll
          attackBonus
          defenderDefense
          defenderHealth
        }
      }
    }
  }
`;
export const CharacterByOwnerDocument = gql`
  query characterByOwner($owner: String!, $teamId: String!) {
    findByOwner(owner: $owner, teamId: $teamId) {
      ...CharacterParts
    }
  }
  ${CharacterPartsFragmentDoc}
`;
export const RollCharacterDocument = gql`
  mutation rollCharacter($id: String!) {
    reroll(id: $id) {
      ...CharacterParts
    }
  }
  ${CharacterPartsFragmentDoc}
`;
export const GetInstallDocument = gql`
  query getInstall($team_id: String!) {
    install(team_id: $team_id) {
      ...SlackInstallParts
    }
  }
  ${SlackInstallPartsFragmentDoc}
`;
export const UpdateInstallDocument = gql`
  mutation updateInstall($input: UpdateSlackInstallInput!) {
    updateInstall(input: $input) {
      ...SlackInstallParts
    }
  }
  ${SlackInstallPartsFragmentDoc}
`;
export const CreateInstallDocument = gql`
  mutation createInstall($input: CreateSlackInstallInput!) {
    createInstall(input: $input) {
      ...SlackInstallParts
    }
  }
  ${SlackInstallPartsFragmentDoc}
`;
export const RemoveInstallDocument = gql`
  mutation removeInstall($team_id: String!) {
    removeInstall(team_id: $team_id)
  }
`;
export const GiveRewardDocument = gql`
  mutation giveReward($from: String!, $to: String!, $tid: String!) {
    giveReward(input: { from: $from, to: $to, teamId: $tid })
  }
`;
export const RewardsGivenTodayDocument = gql`
  query rewardsGivenToday($user: String!, $teamId: String!) {
    rewardsGivenToday(user: $user, teamId: $teamId)
  }
`;
export const CharacterUpdateDocument = gql`
  mutation CharacterUpdate(
    $characterUpdateId: String!
    $input: UpdateCharacterInput!
  ) {
    CharacterUpdate(id: $characterUpdateId, input: $input)
  }
`;
export const ScoreBoardDocument = gql`
  query ScoreBoard($input: RewardsScoreBoardInput!) {
    ScoreBoard(input: $input) {
      teamId
      userId
      count
    }
  }
`;
export const CombatTotalsDocument = gql`
  query CombatTotals($attacker: String) {
    combats(attacker: $attacker) {
      attackerId
      defenderId
    }
  }
`;
export const DeleteConvoDocument = gql`
  mutation DeleteConvo($convoId: String!) {
    deleteConvo(convoId: $convoId)
  }
`;
export const ConvoDocument = gql`
  query Convo($convoId: String!) {
    convo(convoId: $convoId) {
      convoId
      expiresAt
      value
    }
  }
`;
export const CreateConvoDocument = gql`
  mutation CreateConvo($input: CreateConvoInput!) {
    createConvo(input: $input) {
      expiresAt
      value
      convoId
      id
    }
  }
`;
export const CreateStripeSessionDocument = gql`
  mutation CreateStripeSession($priceId: String!) {
    CreateStripeCheckoutSession(priceId: $priceId) {
      id
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    addCharacter(
      variables: AddCharacterMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<AddCharacterMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddCharacterMutation>(
            AddCharacterDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'addCharacter',
      );
    },
    startCombat(
      variables: StartCombatMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<StartCombatMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<StartCombatMutation>(StartCombatDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'startCombat',
      );
    },
    characterByOwner(
      variables: CharacterByOwnerQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CharacterByOwnerQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CharacterByOwnerQuery>(
            CharacterByOwnerDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'characterByOwner',
      );
    },
    rollCharacter(
      variables: RollCharacterMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<RollCharacterMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RollCharacterMutation>(
            RollCharacterDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'rollCharacter',
      );
    },
    getInstall(
      variables: GetInstallQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetInstallQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetInstallQuery>(GetInstallDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getInstall',
      );
    },
    updateInstall(
      variables: UpdateInstallMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UpdateInstallMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateInstallMutation>(
            UpdateInstallDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'updateInstall',
      );
    },
    createInstall(
      variables: CreateInstallMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateInstallMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateInstallMutation>(
            CreateInstallDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'createInstall',
      );
    },
    removeInstall(
      variables: RemoveInstallMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<RemoveInstallMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RemoveInstallMutation>(
            RemoveInstallDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'removeInstall',
      );
    },
    giveReward(
      variables: GiveRewardMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GiveRewardMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GiveRewardMutation>(GiveRewardDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'giveReward',
      );
    },
    rewardsGivenToday(
      variables: RewardsGivenTodayQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<RewardsGivenTodayQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RewardsGivenTodayQuery>(
            RewardsGivenTodayDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'rewardsGivenToday',
      );
    },
    CharacterUpdate(
      variables: CharacterUpdateMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CharacterUpdateMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CharacterUpdateMutation>(
            CharacterUpdateDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'CharacterUpdate',
      );
    },
    ScoreBoard(
      variables: ScoreBoardQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<ScoreBoardQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ScoreBoardQuery>(ScoreBoardDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'ScoreBoard',
      );
    },
    CombatTotals(
      variables?: CombatTotalsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CombatTotalsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CombatTotalsQuery>(CombatTotalsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CombatTotals',
      );
    },
    DeleteConvo(
      variables: DeleteConvoMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<DeleteConvoMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteConvoMutation>(DeleteConvoDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'DeleteConvo',
      );
    },
    Convo(
      variables: ConvoQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<ConvoQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ConvoQuery>(ConvoDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'Convo',
      );
    },
    CreateConvo(
      variables: CreateConvoMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateConvoMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateConvoMutation>(CreateConvoDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateConvo',
      );
    },
    CreateStripeSession(
      variables: CreateStripeSessionMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateStripeSessionMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateStripeSessionMutation>(
            CreateStripeSessionDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'CreateStripeSession',
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;

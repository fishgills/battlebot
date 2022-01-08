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

export type CharacterModel = {
  __typename?: 'CharacterModel';
  attacking?: Maybe<Array<CombatModel>>;
  created_at: Scalars['DateTime'];
  defending?: Maybe<Array<CombatModel>>;
  defense?: Maybe<Scalars['Float']>;
  hp?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  level?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  owner: Scalars['String'];
  rolls?: Maybe<Scalars['Float']>;
  strength?: Maybe<Scalars['Float']>;
  updated_at: Scalars['DateTime'];
  vitality?: Maybe<Scalars['Float']>;
  xp?: Maybe<Scalars['Float']>;
};

export type CombatLog = {
  __typename?: 'CombatLog';
  combat: Array<CombatRound>;
};

export type CombatModel = {
  __typename?: 'CombatModel';
  attacker?: Maybe<CharacterModel>;
  attackerId: Scalars['String'];
  created_at: Scalars['DateTime'];
  defender?: Maybe<CharacterModel>;
  defenderId: Scalars['String'];
  id: Scalars['String'];
  log: CombatLog;
  updated_at: Scalars['DateTime'];
};

export type CombatRound = {
  __typename?: 'CombatRound';
  attackBonus: Scalars['Float'];
  attackRoll: Scalars['Float'];
  attacker: CharacterModel;
  damage?: Maybe<Scalars['Float']>;
  defender: CharacterModel;
  defenderDefense: Scalars['Float'];
  defenderHealth: Scalars['Float'];
  hit: Scalars['Boolean'];
};

export type CreateCharacterInput = {
  name: Scalars['String'];
  owner: Scalars['String'];
};

export type CreateCombatInput = {
  attackerId: Scalars['String'];
  defenderId: Scalars['String'];
};

export type CreateRewardInput = {
  from: Scalars['String'];
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
  createCharacter: CharacterModel;
  createCombat: CombatModel;
  createInstall: SlackInstallModel;
  giveReward: Scalars['Boolean'];
  removeInstall: Scalars['String'];
  reroll: CharacterModel;
  start: CombatLog;
  updateInstall: SlackInstallModel;
};

export type MutationCreateCharacterArgs = {
  input: CreateCharacterInput;
};

export type MutationCreateCombatArgs = {
  input: CreateCombatInput;
};

export type MutationCreateInstallArgs = {
  input: CreateSlackInstallInput;
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
  characters: Array<CharacterModel>;
  combats: Array<CombatModel>;
  findByOwner: CharacterModel;
  getUserScore: Array<RewardModel>;
  install: SlackInstallModel;
  installs: Array<SlackInstallModel>;
  rewards: Array<RewardModel>;
  rewardsGivenToday: Scalars['Int'];
};

export type QueryFindByOwnerArgs = {
  owner: Scalars['String'];
};

export type QueryGetUserScoreArgs = {
  listType?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type QueryInstallArgs = {
  team_id: Scalars['String'];
};

export type QueryRewardsGivenTodayArgs = {
  user: Scalars['String'];
};

export type RewardModel = {
  __typename?: 'RewardModel';
  created_at: Scalars['DateTime'];
  from: Scalars['String'];
  id: Scalars['String'];
  to: Scalars['String'];
  updated_at: Scalars['DateTime'];
  value: Scalars['Float'];
};

export type SlackInstallModel = {
  __typename?: 'SlackInstallModel';
  channelId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  installObj: Scalars['JSON'];
  team_id: Scalars['String'];
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
  __typename?: 'CharacterModel';
  defense?: number | null | undefined;
  vitality?: number | null | undefined;
  strength?: number | null | undefined;
  name: string;
  xp?: number | null | undefined;
  rolls?: number | null | undefined;
  hp?: number | null | undefined;
  level?: number | null | undefined;
  owner: string;
  id: string;
  created_at: any;
  updated_at: any;
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
    __typename?: 'CharacterModel';
    defense?: number | null | undefined;
    vitality?: number | null | undefined;
    strength?: number | null | undefined;
    name: string;
    xp?: number | null | undefined;
    rolls?: number | null | undefined;
    hp?: number | null | undefined;
    level?: number | null | undefined;
    owner: string;
    id: string;
    created_at: any;
    updated_at: any;
  };
};

export type StartCombatMutationVariables = Exact<{
  attackerId: Scalars['String'];
  defenderId: Scalars['String'];
}>;

export type StartCombatMutation = {
  __typename?: 'Mutation';
  start: {
    __typename?: 'CombatLog';
    combat: Array<{
      __typename?: 'CombatRound';
      hit: boolean;
      damage?: number | null | undefined;
      attackRoll: number;
      attackBonus: number;
      defenderDefense: number;
      defenderHealth: number;
      attacker: {
        __typename?: 'CharacterModel';
        defense?: number | null | undefined;
        vitality?: number | null | undefined;
        strength?: number | null | undefined;
        name: string;
        xp?: number | null | undefined;
        rolls?: number | null | undefined;
        hp?: number | null | undefined;
        level?: number | null | undefined;
        owner: string;
        id: string;
        created_at: any;
        updated_at: any;
      };
      defender: {
        __typename?: 'CharacterModel';
        defense?: number | null | undefined;
        vitality?: number | null | undefined;
        strength?: number | null | undefined;
        name: string;
        xp?: number | null | undefined;
        rolls?: number | null | undefined;
        hp?: number | null | undefined;
        level?: number | null | undefined;
        owner: string;
        id: string;
        created_at: any;
        updated_at: any;
      };
    }>;
  };
};

export type CharacterByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
}>;

export type CharacterByOwnerQuery = {
  __typename?: 'Query';
  findByOwner: {
    __typename?: 'CharacterModel';
    defense?: number | null | undefined;
    vitality?: number | null | undefined;
    strength?: number | null | undefined;
    name: string;
    xp?: number | null | undefined;
    rolls?: number | null | undefined;
    hp?: number | null | undefined;
    level?: number | null | undefined;
    owner: string;
    id: string;
    created_at: any;
    updated_at: any;
  };
};

export type RollCharacterMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type RollCharacterMutation = {
  __typename?: 'Mutation';
  reroll: {
    __typename?: 'CharacterModel';
    defense?: number | null | undefined;
    vitality?: number | null | undefined;
    strength?: number | null | undefined;
    name: string;
    xp?: number | null | undefined;
    rolls?: number | null | undefined;
    hp?: number | null | undefined;
    level?: number | null | undefined;
    owner: string;
    id: string;
    created_at: any;
    updated_at: any;
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
}>;

export type GiveRewardMutation = {
  __typename?: 'Mutation';
  giveReward: boolean;
};

export type RewardsGivenTodayQueryVariables = Exact<{
  user: Scalars['String'];
}>;

export type RewardsGivenTodayQuery = {
  __typename?: 'Query';
  rewardsGivenToday: number;
};

export const CharacterPartsFragmentDoc = gql`
  fragment CharacterParts on CharacterModel {
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
    updated_at
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
  mutation startCombat($attackerId: String!, $defenderId: String!) {
    start(input: { attackerId: $attackerId, defenderId: $defenderId }) {
      combat {
        attacker {
          ...CharacterParts
        }
        defender {
          ...CharacterParts
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
  ${CharacterPartsFragmentDoc}
`;
export const CharacterByOwnerDocument = gql`
  query characterByOwner($owner: String!) {
    findByOwner(owner: $owner) {
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
  mutation giveReward($from: String!, $to: String!) {
    giveReward(input: { from: $from, to: $to })
  }
`;
export const RewardsGivenTodayDocument = gql`
  query rewardsGivenToday($user: String!) {
    rewardsGivenToday(user: $user)
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    addCharacter(
      variables: AddCharacterMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<AddCharacterMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddCharacterMutation>(
            AddCharacterDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'addCharacter'
      );
    },
    startCombat(
      variables: StartCombatMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<StartCombatMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<StartCombatMutation>(StartCombatDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'startCombat'
      );
    },
    characterByOwner(
      variables: CharacterByOwnerQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<CharacterByOwnerQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CharacterByOwnerQuery>(
            CharacterByOwnerDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'characterByOwner'
      );
    },
    rollCharacter(
      variables: RollCharacterMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<RollCharacterMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RollCharacterMutation>(
            RollCharacterDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'rollCharacter'
      );
    },
    getInstall(
      variables: GetInstallQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<GetInstallQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetInstallQuery>(GetInstallDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'getInstall'
      );
    },
    updateInstall(
      variables: UpdateInstallMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<UpdateInstallMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateInstallMutation>(
            UpdateInstallDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'updateInstall'
      );
    },
    createInstall(
      variables: CreateInstallMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<CreateInstallMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateInstallMutation>(
            CreateInstallDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'createInstall'
      );
    },
    removeInstall(
      variables: RemoveInstallMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<RemoveInstallMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RemoveInstallMutation>(
            RemoveInstallDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'removeInstall'
      );
    },
    giveReward(
      variables: GiveRewardMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<GiveRewardMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GiveRewardMutation>(GiveRewardDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'giveReward'
      );
    },
    rewardsGivenToday(
      variables: RewardsGivenTodayQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<RewardsGivenTodayQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RewardsGivenTodayQuery>(
            RewardsGivenTodayDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'rewardsGivenToday'
      );
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;

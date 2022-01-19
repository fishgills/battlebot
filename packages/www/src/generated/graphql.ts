import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
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
  defense: Scalars['Float'];
  hp: Scalars['Float'];
  id: Scalars['String'];
  level: Scalars['Float'];
  name: Scalars['String'];
  owner: Scalars['String'];
  rolls: Scalars['Float'];
  strength: Scalars['Float'];
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
        updated_at: any;
      };
      defender: {
        __typename?: 'CharacterModel';
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

@Injectable({
  providedIn: 'root',
})
export class AddCharacterGQL extends Apollo.Mutation<
  AddCharacterMutation,
  AddCharacterMutationVariables
> {
  document = AddCharacterDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
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

@Injectable({
  providedIn: 'root',
})
export class StartCombatGQL extends Apollo.Mutation<
  StartCombatMutation,
  StartCombatMutationVariables
> {
  document = StartCombatDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CharacterByOwnerDocument = gql`
  query characterByOwner($owner: String!) {
    findByOwner(owner: $owner) {
      ...CharacterParts
    }
  }
  ${CharacterPartsFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class CharacterByOwnerGQL extends Apollo.Query<
  CharacterByOwnerQuery,
  CharacterByOwnerQueryVariables
> {
  document = CharacterByOwnerDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RollCharacterDocument = gql`
  mutation rollCharacter($id: String!) {
    reroll(id: $id) {
      ...CharacterParts
    }
  }
  ${CharacterPartsFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class RollCharacterGQL extends Apollo.Mutation<
  RollCharacterMutation,
  RollCharacterMutationVariables
> {
  document = RollCharacterDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetInstallDocument = gql`
  query getInstall($team_id: String!) {
    install(team_id: $team_id) {
      ...SlackInstallParts
    }
  }
  ${SlackInstallPartsFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class GetInstallGQL extends Apollo.Query<
  GetInstallQuery,
  GetInstallQueryVariables
> {
  document = GetInstallDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateInstallDocument = gql`
  mutation updateInstall($input: UpdateSlackInstallInput!) {
    updateInstall(input: $input) {
      ...SlackInstallParts
    }
  }
  ${SlackInstallPartsFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateInstallGQL extends Apollo.Mutation<
  UpdateInstallMutation,
  UpdateInstallMutationVariables
> {
  document = UpdateInstallDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateInstallDocument = gql`
  mutation createInstall($input: CreateSlackInstallInput!) {
    createInstall(input: $input) {
      ...SlackInstallParts
    }
  }
  ${SlackInstallPartsFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class CreateInstallGQL extends Apollo.Mutation<
  CreateInstallMutation,
  CreateInstallMutationVariables
> {
  document = CreateInstallDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveInstallDocument = gql`
  mutation removeInstall($team_id: String!) {
    removeInstall(team_id: $team_id)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveInstallGQL extends Apollo.Mutation<
  RemoveInstallMutation,
  RemoveInstallMutationVariables
> {
  document = RemoveInstallDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GiveRewardDocument = gql`
  mutation giveReward($from: String!, $to: String!) {
    giveReward(input: { from: $from, to: $to })
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GiveRewardGQL extends Apollo.Mutation<
  GiveRewardMutation,
  GiveRewardMutationVariables
> {
  document = GiveRewardDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RewardsGivenTodayDocument = gql`
  query rewardsGivenToday($user: String!) {
    rewardsGivenToday(user: $user)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RewardsGivenTodayGQL extends Apollo.Query<
  RewardsGivenTodayQuery,
  RewardsGivenTodayQueryVariables
> {
  document = RewardsGivenTodayDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

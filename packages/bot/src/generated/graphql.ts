import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type AttackDetails = {
  __typename?: 'AttackDetails';
  attackModifier: Scalars['Float']['output'];
  attackRoll: Scalars['Float']['output'];
  damage: Scalars['Float']['output'];
  defenderAc: Scalars['Float']['output'];
  defenderHitPoints: Scalars['Float']['output'];
  hit: Scalars['Boolean']['output'];
};

export type AttackLog = BaseLog & {
  __typename?: 'AttackLog';
  actor: Character;
  details: AttackDetails;
  round: Scalars['Float']['output'];
  target: Character;
  type: CombatLogType;
};

export type BaseLog = {
  actor: Character;
  round: Scalars['Float']['output'];
  target: Character;
  type: CombatLogType;
};

export type Character = {
  __typename?: 'Character';
  active: Scalars['Boolean']['output'];
  constitution: Scalars['Float']['output'];
  dexterity: Scalars['Float']['output'];
  experiencePoints: Scalars['Float']['output'];
  extraPoints: Scalars['Float']['output'];
  gold: Scalars['Float']['output'];
  hitPoints: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['Float']['output'];
  losses: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  rolls: Scalars['Float']['output'];
  strength: Scalars['Float']['output'];
  teamId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  wins: Scalars['Float']['output'];
};

export type CombatEnd = {
  __typename?: 'CombatEnd';
  logs: Array<LogUnion>;
  loser: Character;
  winner: Character;
};

export type CombatInput = {
  attackerId: Scalars['String']['input'];
  defenderId: Scalars['String']['input'];
};

/** The type of combat log */
export enum CombatLogType {
  Attack = 'ATTACK',
  Initiative = 'INITIATIVE',
  Levelup = 'LEVELUP',
  Xpgain = 'XPGAIN'
}

export type CreateCharacterDto = {
  name: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type InitiativeLog = BaseLog & {
  __typename?: 'InitiativeLog';
  actor: Character;
  round: Scalars['Float']['output'];
  target: Character;
  type: CombatLogType;
};

export type LevelUpDetails = {
  __typename?: 'LevelUpDetails';
  newLevel: Scalars['Float']['output'];
};

export type LevelUpLog = BaseLog & {
  __typename?: 'LevelUpLog';
  actor: Character;
  details: LevelUpDetails;
  round: Scalars['Float']['output'];
  target: Character;
  type: CombatLogType;
};

export type LogUnion = AttackLog | InitiativeLog | LevelUpLog | XpGainLog;

export type Mutation = {
  __typename?: 'Mutation';
  combat: CombatEnd;
  createCharacter: Character;
  deleteCharacter: Scalars['JSON']['output'];
};


export type MutationCombatArgs = {
  info: CombatInput;
};


export type MutationCreateCharacterArgs = {
  CreateCharacter: CreateCharacterDto;
};


export type MutationDeleteCharacterArgs = {
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getCharacter: Character;
  getCharacters: Array<Character>;
  getCharactersByOwner: Array<Character>;
};


export type QueryGetCharacterArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetCharactersByOwnerArgs = {
  id: Scalars['String']['input'];
  team: Scalars['String']['input'];
};

export type XpGainDetails = {
  __typename?: 'XPGainDetails';
  xp: Scalars['Float']['output'];
};

export type XpGainLog = BaseLog & {
  __typename?: 'XPGainLog';
  actor: Character;
  details: XpGainDetails;
  round: Scalars['Float']['output'];
  target: Character;
  type: CombatLogType;
};

export type CharacterPartsFragment = { __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active: boolean, hitPoints: number, losses: number, wins: number };

export type GetCharactersByOwnerQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
}>;


export type GetCharactersByOwnerQuery = { __typename?: 'Query', getCharactersByOwner: Array<{ __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active: boolean, hitPoints: number, losses: number, wins: number }> };

export type CreateCharacterMutationVariables = Exact<{
  input: CreateCharacterDto;
}>;


export type CreateCharacterMutation = { __typename?: 'Mutation', createCharacter: { __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active: boolean, hitPoints: number, losses: number, wins: number } };

export const CharacterPartsFragmentDoc = gql`
    fragment CharacterParts on Character {
  dexterity
  constitution
  strength
  name
  experiencePoints
  rolls
  level
  userId
  id
  gold
  teamId
  extraPoints
  active
  hitPoints
  losses
  wins
}
    `;
export const GetCharactersByOwnerDocument = gql`
    query getCharactersByOwner($userId: String!, $teamId: String!) {
  getCharactersByOwner(id: $userId, team: $teamId) {
    ...CharacterParts
  }
}
    ${CharacterPartsFragmentDoc}`;
export const CreateCharacterDocument = gql`
    mutation createCharacter($input: CreateCharacterDto!) {
  createCharacter(CreateCharacter: $input) {
    ...CharacterParts
  }
}
    ${CharacterPartsFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getCharactersByOwner(variables: GetCharactersByOwnerQueryVariables, options?: C): Promise<GetCharactersByOwnerQuery> {
      return requester<GetCharactersByOwnerQuery, GetCharactersByOwnerQueryVariables>(GetCharactersByOwnerDocument, variables, options) as Promise<GetCharactersByOwnerQuery>;
    },
    createCharacter(variables: CreateCharacterMutationVariables, options?: C): Promise<CreateCharacterMutation> {
      return requester<CreateCharacterMutation, CreateCharacterMutationVariables>(CreateCharacterDocument, variables, options) as Promise<CreateCharacterMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
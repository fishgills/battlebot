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
  DateTime: { input: any; output: any; }
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
  active?: Maybe<Scalars['DateTime']['output']>;
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
  reroll: Character;
  startCombat: CombatEnd;
  updateCharacter: Character;
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


export type MutationRerollArgs = {
  id: Scalars['String']['input'];
};


export type MutationStartCombatArgs = {
  id1: Scalars['String']['input'];
  id2: Scalars['String']['input'];
};


export type MutationUpdateCharacterArgs = {
  id: Scalars['String']['input'];
  input: UpdateCharacterDto;
};

export type Query = {
  __typename?: 'Query';
  getCharacterById: Character;
  getCharacterByOwner: Character;
  getCharacters: Array<Character>;
};


export type QueryGetCharacterByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetCharacterByOwnerArgs = {
  id: Scalars['String']['input'];
  team: Scalars['String']['input'];
};

export type UpdateCharacterDto = {
  active?: InputMaybe<Scalars['DateTime']['input']>;
  defense?: InputMaybe<Scalars['Float']['input']>;
  extraPoints?: InputMaybe<Scalars['Float']['input']>;
  strength?: InputMaybe<Scalars['Float']['input']>;
  vitality?: InputMaybe<Scalars['Float']['input']>;
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

export type CharacterPartsFragment = { __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active?: any | null, hitPoints: number, losses: number, wins: number };

export type GetCharacterByOwnerQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
}>;


export type GetCharacterByOwnerQuery = { __typename?: 'Query', getCharacterByOwner: { __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active?: any | null, hitPoints: number, losses: number, wins: number } };

export type CreateCharacterMutationVariables = Exact<{
  input: CreateCharacterDto;
}>;


export type CreateCharacterMutation = { __typename?: 'Mutation', createCharacter: { __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active?: any | null, hitPoints: number, losses: number, wins: number } };

export type DeleteCharacterMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCharacterMutation = { __typename?: 'Mutation', deleteCharacter: any };

export type RerollCharacterMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RerollCharacterMutation = { __typename?: 'Mutation', reroll: { __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active?: any | null, hitPoints: number, losses: number, wins: number } };

export type UpdateCharacterMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateCharacterDto;
}>;


export type UpdateCharacterMutation = { __typename?: 'Mutation', updateCharacter: { __typename?: 'Character', dexterity: number, constitution: number, strength: number, name: string, experiencePoints: number, rolls: number, level: number, userId: string, id: string, gold: number, teamId: string, extraPoints: number, active?: any | null, hitPoints: number, losses: number, wins: number } };

export type CombatMutationVariables = Exact<{
  input: CombatInput;
}>;


export type CombatMutation = { __typename?: 'Mutation', combat: { __typename?: 'CombatEnd', logs: Array<{ __typename?: 'AttackLog', round: number, type: CombatLogType, actor: { __typename?: 'Character', name: string }, target: { __typename?: 'Character', name: string }, details: { __typename?: 'AttackDetails', attackModifier: number, attackRoll: number, damage: number, defenderAc: number, defenderHitPoints: number, hit: boolean } } | { __typename?: 'InitiativeLog', round: number, type: CombatLogType, actor: { __typename?: 'Character', name: string }, target: { __typename?: 'Character', name: string } } | { __typename?: 'LevelUpLog', round: number, type: CombatLogType, actor: { __typename?: 'Character', name: string }, target: { __typename?: 'Character', name: string } } | { __typename?: 'XPGainLog', round: number, type: CombatLogType, actor: { __typename?: 'Character', name: string }, target: { __typename?: 'Character', name: string } }>, loser: { __typename?: 'Character', name: string }, winner: { __typename?: 'Character', name: string } } };

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
export const GetCharacterByOwnerDocument = gql`
    query getCharacterByOwner($userId: String!, $teamId: String!) {
  getCharacterByOwner(id: $userId, team: $teamId) {
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
export const DeleteCharacterDocument = gql`
    mutation deleteCharacter($id: String!) {
  deleteCharacter(id: $id)
}
    `;
export const RerollCharacterDocument = gql`
    mutation rerollCharacter($id: String!) {
  reroll(id: $id) {
    ...CharacterParts
  }
}
    ${CharacterPartsFragmentDoc}`;
export const UpdateCharacterDocument = gql`
    mutation updateCharacter($id: String!, $input: UpdateCharacterDto!) {
  updateCharacter(id: $id, input: $input) {
    ...CharacterParts
  }
}
    ${CharacterPartsFragmentDoc}`;
export const CombatDocument = gql`
    mutation Combat($input: CombatInput!) {
  combat(info: $input) {
    logs {
      ... on AttackLog {
        round
        type
        actor {
          name
        }
        target {
          name
        }
        details {
          attackModifier
          attackRoll
          damage
          defenderAc
          defenderHitPoints
          hit
        }
      }
      ... on InitiativeLog {
        actor {
          name
        }
        target {
          name
        }
        round
        type
      }
      ... on LevelUpLog {
        actor {
          name
        }
        target {
          name
        }
        round
        type
      }
      ... on XPGainLog {
        actor {
          name
        }
        target {
          name
        }
        round
        type
      }
    }
    loser {
      name
    }
    winner {
      name
    }
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getCharacterByOwner(variables: GetCharacterByOwnerQueryVariables, options?: C): Promise<GetCharacterByOwnerQuery> {
      return requester<GetCharacterByOwnerQuery, GetCharacterByOwnerQueryVariables>(GetCharacterByOwnerDocument, variables, options) as Promise<GetCharacterByOwnerQuery>;
    },
    createCharacter(variables: CreateCharacterMutationVariables, options?: C): Promise<CreateCharacterMutation> {
      return requester<CreateCharacterMutation, CreateCharacterMutationVariables>(CreateCharacterDocument, variables, options) as Promise<CreateCharacterMutation>;
    },
    deleteCharacter(variables: DeleteCharacterMutationVariables, options?: C): Promise<DeleteCharacterMutation> {
      return requester<DeleteCharacterMutation, DeleteCharacterMutationVariables>(DeleteCharacterDocument, variables, options) as Promise<DeleteCharacterMutation>;
    },
    rerollCharacter(variables: RerollCharacterMutationVariables, options?: C): Promise<RerollCharacterMutation> {
      return requester<RerollCharacterMutation, RerollCharacterMutationVariables>(RerollCharacterDocument, variables, options) as Promise<RerollCharacterMutation>;
    },
    updateCharacter(variables: UpdateCharacterMutationVariables, options?: C): Promise<UpdateCharacterMutation> {
      return requester<UpdateCharacterMutation, UpdateCharacterMutationVariables>(UpdateCharacterDocument, variables, options) as Promise<UpdateCharacterMutation>;
    },
    Combat(variables: CombatMutationVariables, options?: C): Promise<CombatMutation> {
      return requester<CombatMutation, CombatMutationVariables>(CombatDocument, variables, options) as Promise<CombatMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
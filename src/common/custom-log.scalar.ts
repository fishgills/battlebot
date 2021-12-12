import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ValueNode, Kind } from 'graphql';
import { TLogEntry } from 'src/battle/types';

@Scalar('BattleLog')
export class BattleLogScalar implements CustomScalar<string, TLogEntry[]> {
  description = 'Battle Log';
  parseValue(value: string): TLogEntry[] {
    return JSON.parse(value);
  }

  serialize(value: TLogEntry[]): string {
    return JSON.stringify(value);
  }
  parseLiteral(ast: ValueNode): TLogEntry[] {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }
}

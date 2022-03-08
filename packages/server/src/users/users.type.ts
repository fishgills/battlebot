import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'auth/roles/role.enum';

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  role: Role;
}

@ObjectType()
export class UserWithPasswordType extends UserType {
  @Field()
  password: string;
}

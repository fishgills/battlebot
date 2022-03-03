import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  username: string;

  //   @Field()
  //   password: string;
}

@ObjectType()
export class UserWithPasswordType extends UserType {
  @Field()
  password: string;
}

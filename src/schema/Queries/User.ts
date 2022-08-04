import { GraphQLID, GraphQLList } from "graphql";
import { Users } from "../../Entities/Users";
import { UserType } from "../typeDefs/User";

export const GET_ALL_USERS = {
  type: new GraphQLList(UserType),

  async resolve() {
    const result = await Users.find();

    return result;
  },
};

export const GET_USER = {
  type: UserType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_: any, args: any) {
    const { id } = args;

    const result = await Users.findOne({
      where: { id: id },
    });

    return result;
  },
};

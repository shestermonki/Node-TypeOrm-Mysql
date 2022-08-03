import { GraphQLString, GraphQLObjectType, GraphQLNonNull } from "graphql";
import { AppDataSource } from "../../db";
import { Users } from "../../Entities/Users";
import bcrypt from "bcryptjs";
import { UserType } from "../typeDefs/User";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export const CREATE_USER = {
  type: UserType,
  //type: GraphQLString,
  //VAS A RECIBIR ARGUMENTOS
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, args: any) {
    const { name, username, password } = args;

    const hasPassword = await bcrypt.hash(password, 10);

    const result = await Users.insert({
      name,
      username,
      password: hasPassword,
    });

    return { ...args, id: result.identifiers[0].id, password: hasPassword };
  },
};

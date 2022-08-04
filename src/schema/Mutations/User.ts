import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
} from "graphql";
import { AppDataSource } from "../../db";
import { Users } from "../../Entities/Users";
import bcrypt from "bcryptjs";
import { UserType } from "../typeDefs/User";
import { MessageType } from "../typeDefs/Message";

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

export const DELETE_USER = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(_: any, { id }: any) {
    // const { id } = args;

    const result = await Users.delete(id);
    console.log(result);

    if (result.affected === 1) return true;
    return false;
  },
};

export const UPDATE_USER = {
  type: MessageType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },

    /*  ESTO ES UNA MANERA DE HACER PERO SE PUEDE HACER MAS CORTO DE LA SIGUEINTE MANERA
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    oldPassword: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },*/
    input: {
      //ESTOS DATOS VAS A RECIBIR PARA PODER ACTUALIZAR
      type: new GraphQLInputObjectType({
        name: "UserInput",
        fields: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          username: { type: new GraphQLNonNull(GraphQLString) },
          oldPassword: { type: new GraphQLNonNull(GraphQLString) },
          newPassword: { type: new GraphQLNonNull(GraphQLString) },
        },
      }),
    },
  },

  async resolve(_: any, { id,input}: any) {
    // const { id } = args;

    const userBuscado = await Users.findOne({
      where: { id: id },
    });

    //SI EL USUARIO QUE QUIERO ACTUALIZAR NO CONSIDE O NO EXISTE RETORNAME FALSE
    if (!userBuscado)
      return {
        success: false,
        message: "User no foud ",
      };

    const isMathc = await bcrypt.compare(
      input.oldPassword,
      userBuscado?.password as string
    );
    //SI EL USUARIO QUE QUIERO ACTUALIZAR NO CONSIDE O NO EXISTE RETORNAME FALSE
    if (!isMathc)
      return {
        success: false,
        message: "Old password is Incorrect",
      };

    //SI LA CONTRASEÑA NO CONSIDE CON LA PASS DEL USUARIO RETORNAME FALSE
    if (!isMathc) return false;

    const newPassEcryp = await bcrypt.hash(input.newPassword, 10);

    const result = await Users.update(
      { id },
      { name: input.name, username:input.username, password: newPassEcryp }
    );

    //EN CASO QUE ME PASE UN ID NO EXISTENTE DEVUELVE ESTO
    if (result.affected === 0) return true;

    return {
      success: true,
      message: "User update successfully",
    };
  },
};

/**
 * updateUser(
  id:2,
  input:{
  name:"susana",
  username:"lovato",
  oldPassword:"12345e6",
  newPassword:"shester"
  }
  
){
  success
  message
}
}
 */
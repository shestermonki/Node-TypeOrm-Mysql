import { DataSource } from "typeorm";
import { Users } from "./Entities/Users";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "login_node",
  synchronize: true,
  //logging: true,
  entities: [Users],
  subscribers: [],
  migrations: [],
});


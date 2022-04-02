import {DataSource} from "typeorm";
import {Product} from "../entity/product";

export const AppDataSource = new DataSource(
    {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "yt_node_admin",
        entities: [
            Product
        ],
        logging: true,
        synchronize: true
    }
)


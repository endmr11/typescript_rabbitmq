import {DataSource} from "typeorm";
import {Product} from "../entity/product";
import {qChannel} from "../app";

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "127.0.0.1:27017",
    useNewUrlParser: true,
    database: "yt_node_main",
    useUnifiedTopology: true,
    synchronize: true,
    logging: true,
    entities: [Product]
})







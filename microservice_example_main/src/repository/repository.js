"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var product_1 = require("../entity/product");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mongodb",
    host: "127.0.0.1:27017",
    useNewUrlParser: true,
    database: "yt_node_main",
    useUnifiedTopology: true,
    synchronize: true,
    logging: true,
    entities: [product_1.Product]
});

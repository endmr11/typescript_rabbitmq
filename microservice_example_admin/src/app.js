"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qChannel = void 0;
var express = require("express");
var cors = require("cors");
var amqp = require("amqplib/callback_api");
var routers_1 = require("./routers/routers");
var repository_1 = require("./repository/repository");
var dotenv = require("dotenv");
dotenv.config();
repository_1.AppDataSource.initialize().then(function () {
    amqp.connect(process.env.AMQP_URL, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            exports.qChannel = channel;
            var app = express();
            app.use(cors({
                origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
            }));
            app.use(express.json());
            app.use(routers_1.Routers);
            console.log('listening port: 8000');
            app.listen(8000);
            process.on('beforeExit', function () {
                console.log('closing');
                connection.close();
            });
        });
    });
}).catch(function (error) { return console.log(error); });

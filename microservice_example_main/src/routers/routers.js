"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
var express = require("express");
var controllers_1 = require("../controllers/controllers");
exports.Routers = express.Router();
exports.Routers.get('/api/products', controllers_1.getProductsController);
exports.Routers.post('/api/products/:id/like', controllers_1.postProductLikeController);

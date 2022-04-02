import * as express from 'express'
import axios from "axios";
import {getProductsController, postProductLikeController} from "../controllers/controllers";

export const Routers = express.Router();


Routers.get('/api/products', getProductsController)

Routers.post('/api/products/:id/like', postProductLikeController)
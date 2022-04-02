import * as express from 'express'
import {
    deleteProductController,
    getProductController,
    getProductsController, postProductLikeController,
    postProductsController,
    putProductController
} from "../controllers/controllers";

export const Routers = express.Router();

Routers.get('/api/products', getProductsController)

Routers.post('/api/products', postProductsController)

Routers.get('/api/products/:id', getProductController)

Routers.put('/api/products/:id', putProductController)

Routers.delete('/api/products/:id', deleteProductController)

Routers.post('/api/products/:id/like', postProductLikeController)
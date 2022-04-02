import {AppDataSource} from "../repository/repository";
import {Product} from "../entity/product";
import {qChannel} from "../app";

const productRepository = AppDataSource.getRepository(Product)

export const getProductsController = async (req, res) => {
    try {
        const products = await productRepository.find()
        res.json(products);
    } catch (e) {
        res.send(e.message)
    }
}

export const postProductsController = async (req, res) => {
    try {
        const products = productRepository.create(req.body)
        const result = await productRepository.save(products)
        qChannel.sendToQueue('product_created', Buffer.from(JSON.stringify(result)))
        res.send(result)
    } catch (e) {
        res.send(e.message)
    }
}

export const getProductController = async (req, res) => {
    try {
        const product = await productRepository.findOne({where: {id: parseInt(req.params.id)}})
        res.send(product)
    } catch (e) {
        res.send(e.message)
    }
}
export const postProductLikeController = async (req, res) => {
    try {
        const product = await productRepository.findOne({where: {id: parseInt(req.params.id)}})
        product.likes++
        const result = await productRepository.save(product)
        res.send(result)
    } catch (e) {
        res.send(e.message)
    }
}
export const putProductController = async (req, res) => {
    try {
        const product = await productRepository.findOne({where: {id: parseInt(req.params.id)}})
        productRepository.merge(product, req.body)
        const result = await productRepository.save(product)
        qChannel.sendToQueue('product_updated', Buffer.from(JSON.stringify(result)))
        res.send(result)
    } catch (e) {
        res.send(e.message)
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const result = await productRepository.delete(req.params.id)
        qChannel.sendToQueue('product_deleted', Buffer.from(req.params.id))
        res.send(result)
    } catch (e) {
        res.send(e.message)
    }
}
import {AppDataSource} from "../repository/repository";
import {Product} from "../entity/product";
import axios from "axios";

const productRepository = AppDataSource.getMongoRepository(Product)


export const getProductsController = async (req, res) => {
    try {
        const products = await productRepository.find()
        res.send(products);
    } catch (e) {
        res.send(e.message)
    }
}

export const postProductLikeController = async (req, res) => {
    try {
        const product = await productRepository.findOneBy(req.params.id)
        await axios.post(`http://localhost:8000/api/products/${product.admin_id}/like`, {})
        product.likes++
        await productRepository.save(product)
        res.send(product)
    } catch (e) {
        res.send(e.message)
    }
}
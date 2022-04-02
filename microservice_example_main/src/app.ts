import * as express from 'express'
import * as cors from 'cors'
import {Product} from "./entity/product"
import * as amqp from 'amqplib/callback_api'
import {Routers} from "./routers/routers";
import {AppDataSource} from "./repository/repository";
import * as dotenv from "dotenv"

export var qChannel
dotenv.config()

AppDataSource.initialize().then(() => {
    const productRepository = AppDataSource.getMongoRepository(Product)
    amqp.connect(process.env.AMQP_URL, (error0, connection) => {
        if (error0) {
            throw error0
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }
            qChannel = channel
            channel.assertQueue('product_created', {durable: false})
            channel.assertQueue('product_updated', {durable: false})
            channel.assertQueue('product_deleted', {durable: false})

            channel.consume('product_created', async (msg) => {
                try {
                    const eventProduct: Product = JSON.parse(msg.content.toString())
                    const product = new Product()
                    product.admin_id = parseInt(eventProduct.id)
                    product.title = eventProduct.title
                    product.image = eventProduct.image
                    product.likes = eventProduct.likes
                    await productRepository.save(product)
                    console.log('product created')
                } catch (e) {
                    console.log('product created error: ' + e.message)
                }
            }, {noAck: true})

            channel.consume('product_updated', async (msg) => {
                try {
                    const eventProduct: Product = JSON.parse(msg.content.toString())
                    const product = await productRepository.findOneBy(parseInt(eventProduct.id))
                    productRepository.merge(product, {
                        title: eventProduct.title,
                        image: eventProduct.image,
                        likes: eventProduct.likes,
                    })
                    await productRepository.save(product)
                    console.log('product_updated')
                } catch (e) {
                    console.log('product_updated error: ' + e.message)
                }
            }, {noAck: true})

            channel.consume('product_deleted', async (msg) => {
                try {
                    const admin_id = parseInt(msg.content.toString())
                    await productRepository.deleteOne({admin_id})
                    console.log('product_deleted')
                } catch (e) {
                    console.log('product_deleted: ' + e.message)
                }
            }, {noAck: true})

            const app = express()
            app.use(cors({
                origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
            }))
            app.use(express.json())
            app.use(Routers)


            console.log('listening port: 8001')
            app.listen(8001)
            process.on('beforeExit', () => {
                console.log('closing')
                connection.close()
            })
        })
    })

}).catch((error) => console.log(error))
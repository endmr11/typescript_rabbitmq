import * as express from 'express'
import * as cors from 'cors'
import * as amqp from 'amqplib/callback_api'
import {Routers} from "./routers/routers"
import {AppDataSource} from "./repository/repository";
import * as dotenv from "dotenv"

export var qChannel

dotenv.config()


AppDataSource.initialize().then(() => {
    amqp.connect(process.env.AMQP_URL, (error0, connection) => {
        if (error0) {
            throw error0
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }

            qChannel = channel

            const app = express()

            app.use(cors({
                origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
            }))

            app.use(express.json())
            app.use(Routers)

            console.log('listening port: 8000')

            app.listen(8000)
            process.on('beforeExit', () => {
                console.log('closing')
                connection.close()
            })
        })
    })

}).catch((error) => console.log(error))


import express, { Application, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Controller from './interfaces/controller.interface'
import ConstantApi from './constants/api.constant'
import ConstantHttpCode from './constants/http.code.constant'
import ConstantHttpReason from './constants/http.reason.constant'
import ConstantMessage from './constants/message.constant'
import HttpException from './utils/exceptions/http.exception'
import errorMiddleware from './middlewares/error.middleware'

class App {
  public app: Application

  constructor(controllers: Controller[]) {
    this.app = express()

    this.initialiseConfig()
    this.initialiseRoute()
    this.initialiseControllers(controllers)
    this.initialiseErrorHandling()
  }

  private initialiseConfig(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(compression())
    this.app.use(cors())
    this.app.use(helmet())
  }

  private initialiseRoute(): void {
    this.app.get(
      ConstantApi.ROOT,
      (req: Request, res: Response, next: NextFunction) => {
        try {
          return res.status(ConstantHttpCode.OK).json({
            status: {
              code: ConstantHttpCode.OK,
              statusMsg: ConstantHttpReason.OK,
            },
            msg: ConstantMessage.API_WORKING,
          })
        } catch (error: any) {
          return next(
            new HttpException(
              ConstantHttpCode.INTERNAL_SERVER_ERROR,
              ConstantHttpReason.INTERNAL_SERVER_ERROR,
              error.message,
            ),
          )
        }
      },
    )
  }

  private initialiseControllers(contarollers: Controller[]): void {
    contarollers.forEach((controller: Controller) => {
      this.app.use(ConstantApi.API, controller.router)
    })
  }

  private initialiseErrorHandling(): void {
    this.app.use(errorMiddleware)
  }
}

export default App

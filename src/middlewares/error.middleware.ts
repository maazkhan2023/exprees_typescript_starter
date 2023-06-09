import { Request, Response, NextFunction } from 'express'
import HttpException from '../utils/exceptions/http.exception'
import ConstantHttpCode from '../constants/http.code.constant'
import ConstantHttpReason from '../constants/http.reason.constant'
import ConstantMsg from '../constants/message.constant'

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    const statusCode =
      error.statusCode || ConstantHttpCode.INTERNAL_SERVER_ERROR

    const statusMsg =
      error.statusMsg || ConstantHttpReason.INTERNAL_SERVER_ERROR

    const msg = error.msg || ConstantMsg.SOMETHING_WENT_WRONG

    return res.status(statusCode).send({
      status: {
        code: statusCode,
        msg: statusMsg,
      },
      msg,
    })
  } catch (error) {
    return next(error)
  }
}

export default errorMiddleware

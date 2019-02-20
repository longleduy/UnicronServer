import * as LogWriter from '../config/logger'
export const errorHandler = (err, req, res, next) => {
    res.status(204).send('Something broke!');
    LogWriter.ErrorLogger(err.stack);
    console.log(err.stack);
}
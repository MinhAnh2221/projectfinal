const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


const authMiddleWare = (req, res, next) => {

    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'the authentication',
                status: 'ERROR'
            })
        }
        const { ...payload } = user

        if (payload?.isAdmin) {
            req.user = user;
            next()
        }
        else {
            return res.status(404).json({
                message: 'the authentication',
                status: 'ERROR'
            })
        }
    });

}
const authUserMiddleWare = (req, res, next) => {

    const token = req.headers.token.split(' ')[1]
    const userId = req.headers.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'the authentication',
                status: 'ERROR'
            })
        }
        const { ...payload } = user
        if (payload?.isAdmin || payload?.id === userId) {
            req.user = user;
            next()
        }
        else {
            return res.status(404).json({
                message: 'the authentication afssf',
                status: 'ERROR'
            })
        }
    });

}


module.exports = {
    authMiddleWare,
    authUserMiddleWare
}
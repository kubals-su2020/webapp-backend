const jwt = require("jsonwebtoken");
const tokenService = require('./../services/token-service');
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "longer-secret-is-better",(err,user)=>{
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            let getTokenPromise = tokenService.getTokenUserId(user.userId);
            getTokenPromise
            .then((val)=>{
                if(token == val[0].token){
                    next();
                }
                else{
                    res.status(401).json({ message: "Authentication failed!" });
                }
            })
            .catch(renderErrorResponse(res))
            
        });
    } catch (error) {
        res.status(401).json({ message: "Authentication failed!" });
    }
};
/**
 * Throws error if error object is present.
 *
 * @param {Response} response The response object
 * @return {Function} The error handler function.
 */
let renderErrorResponse = (response) => {
    const errorCallback = (error) => {
        if (error) {
            logger.error(error.message,{label :"middleware-auth"})
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};
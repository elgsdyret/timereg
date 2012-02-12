
module.exports = function(){
	return function errorHandling(err, req, res, next) {
        res.statusCode = (err.httpCode && err.httpCode()) || err.errorCode || 500;        
        res.send(err.message || "Server error");
    }
};
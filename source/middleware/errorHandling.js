
module.exports = function(){
	return function errorHandling(err, req, res, next) {        
        res.statusCode = (err.getHttpCode && err.getHttpCode()) || 500;
        res.header('errorMessage', err.message);
        res.json(err);
    }
};
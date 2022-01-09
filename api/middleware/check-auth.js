const jwt = require('jsonwebtoken');


module.exports = (res , req, next) => {
    try {
        const authtoken = req.headers['authorization']
        const token = authtoken.split(" ")[1];
        // const token = req.body.auth ;
        console.log(token);
		const decoded = jwt.verify(req.body.token , 'topsecret');
		req.userData = decoded;
		next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Auth Failed'
        });
    }
};
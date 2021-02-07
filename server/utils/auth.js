const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    // function takes in a user object and add user's username, email, and id properties to the token
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        // secret enables server to verify if it recognizes this token
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    authMiddleware: function({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // separate "Bearer" from "<tokenvalue>"
        if (req.headers.authorization) {
            token = token
                .split(' ')
                .pop()
                .trim();
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        // to preven error thrown on every request, users with invalid token should still be able to request and see all thoughts, thus wrap the verify method in a try...catch statement
        try {
            // decode and attach user data to request object
            // if this secret doesn't match with jwt.sign(), the object won't be decoded
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        // return updated request object
        return req;
    }
}
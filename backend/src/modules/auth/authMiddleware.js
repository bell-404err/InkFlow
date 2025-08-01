import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import dotenv from 'dotenv';

dotenv.config();

const client = jwksClient({
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
        if (err) {
            callback(err, null);
        } else {
            const signingKey = key.getPublicKey();
            callback(null, signingKey);
        }
    });
}

export const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Headers:', req.headers);

    if (!authHeader) {
        return res.status(401).json({ message: "Auth required (no headers)" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        getKey,
        {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER,
            algorithms: ['RS256'],
        },
        (err, decoded) => {
            if (err) {
                console.error("Verification error:", err);
                return res.status(401).json({ message: "Invalid Token" });
            }

            req.user = decoded;
            next();
        }
    );
};

export const checkAuthOptional = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // Нет токена — просто идем дальше (req.user не будет)
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        getKey,
        {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER,
            algorithms: ['RS256'],
        },
        (err, decoded) => {
            if (!err && decoded) {
                req.user = decoded;
            }
            // Если токен битый или истёк — просто не пишем user, идем дальше
            next();
        }
    );
};
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import dotenv from 'dotenv';

dotenv.config();

// Настраиваем клиента для получения публичных ключей Auth0
const client = jwksClient({
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
});

// Функция получения ключа
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

// Middleware для проверки токена
export const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Требуется авторизация (нет заголовка)" });
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
                console.error("Ошибка верификации токена:", err);
                return res.status(401).json({ message: "Неверный токен" });
            }

            req.user = decoded; // Сохраняем расшифрованного пользователя в req.user
            next();
        }
    );
};

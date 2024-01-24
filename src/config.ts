import crypto from 'crypto';

const secretKey = crypto.randomBytes(32).toString('hex');
export const JWT_SECRET = process.env.TOKEN_ENV as string || secretKey;

export const defaultUser = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

export const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\/+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\/+.~#?&//=]*)/;
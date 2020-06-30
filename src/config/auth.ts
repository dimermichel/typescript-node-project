export default {
    jwt: {
        secret: process.env.TOKEN_SECRET || '¯/_(ツ)_/¯',
        expiresIn: '1d',
    },
};

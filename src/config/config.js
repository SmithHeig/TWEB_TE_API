const path = require('path');

const rootPath = path.normalize(`${__dirname}/../..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'API'
    },
    port: process.env.PORT || 3000,
    db: `mongodb://${process.env.MONGODB_HOST_DEV}:${process.env.MONGODB_PORT_DEV}/${process.env.MONGODB_DBNAME_DEV}`,
    jwtSecret: process.env.JWT_SECRET
  },

  test: {
    root: rootPath,
    app: {
      name: 'API'
    },
    port: process.env.PORT || 3000,
    db: `mongodb://${process.env.MONGODB_HOST_TEST}:${process.env.MONGODB_PORT_TEST}/${process.env.MONGODB_DBNAME_TEST}`,
    jwtSecret: process.env.JWT_SECRET
  },

  production: {
    root: rootPath,
    app: {
      name: 'API'
    },
    port: process.env.PORT || 3000,
    db: `mongodb+srv://${process.env.MONGODB_USER_PROD}:${process.env.MONGODB_PWD_PROD}@${process.env.MONGODB_SERVER_PROD}/${process.env.MONGODB_DBNAME_PROD}?retryWrites=true`,
    jwtSecret: process.env.JWT_SECRET
  }
};

module.exports = config[env];

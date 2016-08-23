'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  tokens:{
    messengerSubscribedPageToken: 'EAAZA8Sc41uFEBAMMel3qTncfiPJLjHDmeYEZBpExEKjhjgashtOqv0BgaMrdrd6PxZBineDGQcLHgaqZAJ03jfqwXtPeBJnP5t9MEy1rJHv6puprZC4KmwVBdQzEanQznQ2rdXV6J48RJdyOSgZCaMtHpHIUZBWLwjWSWX1MpZBpAAZDZD'
  },
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/star_womanfreebies_com.key',
    certificate: './config/sslcerts/524f986751cb0805.crt',
    ca: ['./config/sslcerts/gd.crt', './config/sslcerts/gd-1.crt', './config/sslcerts/gd-2.crt']
  },
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/autobot-dev',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
/*  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false
        }
      }
    }
  }, */
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '269893783376466',
    clientSecret: process.env.FACEBOOK_SECRET || 'e6b5f77019c35fac070d6ee4b8a4bbbc',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  livereload: false,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};

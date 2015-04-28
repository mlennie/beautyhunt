/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'beauty-node'
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (process.env.NODE_ENV === 'development') 
    ENV.APP.API_URL = 'http://192.168.10.10:8080'
    ENV.APP.EMBER_URL = 'http://192.168.10.10:4200'
  }

  if (process.env.NODE_ENV === 'test') {
  }

  if (process.env.NODE_ENV === 'production') {
    ENV.APP.API_URL = 'http://46.101.147.71:8080'
    ENV.APP.EMBER_URL = 'http://46.101.147.71:4200'
  }

  return ENV;
};
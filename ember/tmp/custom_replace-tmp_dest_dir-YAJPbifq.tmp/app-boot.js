/* jshint ignore:start */

define('beauty-ember/config/environment', ['ember'], function(Ember) {
  var prefix = 'beauty-ember';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("beauty-ember/tests/test-helper");
} else {
  require("beauty-ember/app")["default"].create({"name":"beauty-ember","version":"0.0.0.d092dd87"});
}

/* jshint ignore:end */

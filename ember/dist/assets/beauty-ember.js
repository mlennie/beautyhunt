/* jshint ignore:start */

/* jshint ignore:end */

define('beauty-ember/adapters/application', ['exports', 'ember-data', 'beauty-ember/config/environment'], function (exports, DS, ENV) {

  'use strict';

  exports['default'] = DS['default'].RESTAdapter.extend({
    host: ENV['default'].APP.API_URL,
    namespace: "api"
  });

});
define('beauty-ember/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'beauty-ember/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('beauty-ember/controllers/users/login', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({

		//queryParams
		queryParams: ["confirmation_success", "confirmation_fail", "editSuccess"],

		//properties
		identification: null,
		editSuccess: false,
		password: null,
		loginError: false,
		confirmation_success: false,
		confirmation_fail: false,
		isLoading: false,

		//actions
		actions: {
			authenticate: function authenticate() {

				var controller = this;
				controller.setProperties({
					confirmation_success: false,
					confirmation_fail: false,
					loginError: false,
					isLoading: true
				});

				//set authentication data to send to rails
				var data = this.getProperties("identification", "password");
				this.get("session").authenticate(this.get("authenticator"), data).then(function () {

					controller.setProperties({
						isLoading: false
					});
				}, function () {
					//show authenticate error if authentication not good
					controller.setProperties({
						loginError: true,
						password: null,
						isLoading: false,
						editSuccess: false
					});
				});
			}
		}
	});

});
define('beauty-ember/controllers/users/register', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    //queryParams

    //properties
    registrationSuccessful: false,
    registrationFailed: false,
    passwordTooShort: false,
    passwordMismatch: false,
    username: null,
    email: null,
    password: null,
    passwordConfirmation: null,
    isLoading: false,

    //computed properties
    user: (function () {
      return this.store.createRecord("user", {});
    }).property(),

    //actions
    actions: {

      registerUser: function registerUser() {
        //check client side validations
        if (this.get("password").length < 6) {
          //set new warning
          this.set("passwordTooShort", true);
        } else if (this.get("password") !== this.get("passwordConfirmation")) {
          //remove old warnings
          this.set("passwordTooShort", false);
          //add new warning
          this.set("passwordMismatch", true);
        } else {
          //send create request

          //add loading spinner
          this.set("isLoading", true);

          //remove error warnings
          this.setProperties({
            passwordMismatch: false,
            passwordTooShort: false
          });

          //set user
          var user = this.get("user");

          //set new attributes
          user.setProperties({
            email: this.get("email"),
            username: this.get("username"),
            password: this.get("password"),
            passwordConfirmation: this.get("passwordConfirmation")
          });

          //setup callbacks for after user request is sent
          var _this = this;
          var onSuccess = function onSuccess() {
            _this.set("isLoading", false);
            _this.set("registrationFailed", false);
            _this.set("registrationSuccessful", true);
          };

          var onFail = function onFail() {
            _this.set("isLoading", false);
            _this.set("registrationFailed", true);
            _this.set("registrationSuccessful", false);
          };

          //send user update request
          user.save().then(onSuccess, onFail);
        }
      }
    }
  });

});
define('beauty-ember/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function faIcon(name, options) {
    if (Ember['default'].typeOf(name) !== "string") {
      var message = "fa-icon: no icon specified";
      warn(message);
      return Ember['default'].String.htmlSafe(message);
    }

    var params = options.hash,
        classNames = [],
        html = "";

    classNames.push("fa");
    if (!name.match(FA_PREFIX)) {
      name = "fa-" + name;
    }
    classNames.push(name);
    if (params.spin) {
      classNames.push("fa-spin");
    }
    if (params.flip) {
      classNames.push("fa-flip-" + params.flip);
    }
    if (params.rotate) {
      classNames.push("fa-rotate-" + params.rotate);
    }
    if (params.lg) {
      warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
      classNames.push("fa-lg");
    }
    if (params.x) {
      warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
      classNames.push("fa-" + params.x + "x");
    }
    if (params.size) {
      if (Ember['default'].typeOf(params.size) === "string" && params.size.match(/\d+/)) {
        params.size = Number(params.size);
      }
      if (Ember['default'].typeOf(params.size) === "number") {
        classNames.push("fa-" + params.size + "x");
      } else {
        classNames.push("fa-" + params.size);
      }
    }
    if (params.fixedWidth) {
      classNames.push("fa-fw");
    }
    if (params.listItem) {
      classNames.push("fa-li");
    }
    if (params.pull) {
      classNames.push("pull-" + params.pull);
    }
    if (params.border) {
      classNames.push("fa-border");
    }
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }

    html += "<";
    var tagName = params.tagName || "i";
    html += tagName;
    html += " class='" + classNames.join(" ") + "'";
    if (params.title) {
      html += " title='" + params.title + "'";
    }
    if (params.ariaHidden === undefined || params.ariaHidden) {
      html += " aria-hidden=\"true\"";
    }
    html += "></" + tagName + ">";
    return Ember['default'].String.htmlSafe(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('beauty-ember/initializers/app-version', ['exports', 'beauty-ember/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('beauty-ember/initializers/export-application-global', ['exports', 'ember', 'beauty-ember/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('beauty-ember/models/user', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    username: DS['default'].attr("string"),
    email: DS['default'].attr("string"),
    password: DS['default'].attr("string"),
    passwordConfirmation: DS['default'].attr("string")
  });

});
define('beauty-ember/router', ['exports', 'ember', 'beauty-ember/config/environment'], function (exports, Ember, config) {

	'use strict';

	var Router = Ember['default'].Router.extend({
			location: config['default'].locationType
	});

	exports['default'] = Router.map(function () {
			this.resource("users", function () {
					this.route("login");
					this.route("register");
					this.route("new-password");
					this.route("edit-password");
					this.route("resend-confirmation");
					this.route("edit");
					this.route("show");
			});
	});

});
define('beauty-ember/routes/users/register', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    setupController: function setupController(controller) {
      controller.setProperties({
        registrationSuccessful: false,
        registrationFailed: false,
        passwordMismatch: false,
        passwordTooShort: false,
        isLoading: false
      });
    }
  });

});
define('beauty-ember/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Beauty Hunt");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","dropdown");
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"href","#");
          dom.setAttribute(el2,"data-toggle","dropdown");
          dom.setAttribute(el2,"role","button");
          dom.setAttribute(el2,"aria-expanded","false");
          dom.setAttribute(el2,"class","dropdown-toggle");
          var el3 = dom.createTextNode("Mon compte");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","caret");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"id","main-nav-dropdown");
          dom.setAttribute(el2,"role","menu");
          dom.setAttribute(el2,"class","dropdown-menu");
          var el3 = dom.createElement("li");
          var el4 = dom.createTextNode("my euros");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createTextNode("my profile");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createTextNode("friend referral");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          dom.setAttribute(el3,"class","divider");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createElement("a");
          var el5 = dom.createTextNode("Se déconnecter");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [0, 1, 4, 0]);
          element(env, element3, context, "action", ["invalidateSession"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Register");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Login");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","nav-link");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","nav-link");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          block(env, morph0, context, "link-to", ["users.register"], {}, child0, null);
          block(env, morph1, context, "link-to", ["users.login"], {}, child1, null);
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","visible-md-block visible-lg-block");
            var el2 = dom.createElement("nav");
            dom.setAttribute(el2,"id","search-navbar");
            dom.setAttribute(el2,"role","navigation");
            dom.setAttribute(el2,"class","navbar navbar-default");
            var el3 = dom.createElement("div");
            dom.setAttribute(el3,"class","container-fluid");
            var el4 = dom.createElement("form");
            dom.setAttribute(el4,"role","search");
            dom.setAttribute(el4,"class","navbar-form navbar-left");
            var el5 = dom.createElement("div");
            dom.setAttribute(el5,"class","form-group");
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"class","search-field");
            var el7 = dom.createComment("");
            dom.appendChild(el6, el7);
            dom.appendChild(el5, el6);
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"id","search-email");
            dom.setAttribute(el6,"class","search-field");
            var el7 = dom.createComment("");
            dom.appendChild(el6, el7);
            dom.appendChild(el5, el6);
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"id","calendar-icon");
            var el7 = dom.createComment("");
            dom.appendChild(el6, el7);
            dom.appendChild(el5, el6);
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"class","search-field");
            var el7 = dom.createComment("");
            dom.appendChild(el6, el7);
            dom.appendChild(el5, el6);
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"class","search-field");
            var el7 = dom.createComment("");
            dom.appendChild(el6, el7);
            dom.appendChild(el5, el6);
            dom.appendChild(el4, el5);
            var el5 = dom.createElement("button");
            dom.setAttribute(el5,"class","btn btn-success");
            var el6 = dom.createTextNode("Rechercher");
            dom.appendChild(el5, el6);
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("div");
            dom.setAttribute(el4,"class","visible-lg-block");
            var el5 = dom.createElement("p");
            var el6 = dom.createTextNode("Rechercher ou réserver par téléphone: 09 90 90 87 85");
            dom.appendChild(el5, el6);
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [0, 0, 0, 0]);
            var element2 = dom.childAt(element1, [0]);
            var morph0 = dom.createMorphAt(dom.childAt(element2, [0]),0,0);
            var morph1 = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
            var morph2 = dom.createMorphAt(dom.childAt(element2, [2]),0,0);
            var morph3 = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
            var morph4 = dom.createMorphAt(dom.childAt(element2, [4]),0,0);
            element(env, element1, context, "action", ["search"], {"on": "submit"});
            inline(env, morph0, context, "view", [get(env, context, "Ember.Select")], {"prompt": "Arrondissment ou Restaurant", "content": get(env, context, "names"), "valueBinding": get(env, context, "name"), "class": "form-control"});
            inline(env, morph1, context, "bootstrap-datepicker", [], {"value": get(env, context, "date"), "format": "dd/mm/yy", "todayBtn": true, "todayHighlight": true, "placeholder": "Date", "language": "fr", "class": "form-control"});
            inline(env, morph2, context, "fa-icon", ["calendar"], {});
            inline(env, morph3, context, "view", [get(env, context, "Ember.Select")], {"content": get(env, context, "hours"), "class": "form-control"});
            inline(env, morph4, context, "view", [get(env, context, "Ember.Select")], {"content": get(env, context, "couverts"), "class": "form-control"});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "unless", [get(env, context, "session.currentUser.isOwner")], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cookie alert alert-warning full-width");
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","row");
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","col-xs-1");
          var el4 = dom.createElement("h3");
          dom.setAttribute(el4,"class","margin-left-10 pull-right");
          var el5 = dom.createTextNode("info");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","col-xs-9");
          var el4 = dom.createElement("strong");
          var el5 = dom.createTextNode("Happy Dining Cookie Policy");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("p");
          var el5 = dom.createTextNode("We use cookies to give you the best possible experience on our website. By continuing to browse this site, you give consent for cookies to be used. For more details, including how you can amend your preferences, please read our Cookie Policy.");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("br");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","col-xs-1");
          var el4 = dom.createElement("button");
          dom.setAttribute(el4,"class","pull-right");
          var el5 = dom.createElement("h3");
          dom.setAttribute(el5,"class","pull-right");
          var el6 = dom.createTextNode("close");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0, 0, 2, 0]);
          element(env, element0, context, "action", [get(env, context, "closeAndAcceptCookies")], {"on": "click"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container-fluid fixed-nav");
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"role","navigation");
        dom.setAttribute(el2,"class","navbar navbar-inverse");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","container-fluid");
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","navbar-header");
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"data-toggle","collapse");
        dom.setAttribute(el5,"data-target","#navbar-collapse-1");
        dom.setAttribute(el5,"class","navbar-toggle collapsed");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","sr-only");
        var el7 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","icon-bar");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","icon-bar");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","icon-bar");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"id","navbar-collapse-1");
        dom.setAttribute(el4,"class","collapse navbar-collapse");
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","nav navbar-nav navbar-right");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("footer");
        dom.setAttribute(el1,"class","footer");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","contact-section");
        dom.setAttribute(el3,"class","row");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, get = hooks.get, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [0, 0]);
        var morph0 = dom.createMorphAt(dom.childAt(element5, [0, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element5, [1, 0]),0,0);
        var morph2 = dom.createMorphAt(element4,1,1);
        var morph3 = dom.createUnsafeMorphAt(fragment,1,1,contextualElement);
        var morph4 = dom.createMorphAt(fragment,2,2,contextualElement);
        block(env, morph0, context, "link-to", ["index"], {}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "session.isAuthenticated")], {}, child1, child2);
        block(env, morph2, context, "if", [get(env, context, "session.isAuthenticated")], {}, child3, null);
        content(env, morph3, context, "outlet");
        block(env, morph4, context, "if", [get(env, context, "showCookieMessage")], {}, child4, null);
        return fragment;
      }
    };
  }()));

});
define('beauty-ember/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","index-page");
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createElement("h1");
        dom.setAttribute(el4,"class","center");
        var el5 = dom.createTextNode("Beauty Insider");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","product-boxes");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","product-box");
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6,"class","center");
        var el7 = dom.createTextNode("Beauty Products");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","product-box");
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6,"class","center");
        var el7 = dom.createTextNode("Fashion");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","product-box");
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6,"class","center");
        var el7 = dom.createTextNode("Accessories");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4 col-sm-offset-4");
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","center");
        var el6 = dom.createTextNode("Hot products");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","list-group");
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","list-group-item");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","margin-left-10 pull-right");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","badge");
        var el8 = dom.createTextNode("495");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("Chanel Love Perfume");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","list-group-item");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","margin-left-10 pull-right");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","badge");
        var el8 = dom.createTextNode("361");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("Dior Spring Jacket");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","list-group-item");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","margin-left-10 pull-right");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","badge");
        var el8 = dom.createTextNode("241");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("H&M red hand bag");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","list-group-item");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","margin-left-10 pull-right");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","badge");
        var el8 = dom.createTextNode("215");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("Forever 21 gold necklace");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","list-group-item");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","margin-left-10 pull-right");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","badge");
        var el8 = dom.createTextNode("187");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("Urban outfitters quilt");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 3, 2, 0, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [0, 0]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [1, 0]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [2, 0]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [3, 0]),0,0);
        var morph4 = dom.createMorphAt(dom.childAt(element0, [4, 0]),0,0);
        inline(env, morph0, context, "fa-icon", ["caret-square-o-up"], {});
        inline(env, morph1, context, "fa-icon", ["caret-square-o-up"], {});
        inline(env, morph2, context, "fa-icon", ["caret-square-o-up"], {});
        inline(env, morph3, context, "fa-icon", ["caret-square-o-up"], {});
        inline(env, morph4, context, "fa-icon", ["caret-square-o-up"], {});
        return fragment;
      }
    };
  }()));

});
define('beauty-ember/templates/users/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-success");
          var el2 = dom.createTextNode("Your password was succesfully reset.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-danger");
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Could not login:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          var el3 = dom.createElement("li");
          var el4 = dom.createTextNode("Please make sure that the email and password are correct.");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createTextNode("Did you confirm your account? If not you can resend a confirmation email here: resend link");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-success");
          var el2 = dom.createTextNode("Your account is now confirmed. You make now login.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-danger");
          var el2 = dom.createTextNode("Confirmation failed. Either you have already confirmed your account, or this user does not exist. ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("h1");
          dom.setAttribute(el1,"class","center");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          inline(env, morph0, context, "fa-icon", ["fa-spin fa-spinner"], {});
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("forgot password?");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Never received confirmation email?");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Sign up");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","col-md-4 col-md-offset-4");
          var el2 = dom.createElement("h4");
          dom.setAttribute(el2,"class","center");
          var el3 = dom.createTextNode("Login");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("form");
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","input-group full-width");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","input-group full-width");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","small black-link margin-top-10");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","small black-link");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","small padding-top-5 input-group");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"class","margin-left-10");
          var el5 = dom.createTextNode("Remember me");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"type","submit");
          dom.setAttribute(el3,"class","btn center full-width");
          var el4 = dom.createTextNode("Login");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("hr");
          dom.setAttribute(el3,"class","black-line");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h6");
          dom.setAttribute(el3,"class","center");
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","black");
          var el5 = dom.createTextNode("Not a member?");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","black-link");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0, 2]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [0]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
          var morph2 = dom.createMorphAt(dom.childAt(element0, [2]),0,0);
          var morph3 = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
          var morph4 = dom.createMorphAt(dom.childAt(element0, [4]),0,0);
          var morph5 = dom.createMorphAt(dom.childAt(element0, [9, 1]),0,0);
          element(env, element0, context, "action", ["authenticate"], {"on": "submit"});
          inline(env, morph0, context, "input", [], {"class": "form-control", "value": get(env, context, "identification"), "placeholder": "Username", "required": true});
          inline(env, morph1, context, "input", [], {"class": "form-control", "value": get(env, context, "password"), "placeholder": "Password", "type": "password", "required": true});
          block(env, morph2, context, "link-to", ["new-password"], {}, child0, null);
          block(env, morph3, context, "link-to", ["resend-confirmation"], {}, child1, null);
          inline(env, morph4, context, "input", [], {"type": "checkbox", "name": "rememberMe"});
          block(env, morph5, context, "link-to", ["users.register"], {}, child2, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","login-page");
        dom.setAttribute(el1,"class","container-fluid");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0, 0]);
        var morph0 = dom.createMorphAt(element1,0,0);
        var morph1 = dom.createMorphAt(element1,1,1);
        var morph2 = dom.createMorphAt(element1,2,2);
        var morph3 = dom.createMorphAt(element1,3,3);
        var morph4 = dom.createMorphAt(element1,4,4);
        block(env, morph0, context, "if", [get(env, context, "editSuccess")], {}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "loginError")], {}, child1, null);
        block(env, morph2, context, "if", [get(env, context, "confirmation_success")], {}, child2, null);
        block(env, morph3, context, "if", [get(env, context, "confirmation_fail")], {}, child3, null);
        block(env, morph4, context, "if", [get(env, context, "isLoading")], {}, child4, child5);
        return fragment;
      }
    };
  }()));

});
define('beauty-ember/templates/users/register', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-danger");
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("User not registered. ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          var el3 = dom.createElement("li");
          var el4 = dom.createTextNode("Email is already associated with an account. If you already have an account associated with this email, please sign in login link");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-success");
          var el2 = dom.createTextNode("Yay you registered You will now receive an email to confirm your registration!");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("h1");
          dom.setAttribute(el1,"class","center");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          inline(env, morph0, context, "fa-icon", ["fa-spin fa-spinner"], {});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","alert alert-danger");
            var el2 = dom.createTextNode("Password must be at least 6 characters");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","alert alert-danger");
            var el2 = dom.createTextNode("Password do not match");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","col-md-4 col-md-offset-4");
          var el2 = dom.createElement("h1");
          dom.setAttribute(el2,"class","center");
          var el3 = dom.createTextNode("Sign Up");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("form");
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","input-group full-width");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","input-group full-width");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","input-group full-width");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","input-group full-width margin-bottom-10");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"type","submit");
          dom.setAttribute(el3,"class","margin-top-10 btn btn-primary btn-lg full-width");
          var el4 = dom.createTextNode("Register");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("Already have an account? Sign in");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [0]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [2]),0,0);
          var morph2 = dom.createMorphAt(element0,4,4);
          var morph3 = dom.createMorphAt(element0,5,5);
          var morph4 = dom.createMorphAt(dom.childAt(element0, [6]),0,0);
          var morph5 = dom.createMorphAt(dom.childAt(element0, [8]),0,0);
          element(env, element0, context, "action", ["registerUser"], {"on": "submit"});
          inline(env, morph0, context, "input", [], {"class": "form-control", "value": get(env, context, "username"), "placeholder": "Username", "required": true});
          inline(env, morph1, context, "input", [], {"class": "form-control", "value": get(env, context, "email"), "placeholder": "Email", "type": "email", "required": true});
          block(env, morph2, context, "if", [get(env, context, "passwordTooShort")], {}, child0, null);
          block(env, morph3, context, "if", [get(env, context, "passwordMismatch")], {}, child1, null);
          inline(env, morph4, context, "input", [], {"class": "form-control", "value": get(env, context, "password"), "placeholder": "Password", "type": "password", "required": true});
          inline(env, morph5, context, "input", [], {"class": "form-control", "value": get(env, context, "passwordConfirmation"), "placeholder": "Password Confirmation", "type": "password", "required": true});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("br");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("br");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("br");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","register-page");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [3, 0]);
        var morph0 = dom.createMorphAt(element1,0,0);
        var morph1 = dom.createMorphAt(element1,1,1);
        var morph2 = dom.createMorphAt(element1,2,2);
        block(env, morph0, context, "if", [get(env, context, "registrationFailed")], {}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "registrationSuccessful")], {}, child1, null);
        block(env, morph2, context, "if", [get(env, context, "isLoading")], {}, child2, child3);
        return fragment;
      }
    };
  }()));

});
define('beauty-ember/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(false, 'adapters/application.js should pass jshint.\nadapters/application.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nadapters/application.js: line 2, col 1, \'import\' is only available in ES6 (use esnext option).\nadapters/application.js: line 4, col 1, \'export\' is only available in ES6 (use esnext option).\n\n3 errors'); 
  });

});
define('beauty-ember/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(false, 'app.js should pass jshint.\napp.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 2, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 3, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 4, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 16, col 1, \'export\' is only available in ES6 (use esnext option).\n\n5 errors'); 
  });

});
define('beauty-ember/tests/controllers/users/login.jshint', function () {

  'use strict';

  module('JSHint - controllers/users');
  test('controllers/users/login.js should pass jshint', function() { 
    ok(false, 'controllers/users/login.js should pass jshint.\ncontrollers/users/login.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\ncontrollers/users/login.js: line 3, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('beauty-ember/tests/controllers/users/register.jshint', function () {

  'use strict';

  module('JSHint - controllers/users');
  test('controllers/users/register.js should pass jshint', function() { 
    ok(false, 'controllers/users/register.js should pass jshint.\ncontrollers/users/register.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\ncontrollers/users/register.js: line 3, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('beauty-ember/tests/helpers/resolver', ['exports', 'ember/resolver', 'beauty-ember/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('beauty-ember/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('beauty-ember/tests/helpers/start-app', ['exports', 'ember', 'beauty-ember/app', 'beauty-ember/router', 'beauty-ember/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('beauty-ember/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('beauty-ember/tests/models/user.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user.js should pass jshint', function() { 
    ok(false, 'models/user.js should pass jshint.\nmodels/user.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nmodels/user.js: line 3, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('beauty-ember/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(false, 'router.js should pass jshint.\nrouter.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nrouter.js: line 2, col 1, \'import\' is only available in ES6 (use esnext option).\nrouter.js: line 8, col 1, \'export\' is only available in ES6 (use esnext option).\n\n3 errors'); 
  });

});
define('beauty-ember/tests/routes/users/register.jshint', function () {

  'use strict';

  module('JSHint - routes/users');
  test('routes/users/register.js should pass jshint', function() { 
    ok(false, 'routes/users/register.js should pass jshint.\nroutes/users/register.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nroutes/users/register.js: line 3, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('beauty-ember/tests/test-helper', ['beauty-ember/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('beauty-ember/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

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
  require("beauty-ember/app")["default"].create({"API_URL":"http://192.168.10.10:8080","EMBER_URL":"http://192.168.10.10:4200","name":"beauty-ember","version":"0.0.0.2b017cb2"});
}

/* jshint ignore:end */
//# sourceMappingURL=beauty-ember.map
define('ember-qunit', ['exports', 'ember-qunit/module-for', 'ember-qunit/module-for-component', 'ember-qunit/module-for-model', 'ember-qunit/test', 'ember-qunit/only', 'ember-test-helpers'], function (exports, moduleFor, moduleForComponent, moduleForModel, test, only, ember_test_helpers) {

  'use strict';



  exports.moduleFor = moduleFor['default'];
  exports.moduleForComponent = moduleForComponent['default'];
  exports.moduleForModel = moduleForModel['default'];
  exports.test = test['default'];
  exports.only = only['default'];
  exports.setResolver = ember_test_helpers.setResolver;

});
define('ember-qunit/module-for-component', ['exports', 'ember-qunit/qunit-module', 'ember-test-helpers'], function (exports, qunit_module, ember_test_helpers) {

  'use strict';

  function moduleForComponent(name, description, callbacks) {
    qunit_module.createModule(ember_test_helpers.TestModuleForComponent, name, description, callbacks);
  }
  exports['default'] = moduleForComponent;

});
define('ember-qunit/module-for-model', ['exports', 'ember-qunit/qunit-module', 'ember-test-helpers'], function (exports, qunit_module, ember_test_helpers) {

  'use strict';

  function moduleForModel(name, description, callbacks) {
    qunit_module.createModule(ember_test_helpers.TestModuleForModel, name, description, callbacks);
  }
  exports['default'] = moduleForModel;

});
define('ember-qunit/module-for', ['exports', 'ember-qunit/qunit-module', 'ember-test-helpers'], function (exports, qunit_module, ember_test_helpers) {

  'use strict';

  function moduleFor(name, description, callbacks) {
    qunit_module.createModule(ember_test_helpers.TestModule, name, description, callbacks);
  }
  exports['default'] = moduleFor;

});
define('ember-qunit/only', ['exports', 'ember-qunit/test-wrapper', 'qunit'], function (exports, testWrapper, qunit) {

  'use strict';

  function only(/* testName, expected, callback, async */) {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
      args[_key] = arguments[_key];
    }
    args.unshift(qunit.only);
    testWrapper['default'].apply(null, args);
  }
  exports['default'] = only;

});
define('ember-qunit/qunit-module', ['exports', 'qunit'], function (exports, qunit) {

  'use strict';

  exports.createModule = createModule;

  function beforeEachCallback(callbacks) {
    if (typeof callbacks !== 'object') { return; }
    if (!callbacks) { return; }

    var beforeEach;

    if (callbacks.setup) {
      beforeEach = callbacks.setup;
      delete callbacks.setup;
    }

    if (callbacks.beforeEach) {
      beforeEach = callbacks.beforeEach;
      delete callbacks.beforeEach;
    }

    return beforeEach;
  }

  function afterEachCallback(callbacks) {
    if (typeof callbacks !== 'object') { return; }
    if (!callbacks) { return; }

    var afterEach;

    if (callbacks.teardown) {
      afterEach = callbacks.teardown;
      delete callbacks.teardown;
    }

    if (callbacks.afterEach) {
      afterEach = callbacks.afterEach;
      delete callbacks.afterEach;
    }

    return afterEach;
  }

  function createModule(Constructor, name, description, callbacks) {
    var beforeEach = beforeEachCallback(callbacks || description);
    var afterEach  = afterEachCallback(callbacks || description);

    var module = new Constructor(name, description, callbacks);

    qunit.module(module.name, {
      setup: function(assert) {
        var done = assert.async();
        return module.setup().then(function() {
          if (beforeEach) {
            beforeEach.call(module.context, assert);
          }
        })['finally'](done);
      },

      teardown: function(assert) {
        if (afterEach) {
          afterEach.call(module.context, assert);
        }
        var done = assert.async();
        return module.teardown()['finally'](done);
      }
    });
  }

});
define('ember-qunit/test-wrapper', ['exports', 'ember', 'ember-test-helpers'], function (exports, Ember, ember_test_helpers) {

  'use strict';

  function testWrapper(qunit /*, testName, expected, callback, async */) {
    var callback;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; ++_key) {
      args[_key - 1] = arguments[_key];
    }

    function wrapper() {
      var context = ember_test_helpers.getContext();

      var result = callback.apply(context, arguments);

      function failTestOnPromiseRejection(reason) {
        var message;
        if (reason instanceof Error) {
          message = reason.stack;
          if (reason.message && message.indexOf(reason.message) < 0) {
            // PhantomJS has a `stack` that does not contain the actual
            // exception message.
            message = Ember['default'].inspect(reason) + "\n" + message;
          }
        } else {
          message = Ember['default'].inspect(reason);
        }
        ok(false, message);
      }

      Ember['default'].run(function(){
        QUnit.stop();
        Ember['default'].RSVP.Promise.resolve(result)['catch'](failTestOnPromiseRejection)['finally'](QUnit.start);
      });
    }

    if (args.length === 2) {
      callback = args.splice(1, 1, wrapper)[0];
    } else {
      callback = args.splice(2, 1, wrapper)[0];
    }

    qunit.apply(null, args);
  }
  exports['default'] = testWrapper;

});
define('ember-qunit/test', ['exports', 'ember-qunit/test-wrapper', 'qunit'], function (exports, testWrapper, qunit) {

  'use strict';

  function test(/* testName, expected, callback, async */) {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
      args[_key] = arguments[_key];
    }
    args.unshift(qunit.test);
    testWrapper['default'].apply(null, args);
  }
  exports['default'] = test;

});
define('ember-test-helpers', ['exports', 'ember', 'ember-test-helpers/test-module', 'ember-test-helpers/test-module-for-acceptance', 'ember-test-helpers/test-module-for-integration', 'ember-test-helpers/test-module-for-component', 'ember-test-helpers/test-module-for-model', 'ember-test-helpers/test-context', 'ember-test-helpers/test-resolver'], function (exports, Ember, TestModule, TestModuleForAcceptance, TestModuleForIntegration, TestModuleForComponent, TestModuleForModel, test_context, test_resolver) {

  'use strict';

  Ember['default'].testing = true;

  exports.TestModule = TestModule['default'];
  exports.TestModuleForAcceptance = TestModuleForAcceptance['default'];
  exports.TestModuleForIntegration = TestModuleForIntegration['default'];
  exports.TestModuleForComponent = TestModuleForComponent['default'];
  exports.TestModuleForModel = TestModuleForModel['default'];
  exports.getContext = test_context.getContext;
  exports.setContext = test_context.setContext;
  exports.setResolver = test_resolver.setResolver;

});
define('ember-test-helpers/abstract-test-module', ['exports', 'klassy', 'ember-test-helpers/wait', 'ember-test-helpers/test-context', 'ember'], function (exports, klassy, wait, test_context, Ember) {

  'use strict';

  exports['default'] = klassy.Klass.extend({
    init(name, options) {
      this.name = name;
      this.callbacks = options || {};

      this.initSetupSteps();
      this.initTeardownSteps();
    },

    setup(assert) {
      return this.invokeSteps(this.setupSteps, this, assert).then(() => {
        this.contextualizeCallbacks();
        return this.invokeSteps(this.contextualizedSetupSteps, this.context, assert);
      });
    },

    teardown(assert) {
      return this.invokeSteps(this.contextualizedTeardownSteps, this.context, assert).then(() => {
        return this.invokeSteps(this.teardownSteps, this, assert);
      }).then(() => {
        this.cache = null;
        this.cachedCalls = null;
      });
    },

    initSetupSteps() {
      this.setupSteps = [];
      this.contextualizedSetupSteps = [];

      if (this.callbacks.beforeSetup) {
        this.setupSteps.push( this.callbacks.beforeSetup );
        delete this.callbacks.beforeSetup;
      }

      this.setupSteps.push(this.setupContext);
      this.setupSteps.push(this.setupTestElements);
      this.setupSteps.push(this.setupAJAXListeners);

      if (this.callbacks.setup) {
        this.contextualizedSetupSteps.push( this.callbacks.setup );
        delete this.callbacks.setup;
      }
    },

    invokeSteps(steps, context, assert) {
      steps = steps.slice();

      function nextStep() {
        var step = steps.shift();
        if (step) {
          // guard against exceptions, for example missing components referenced from needs.
          return new Ember['default'].RSVP.Promise((resolve) => {
            resolve(step.call(context, assert));
          }).then(nextStep);
        } else {
          return Ember['default'].RSVP.resolve();
        }
      }
      return nextStep();
    },

    contextualizeCallbacks() {

    },

    initTeardownSteps() {
      this.teardownSteps = [];
      this.contextualizedTeardownSteps = [];

      if (this.callbacks.teardown) {
        this.contextualizedTeardownSteps.push( this.callbacks.teardown );
        delete this.callbacks.teardown;
      }

      this.teardownSteps.push(this.teardownContext);
      this.teardownSteps.push(this.teardownTestElements);
      this.teardownSteps.push(this.teardownAJAXListeners);

      if (this.callbacks.afterTeardown) {
        this.teardownSteps.push( this.callbacks.afterTeardown );
        delete this.callbacks.afterTeardown;
      }
    },

    setupTestElements() {
      if (Ember['default'].$('#ember-testing').length === 0) {
        Ember['default'].$('<div id="ember-testing"/>').appendTo(document.body);
      }
    },

    setupContext(options) {
      var config = Ember['default'].merge({
        dispatcher: null,
        inject: {}
      }, options);

      test_context.setContext(config);
    },

    setupAJAXListeners() {
      wait._setupAJAXHooks();
    },

    teardownAJAXListeners() {
      wait._teardownAJAXHooks();
    },

    teardownTestElements() {
      Ember['default'].$('#ember-testing').empty();

      // Ember 2.0.0 removed Ember.View as public API, so only do this when
      // Ember.View is present
      if (Ember['default'].View && Ember['default'].View.views) {
        Ember['default'].View.views = {};
      }
    },

    teardownContext() {
      var context = this.context;
      this.context = undefined;
      test_context.unsetContext();

      if (context && context.dispatcher && !context.dispatcher.isDestroyed) {
        Ember['default'].run(function() {
          context.dispatcher.destroy();
        });
      }
    }
  });

});
define('ember-test-helpers/build-registry', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* globals global, self, requirejs, require */

  function exposeRegistryMethodsWithoutDeprecations(container) {
    var methods = [
      'register',
      'unregister',
      'resolve',
      'normalize',
      'typeInjection',
      'injection',
      'factoryInjection',
      'factoryTypeInjection',
      'has',
      'options',
      'optionsForType'
    ];

    function exposeRegistryMethod(container, method) {
      if (method in container) {
        container[method] = function() {
          return container._registry[method].apply(container._registry, arguments);
        };
      }
    }

    for (var i = 0, l = methods.length; i < l; i++) {
      exposeRegistryMethod(container, methods[i]);
    }
  }

  var Owner = (function() {
    if (Ember['default']._RegistryProxyMixin && Ember['default']._ContainerProxyMixin) {
      return Ember['default'].Object.extend(Ember['default']._RegistryProxyMixin, Ember['default']._ContainerProxyMixin);
    }

    return Ember['default'].Object.extend();
  })();

  exports['default'] = function(resolver) {
    var fallbackRegistry, registry, container;
    var namespace = Ember['default'].Object.create({
      Resolver: { create: function() { return resolver; } }
    });

    function register(name, factory) {
      var thingToRegisterWith = registry || container;

      if (!container.lookupFactory(name)) {
        thingToRegisterWith.register(name, factory);
      }
    }

    if (Ember['default'].Application.buildRegistry) {
      fallbackRegistry = Ember['default'].Application.buildRegistry(namespace);
      fallbackRegistry.register('component-lookup:main', Ember['default'].ComponentLookup);

      registry = new Ember['default'].Registry({
        fallback: fallbackRegistry
      });

      // these properties are set on the fallback registry by `buildRegistry`
      // and on the primary registry within the ApplicationInstance constructor
      // but we need to manually recreate them since ApplicationInstance's are not
      // exposed externally
      registry.normalizeFullName = fallbackRegistry.normalizeFullName;
      registry.makeToString = fallbackRegistry.makeToString;
      registry.describe = fallbackRegistry.describe;

      var owner = Owner.create({
        __registry__: registry,
        __container__: null
      });

      container = registry.container({ owner: owner });
      owner.__container__ = container;

      exposeRegistryMethodsWithoutDeprecations(container);
    } else {
      container = Ember['default'].Application.buildContainer(namespace);
      container.register('component-lookup:main', Ember['default'].ComponentLookup);
    }

    // Ember 1.10.0 did not properly add `view:toplevel` or `view:default`
    // to the registry in Ember.Application.buildRegistry :(
    //
    // Ember 2.0.0 removed Ember.View as public API, so only do this when
    // Ember.View is present
    if (Ember['default'].View) {
      register('view:toplevel', Ember['default'].View.extend());
    }

    // Ember 2.0.0 removed Ember._MetamorphView from the Ember global, so only
    // do this when present
    if (Ember['default']._MetamorphView) {
      register('view:default', Ember['default']._MetamorphView);
    }

    var globalContext = typeof global === 'object' && global || self;
    if (requirejs.entries['ember-data/setup-container']) {
      // ember-data is a proper ember-cli addon since 2.3; if no 'import
      // 'ember-data'' is present somewhere in the tests, there is also no `DS`
      // available on the globalContext and hence ember-data wouldn't be setup
      // correctly for the tests; that's why we import and call setupContainer
      // here; also see https://github.com/emberjs/data/issues/4071 for context
      var setupContainer = require('ember-data/setup-container')['default'];
      setupContainer(registry || container);
    } else if (globalContext.DS) {
      var DS = globalContext.DS;
      if (DS._setupContainer) {
        DS._setupContainer(registry || container);
      } else {
        register('transform:boolean', DS.BooleanTransform);
        register('transform:date', DS.DateTransform);
        register('transform:number', DS.NumberTransform);
        register('transform:string', DS.StringTransform);
        register('serializer:-default', DS.JSONSerializer);
        register('serializer:-rest', DS.RESTSerializer);
        register('adapter:-rest', DS.RESTAdapter);
      }
    }

    return {
      registry: registry,
      container: container
    };
  }

});
define('ember-test-helpers/has-ember-version', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  function hasEmberVersion(major, minor) {
    var numbers = Ember['default'].VERSION.split('-')[0].split('.');
    var actualMajor = parseInt(numbers[0], 10);
    var actualMinor = parseInt(numbers[1], 10);
    return actualMajor > major || (actualMajor === major && actualMinor >= minor);
  }
  exports['default'] = hasEmberVersion;

});
define('ember-test-helpers/test-context', ['exports'], function (exports) {

  'use strict';

  exports.setContext = setContext;
  exports.getContext = getContext;
  exports.unsetContext = unsetContext;

  var __test_context__;

  function setContext(context) {
    __test_context__ = context;
  }

  function getContext() {
    return __test_context__;
  }

  function unsetContext() {
    __test_context__ = undefined;
  }

});
define('ember-test-helpers/test-module-for-acceptance', ['exports', 'ember-test-helpers/abstract-test-module', 'ember', 'ember-test-helpers/test-context'], function (exports, AbstractTestModule, Ember, test_context) {

  'use strict';

  exports['default'] = AbstractTestModule['default'].extend({
    setupContext() {
      this._super({ application: this.createApplication() });
    },

    teardownContext() {
      Ember['default'].run(() => {
        test_context.getContext().application.destroy();
      });

      this._super();
    },

    createApplication() {
      let { Application, config } = this.callbacks;
      let application;

      Ember['default'].run(() => {
        application = Application.create(config);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });

});
define('ember-test-helpers/test-module-for-component', ['exports', 'ember-test-helpers/test-module', 'ember', 'ember-test-helpers/test-resolver', 'ember-test-helpers/has-ember-version'], function (exports, TestModule, Ember, test_resolver, hasEmberVersion) {

  'use strict';

  exports['default'] = TestModule['default'].extend({
    isComponentTestModule: true,

    init: function(componentName, description, callbacks) {
      // Allow `description` to be omitted
      if (!callbacks && typeof description === 'object') {
        callbacks = description;
        description = null;
      } else if (!callbacks) {
        callbacks = {};
      }

      this.componentName = componentName;

      if (callbacks.needs || callbacks.unit || callbacks.integration === false) {
        this.isUnitTest = true;
      } else if (callbacks.integration) {
        this.isUnitTest = false;
      } else {
        Ember['default'].deprecate(
          "the component:" + componentName + " test module is implicitly running in unit test mode, " +
          "which will change to integration test mode by default in an upcoming version of " +
          "ember-test-helpers. Add `unit: true` or a `needs:[]` list to explicitly opt in to unit " +
          "test mode.",
          false,
          { id: 'ember-test-helpers.test-module-for-component.test-type', until: '0.6.0' }
        );
        this.isUnitTest = true;
      }

      if (description) {
        this._super.call(this, 'component:' + componentName, description, callbacks);
      } else {
        this._super.call(this, 'component:' + componentName, callbacks);
      }

      if (!this.isUnitTest && !this.isLegacy) {
        callbacks.integration = true;
      }

      if (this.isUnitTest || this.isLegacy) {
        this.setupSteps.push(this.setupComponentUnitTest);
      } else {
        this.callbacks.subject = function() {
          throw new Error("component integration tests do not support `subject()`. Instead, render the component as if it were HTML: `this.render('<my-component foo=true>');`. For more information, read: http://guides.emberjs.com/v2.2.0/testing/testing-components/");
        };
        this.setupSteps.push(this.setupComponentIntegrationTest);
        this.teardownSteps.unshift(this.teardownComponent);
      }

      if (Ember['default'].View && Ember['default'].View.views) {
        this.setupSteps.push(this._aliasViewRegistry);
        this.teardownSteps.unshift(this._resetViewRegistry);
      }
    },

    _aliasViewRegistry: function() {
      this._originalGlobalViewRegistry = Ember['default'].View.views;
      var viewRegistry = this.container.lookup('-view-registry:main');

      if (viewRegistry) {
        Ember['default'].View.views = viewRegistry;
      }
    },

    _resetViewRegistry: function() {
      Ember['default'].View.views = this._originalGlobalViewRegistry;
    },

    setupComponentUnitTest: function() {
      var _this = this;
      var resolver = test_resolver.getResolver();
      var context = this.context;

      var layoutName = 'template:components/' + this.componentName;

      var layout = resolver.resolve(layoutName);

      var thingToRegisterWith = this.registry || this.container;
      if (layout) {
        thingToRegisterWith.register(layoutName, layout);
        thingToRegisterWith.injection(this.subjectName, 'layout', layoutName);
      }

      context.dispatcher = this.container.lookup('event_dispatcher:main') || Ember['default'].EventDispatcher.create();
      context.dispatcher.setup({}, '#ember-testing');

      this.callbacks.render = function() {
        var subject;

        Ember['default'].run(function(){
          subject = context.subject();
          subject.appendTo('#ember-testing');
        });

        _this.teardownSteps.unshift(function() {
          Ember['default'].run(function() {
            Ember['default'].tryInvoke(subject, 'destroy');
          });
        });
      };

      this.callbacks.append = function() {
        Ember['default'].deprecate(
          'this.append() is deprecated. Please use this.render() or this.$() instead.',
          false,
          { id: 'ember-test-helpers.test-module-for-component.append', until: '0.6.0' }
        );
        return context.$();
      };

      context.$ = function() {
        this.render();
        var subject = this.subject();

        return subject.$.apply(subject, arguments);
      };
    },

    setupComponentIntegrationTest: function() {
      var module = this;
      var context = this.context;

      this.actionHooks = {};

      context.dispatcher = this.container.lookup('event_dispatcher:main') || Ember['default'].EventDispatcher.create();
      context.dispatcher.setup({}, '#ember-testing');
      context.actions = module.actionHooks;

      (this.registry || this.container).register('component:-test-holder', Ember['default'].Component.extend());

      context.render = function(template) {
        if (!template) {
          throw new Error("in a component integration test you must pass a template to `render()`");
        }
        if (Ember['default'].isArray(template)) {
          template = template.join('');
        }
        if (typeof template === 'string') {
          template = Ember['default'].Handlebars.compile(template);
        }
        module.component = module.container.lookupFactory('component:-test-holder').create({
          layout: template
        });

        module.component.set('context' ,context);
        module.component.set('controller', context);

        Ember['default'].run(function() {
          module.component.appendTo('#ember-testing');
        });
      };

      context.$ = function() {
        return module.component.$.apply(module.component, arguments);
      };

      context.set = function(key, value) {
        var ret = Ember['default'].run(function() {
          return Ember['default'].set(context, key, value);
        });

        if (hasEmberVersion['default'](2,0)) {
          return ret;
        }
      };

      context.setProperties = function(hash) {
        var ret = Ember['default'].run(function() {
          return Ember['default'].setProperties(context, hash);
        });

        if (hasEmberVersion['default'](2,0)) {
          return ret;
        }
      };

      context.get = function(key) {
        return Ember['default'].get(context, key);
      };

      context.getProperties = function() {
        var args = Array.prototype.slice.call(arguments);
        return Ember['default'].getProperties(context, args);
      };

      context.on = function(actionName, handler) {
        module.actionHooks[actionName] = handler;
      };

      context.send = function(actionName) {
        var hook = module.actionHooks[actionName];
        if (!hook) {
          throw new Error("integration testing template received unexpected action " + actionName);
        }
        hook.apply(module, Array.prototype.slice.call(arguments, 1));
      };

      context.clearRender = function() {
        module.teardownComponent();
      };
    },

    setupContext: function() {
      this._super.call(this);

      // only setup the injection if we are running against a version
      // of Ember that has `-view-registry:main` (Ember >= 1.12)
      if (this.container.lookupFactory('-view-registry:main')) {
        (this.registry || this.container).injection('component', '_viewRegistry', '-view-registry:main');
      }

      if (!this.isUnitTest && !this.isLegacy) {
        this.context.factory = function() {};
      }
    },

    teardownComponent: function() {
      var component = this.component;
      if (component) {
        Ember['default'].run(function() {
          component.destroy();
        });
      }
    }
  });

});
define('ember-test-helpers/test-module-for-integration', ['exports', 'ember', 'ember-test-helpers/test-context', 'ember-test-helpers/abstract-test-module', 'ember-test-helpers/test-resolver', 'ember-test-helpers/build-registry', 'ember-test-helpers/has-ember-version'], function (exports, Ember, test_context, AbstractTestModule, test_resolver, buildRegistry, hasEmberVersion) {

  'use strict';

  exports['default'] = AbstractTestModule['default'].extend({
    initSetupSteps() {
      this.setupSteps = [];
      this.contextualizedSetupSteps = [];

      if (this.callbacks.beforeSetup) {
        this.setupSteps.push( this.callbacks.beforeSetup );
        delete this.callbacks.beforeSetup;
      }

      this.setupSteps.push(this.setupContainer);
      this.setupSteps.push(this.setupContext);
      this.setupSteps.push(this.setupTestElements);
      this.setupSteps.push(this.setupAJAXListeners);
      this.setupSteps.push(this.setupComponentIntegrationTest);

      if (Ember['default'].View && Ember['default'].View.views) {
        this.setupSteps.push(this._aliasViewRegistry);
      }

      if (this.callbacks.setup) {
        this.contextualizedSetupSteps.push(this.callbacks.setup);
        delete this.callbacks.setup;
      }
    },

    initTeardownSteps() {
      this.teardownSteps = [];
      this.contextualizedTeardownSteps = [];

      if (this.callbacks.teardown) {
        this.contextualizedTeardownSteps.push( this.callbacks.teardown );
        delete this.callbacks.teardown;
      }

      this.teardownSteps.push(this.teardownContainer);
      this.teardownSteps.push(this.teardownContext);
      this.teardownSteps.push(this.teardownAJAXListeners);
      this.teardownSteps.push(this.teardownComponent);

      if (Ember['default'].View && Ember['default'].View.views) {
        this.teardownSteps.push(this._resetViewRegistry);
      }

      this.teardownSteps.push(this.teardownTestElements);

      if (this.callbacks.afterTeardown) {
        this.teardownSteps.push(this.callbacks.afterTeardown);
        delete this.callbacks.afterTeardown;
      }
    },

    setupContainer() {
      var resolver = test_resolver.getResolver();
      var items = buildRegistry['default'](resolver);

      this.container = items.container;
      this.registry = items.registry;

      if (hasEmberVersion['default'](1, 13)) {
        var thingToRegisterWith = this.registry || this.container;
        var router = resolver.resolve('router:main');
        router = router || Ember['default'].Router.extend();
        thingToRegisterWith.register('router:main', router);
      }
    },

    setupContext() {
      var subjectName = this.subjectName;
      var container = this.container;

      var factory = function() {
        return container.lookupFactory(subjectName);
      };

      this._super({
        container:  this.container,
        registry: this.registry,
        factory:    factory,
        register() {
          var target = this.registry || this.container;
          return target.register.apply(target, arguments);
        },
      });

      var context = this.context = test_context.getContext();

      if (Ember['default'].setOwner) {
        Ember['default'].setOwner(context, this.container.owner);
      }

      if (Ember['default'].inject) {
        var keys = (Object.keys || Ember['default'].keys)(Ember['default'].inject);
        keys.forEach(function(typeName) {
          context.inject[typeName] = function(name, opts) {
            var alias = (opts && opts.as) || name;
            Ember['default'].set(context, alias, context.container.lookup(typeName + ':' + name));
          };
        });
      }

      // only setup the injection if we are running against a version
      // of Ember that has `-view-registry:main` (Ember >= 1.12)
      if (this.container.lookupFactory('-view-registry:main')) {
        (this.registry || this.container).injection('component', '_viewRegistry', '-view-registry:main');
      }
    },

    setupComponentIntegrationTest: function() {
      var module = this;
      var context = this.context;

      this.actionHooks = {};

      context.dispatcher = this.container.lookup('event_dispatcher:main') || Ember['default'].EventDispatcher.create();
      context.dispatcher.setup({}, '#ember-testing');
      context.actions = module.actionHooks;

      (this.registry || this.container).register('component:-test-holder', Ember['default'].Component.extend());

      context.render = function(template) {
        if (!template) {
          throw new Error("in a component integration test you must pass a template to `render()`");
        }
        if (Ember['default'].isArray(template)) {
          template = template.join('');
        }
        if (typeof template === 'string') {
          template = Ember['default'].Handlebars.compile(template);
        }
        module.component = module.container.lookupFactory('component:-test-holder').create({
          layout: template
        });

        module.component.set('context' ,context);
        module.component.set('controller', context);

        Ember['default'].run(function() {
          module.component.appendTo('#ember-testing');
        });
      };

      context.$ = function() {
        return module.component.$.apply(module.component, arguments);
      };

      context.set = function(key, value) {
        var ret = Ember['default'].run(function() {
          return Ember['default'].set(context, key, value);
        });

        if (hasEmberVersion['default'](2,0)) {
          return ret;
        }
      };

      context.setProperties = function(hash) {
        var ret = Ember['default'].run(function() {
          return Ember['default'].setProperties(context, hash);
        });

        if (hasEmberVersion['default'](2,0)) {
          return ret;
        }
      };

      context.get = function(key) {
        return Ember['default'].get(context, key);
      };

      context.getProperties = function() {
        var args = Array.prototype.slice.call(arguments);
        return Ember['default'].getProperties(context, args);
      };

      context.on = function(actionName, handler) {
        module.actionHooks[actionName] = handler;
      };

      context.send = function(actionName) {
        var hook = module.actionHooks[actionName];
        if (!hook) {
          throw new Error("integration testing template received unexpected action " + actionName);
        }
        hook.apply(module, Array.prototype.slice.call(arguments, 1));
      };

      context.clearRender = function() {
        module.teardownComponent();
      };
    },

    teardownComponent: function() {
      var component = this.component;
      if (component) {
        Ember['default'].run(function() {
          component.destroy();
        });
      }
    },

    teardownContainer() {
      var container = this.container;
      Ember['default'].run(function() {
        container.destroy();
      });
    },

    // allow arbitrary named factories, like rspec let
    contextualizeCallbacks() {
      var callbacks = this.callbacks;
      var context   = this.context;

      this.cache = this.cache || {};
      this.cachedCalls = this.cachedCalls || {};

      var keys = (Object.keys || Ember['default'].keys)(callbacks);
      var keysLength = keys.length;

      if (keysLength) {
        for (var i = 0; i < keysLength; i++) {
          this._contextualizeCallback(context, keys[i], context);
        }
      }
    },

    _contextualizeCallback(context, key, callbackContext) {
      var _this     = this;
      var callbacks = this.callbacks;
      var factory   = context.factory;

      context[key] = function(options) {
        if (_this.cachedCalls[key]) { return _this.cache[key]; }

        var result = callbacks[key].call(callbackContext, options, factory());

        _this.cache[key] = result;
        _this.cachedCalls[key] = true;

        return result;
      };
    },

    _aliasViewRegistry: function() {
      this._originalGlobalViewRegistry = Ember['default'].View.views;
      var viewRegistry = this.container.lookup('-view-registry:main');

      if (viewRegistry) {
        Ember['default'].View.views = viewRegistry;
      }
    },

    _resetViewRegistry: function() {
      Ember['default'].View.views = this._originalGlobalViewRegistry;
    }
  });

});
define('ember-test-helpers/test-module-for-model', ['exports', 'ember-test-helpers/test-module', 'ember'], function (exports, TestModule, Ember) {

  'use strict';

  /* global DS, require, requirejs */ // added here to prevent an import from erroring when ED is not present

  exports['default'] = TestModule['default'].extend({
    init: function(modelName, description, callbacks) {
      this.modelName = modelName;

      this._super.call(this, 'model:' + modelName, description, callbacks);

      this.setupSteps.push(this.setupModel);
    },

    setupModel: function() {
      var container = this.container;
      var defaultSubject = this.defaultSubject;
      var callbacks = this.callbacks;
      var modelName = this.modelName;

      var adapterFactory = container.lookupFactory('adapter:application');
      if (!adapterFactory) {
        if (requirejs.entries['ember-data/adapters/json-api']) {
          adapterFactory = require('ember-data/adapters/json-api')['default'];
        }

        // when ember-data/adapters/json-api is provided via ember-cli shims
        // using Ember Data 1.x the actual JSONAPIAdapter isn't found, but the
        // above require statement returns a bizzaro object with only a `default`
        // property (circular reference actually)
        if (!adapterFactory || !adapterFactory.create) {
          adapterFactory = DS.JSONAPIAdapter || DS.FixtureAdapter;
        }

        var thingToRegisterWith = this.registry || this.container;
        thingToRegisterWith.register('adapter:application', adapterFactory);
      }

      callbacks.store = function(){
        var container = this.container;
        var store = container.lookup('service:store') || container.lookup('store:main');
        return store;
      };

      if (callbacks.subject === defaultSubject) {
        callbacks.subject = function(options) {
          var container = this.container;

          return Ember['default'].run(function() {
            var store = container.lookup('service:store') || container.lookup('store:main');
            return store.createRecord(modelName, options);
          });
        };
      }
    }
  });

});
define('ember-test-helpers/test-module', ['exports', 'ember', 'ember-test-helpers/test-context', 'ember-test-helpers/abstract-test-module', 'ember-test-helpers/test-resolver', 'ember-test-helpers/build-registry', 'ember-test-helpers/has-ember-version'], function (exports, Ember, test_context, AbstractTestModule, test_resolver, buildRegistry, hasEmberVersion) {

  'use strict';

  exports['default'] = AbstractTestModule['default'].extend({
    init: function(subjectName, description, callbacks) {
      // Allow `description` to be omitted, in which case it should
      // default to `subjectName`
      if (!callbacks && typeof description === 'object') {
        callbacks = description;
        description = subjectName;
      }

      this.subjectName = subjectName;
      this.description = description || subjectName;
      this.name = description || subjectName;
      this.callbacks = callbacks || {};

      if (this.callbacks.integration && this.callbacks.needs) {
        throw new Error("cannot declare 'integration: true' and 'needs' in the same module");
      }

      if (this.callbacks.integration) {
        if (this.isComponentTestModule) {
          this.isLegacy = (callbacks.integration === 'legacy');
          this.isIntegration = (callbacks.integration !== 'legacy');
        } else {
          if (callbacks.integration === 'legacy') {
            throw new Error('`integration: \'legacy\'` is only valid for component tests.');
          }
          this.isIntegration = true;
        }

        delete callbacks.integration;
      }

      this.initSubject();
      this.initNeeds();
      this.initSetupSteps();
      this.initTeardownSteps();
    },

    initSubject: function() {
      this.callbacks.subject = this.callbacks.subject || this.defaultSubject;
    },

    initNeeds: function() {
      this.needs = [this.subjectName];
      if (this.callbacks.needs) {
        this.needs = this.needs.concat(this.callbacks.needs);
        delete this.callbacks.needs;
      }
    },

    initSetupSteps: function() {
      this.setupSteps = [];
      this.contextualizedSetupSteps = [];

      if (this.callbacks.beforeSetup) {
        this.setupSteps.push( this.callbacks.beforeSetup );
        delete this.callbacks.beforeSetup;
      }

      this.setupSteps.push(this.setupContainer);
      this.setupSteps.push(this.setupContext);
      this.setupSteps.push(this.setupTestElements);
      this.setupSteps.push(this.setupAJAXListeners);

      if (this.callbacks.setup) {
        this.contextualizedSetupSteps.push( this.callbacks.setup );
        delete this.callbacks.setup;
      }
    },

    initTeardownSteps: function() {
      this.teardownSteps = [];
      this.contextualizedTeardownSteps = [];

      if (this.callbacks.teardown) {
        this.contextualizedTeardownSteps.push( this.callbacks.teardown );
        delete this.callbacks.teardown;
      }

      this.teardownSteps.push(this.teardownSubject);
      this.teardownSteps.push(this.teardownContainer);
      this.teardownSteps.push(this.teardownContext);
      this.teardownSteps.push(this.teardownTestElements);
      this.teardownSteps.push(this.teardownAJAXListeners);

      if (this.callbacks.afterTeardown) {
        this.teardownSteps.push( this.callbacks.afterTeardown );
        delete this.callbacks.afterTeardown;
      }
    },

    setupContainer: function() {
      if (this.isIntegration || this.isLegacy) {
        this._setupIntegratedContainer();
      } else {
        this._setupIsolatedContainer();
      }
    },

    setupContext: function() {
      var subjectName = this.subjectName;
      var container = this.container;

      var factory = function() {
        return container.lookupFactory(subjectName);
      };

      this._super({
        container:  this.container,
        registry: this.registry,
        factory:    factory,
        register: function() {
          var target = this.registry || this.container;
          return target.register.apply(target, arguments);
        },
      });

      var context = this.context = test_context.getContext();

      if (Ember['default'].setOwner) {
        Ember['default'].setOwner(context, this.container.owner);
      }

      if (Ember['default'].inject) {
        var keys = (Object.keys || Ember['default'].keys)(Ember['default'].inject);
        keys.forEach(function(typeName) {
          context.inject[typeName] = function(name, opts) {
            var alias = (opts && opts.as) || name;
            Ember['default'].set(context, alias, context.container.lookup(typeName + ':' + name));
          };
        });
      }
    },

    teardownSubject: function() {
      var subject = this.cache.subject;

      if (subject) {
        Ember['default'].run(function() {
          Ember['default'].tryInvoke(subject, 'destroy');
        });
      }
    },

    teardownContainer: function() {
      var container = this.container;
      Ember['default'].run(function() {
        container.destroy();
      });
    },

    defaultSubject: function(options, factory) {
      return factory.create(options);
    },

    // allow arbitrary named factories, like rspec let
    contextualizeCallbacks: function() {
      var callbacks = this.callbacks;
      var context   = this.context;

      this.cache = this.cache || {};
      this.cachedCalls = this.cachedCalls || {};

      var keys = (Object.keys || Ember['default'].keys)(callbacks);
      var keysLength = keys.length;

      if (keysLength) {
        var deprecatedContext = this._buildDeprecatedContext(this, context);
        for (var i = 0; i < keysLength; i++) {
          this._contextualizeCallback(context, keys[i], deprecatedContext);
        }
      }
    },

    _contextualizeCallback: function(context, key, callbackContext) {
      var _this     = this;
      var callbacks = this.callbacks;
      var factory   = context.factory;

      context[key] = function(options) {
        if (_this.cachedCalls[key]) { return _this.cache[key]; }

        var result = callbacks[key].call(callbackContext, options, factory());

        _this.cache[key] = result;
        _this.cachedCalls[key] = true;

        return result;
      };
    },

    /*
      Builds a version of the passed in context that contains deprecation warnings
      for accessing properties that exist on the module.
    */
    _buildDeprecatedContext: function(module, context) {
      var deprecatedContext = Object.create(context);

      var keysForDeprecation = Object.keys(module);

      for (var i = 0, l = keysForDeprecation.length; i < l; i++) {
        this._proxyDeprecation(module, deprecatedContext, keysForDeprecation[i]);
      }

      return deprecatedContext;
    },

    /*
      Defines a key on an object to act as a proxy for deprecating the original.
    */
    _proxyDeprecation: function(obj, proxy, key) {
      if (typeof proxy[key] === 'undefined') {
        Object.defineProperty(proxy, key, {
          get: function() {
            Ember['default'].deprecate('Accessing the test module property "' + key + '" from a callback is deprecated.', false, { id: 'ember-test-helpers.test-module.callback-context', until: '0.6.0' });
            return obj[key];
          }
        });
      }
    },

    _setupContainer: function(isolated) {
      var resolver = test_resolver.getResolver();

      var items = buildRegistry['default'](!isolated ? resolver : Object.create(resolver, {
        resolve: {
          value: function() {}
        }
      }));

      this.container = items.container;
      this.registry = items.registry;

      if (hasEmberVersion['default'](1, 13)) {
        var thingToRegisterWith = this.registry || this.container;
        var router = resolver.resolve('router:main');
        router = router || Ember['default'].Router.extend();
        thingToRegisterWith.register('router:main', router);
      }
    },

    _setupIsolatedContainer: function() {
      var resolver = test_resolver.getResolver();
      this._setupContainer(true);

      var thingToRegisterWith = this.registry || this.container;

      for (var i = this.needs.length; i > 0; i--) {
        var fullName = this.needs[i - 1];
        var normalizedFullName = resolver.normalize(fullName);
        thingToRegisterWith.register(fullName, resolver.resolve(normalizedFullName));
      }

      if (!this.registry) {
        this.container.resolver = function() {};
      }
    },

    _setupIntegratedContainer: function() {
      this._setupContainer();
    }

  });

});
define('ember-test-helpers/test-resolver', ['exports'], function (exports) {

  'use strict';

  exports.setResolver = setResolver;
  exports.getResolver = getResolver;

  var __resolver__;

  function setResolver(resolver) {
    __resolver__ = resolver;
  }

  function getResolver() {
    if (__resolver__ == null) {
      throw new Error('you must set a resolver with `testResolver.set(resolver)`');
    }

    return __resolver__;
  }

});
define('ember-test-helpers/wait', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports._teardownAJAXHooks = _teardownAJAXHooks;
  exports._setupAJAXHooks = _setupAJAXHooks;

  /* globals jQuery, self */

  var requests;
  function incrementAjaxPendingRequests(_, xhr) {
    requests.push(xhr);
  }

  function decrementAjaxPendingRequests(_, xhr) {
    for (var i = 0;i < requests.length;i++) {
      if (xhr === requests[i]) {
        requests.splice(i, 1);
      }
    }
  }

  function _teardownAJAXHooks() {
    jQuery(document).off('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).off('ajaxComplete', decrementAjaxPendingRequests);
  }

  function _setupAJAXHooks() {
    requests = [];

    jQuery(document).on('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).on('ajaxComplete', decrementAjaxPendingRequests);
  }

  function wait(_options) {
    var options = _options || {};
    var waitForTimers = options.hasOwnProperty('waitForTimers') ? options.waitForTimers : true;
    var waitForAJAX = options.hasOwnProperty('waitForAJAX') ? options.waitForAJAX : true;
    var waitForWaiters = options.hasOwnProperty('waitForWaiters') ? options.waitForWaiters : true;

    return new Ember['default'].RSVP.Promise(function(resolve) {
      var watcher = self.setInterval(function() {
        if (waitForTimers && (Ember['default'].run.hasScheduledTimers() || Ember['default'].run.currentRunLoop)) {
          return;
        }

        if (waitForAJAX && requests && requests.length > 0) {
          return;
        }

        if (waitForWaiters && Ember['default'].Test.waiters && Ember['default'].Test.waiters.any(([context, callback]) => {
              return !callback.call(context);
            })) {
          return;
        }

        // Stop polling
        self.clearInterval(watcher);

        // Synchronously resolve the promise
        Ember['default'].run(null, resolve);
      }, 10);
    });
  }
  exports['default'] = wait;

});
define('klassy', ['exports'], function (exports) {

  'use strict';

  /**
   Extend a class with the properties and methods of one or more other classes.

   When a method is replaced with another method, it will be wrapped in a
   function that makes the replaced method accessible via `this._super`.

   @method extendClass
   @param {Object} destination The class to merge into
   @param {Object} source One or more source classes
   */
  var extendClass = function(destination) {
    var sources = Array.prototype.slice.call(arguments, 1);
    var source;

    for (var i = 0, l = sources.length; i < l; i++) {
      source = sources[i];

      for (var p in source) {
        if (source.hasOwnProperty(p) &&
          destination[p] &&
          typeof destination[p] === 'function' &&
          typeof source[p] === 'function') {

          /* jshint loopfunc:true */
          destination[p] =
            (function(destinationFn, sourceFn) {
              var wrapper = function() {
                var prevSuper = this._super;
                this._super = destinationFn;

                var ret = sourceFn.apply(this, arguments);

                this._super = prevSuper;

                return ret;
              };
              wrapper.wrappedFunction = sourceFn;
              return wrapper;
            })(destination[p], source[p]);

        } else {
          destination[p] = source[p];
        }
      }
    }
  };

  // `subclassing` is a state flag used by `defineClass` to track when a class is
  // being subclassed. It allows constructors to avoid calling `init`, which can
  // be expensive and cause undesirable side effects.
  var subclassing = false;

  /**
   Define a new class with the properties and methods of one or more other classes.

   The new class can be based on a `SuperClass`, which will be inserted into its
   prototype chain.

   Furthermore, one or more mixins (object that contain properties and/or methods)
   may be specified, which will be applied in order. When a method is replaced
   with another method, it will be wrapped in a function that makes the previous
   method accessible via `this._super`.

   @method defineClass
   @param {Object} SuperClass A base class to extend. If `mixins` are to be included
   without a `SuperClass`, pass `null` for SuperClass.
   @param {Object} mixins One or more objects that contain properties and methods
   to apply to the new class.
   */
  var defineClass = function(SuperClass) {
    var Klass = function() {
      if (!subclassing && this.init) {
        this.init.apply(this, arguments);
      }
    };

    if (SuperClass) {
      subclassing = true;
      Klass.prototype = new SuperClass();
      subclassing = false;
    }

    if (arguments.length > 1) {
      var extendArgs = Array.prototype.slice.call(arguments, 1);
      extendArgs.unshift(Klass.prototype);
      extendClass.apply(Klass.prototype, extendArgs);
    }

    Klass.constructor = Klass;

    Klass.extend = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift(Klass);
      return defineClass.apply(Klass, args);
    };

    return Klass;
  };

  /**
   A base class that can be extended.

   @example

   ```javascript
   var CelestialObject = Klass.extend({
     init: function(name) {
       this._super();
       this.name = name;
       this.isCelestialObject = true;
     },
     greeting: function() {
       return 'Hello from ' + this.name;
     }
   });

   var Planet = CelestialObject.extend({
     init: function(name) {
       this._super.apply(this, arguments);
       this.isPlanet = true;
     },
     greeting: function() {
       return this._super() + '!';
     },
   });

   var earth = new Planet('Earth');

   console.log(earth instanceof Klass);           // true
   console.log(earth instanceof CelestialObject); // true
   console.log(earth instanceof Planet);          // true

   console.log(earth.isCelestialObject);          // true
   console.log(earth.isPlanet);                   // true

   console.log(earth.greeting());                 // 'Hello from Earth!'
   ```

   @class Klass
   */
  var Klass = defineClass(null, {
    init: function() {}
  });

  exports.Klass = Klass;
  exports.defineClass = defineClass;
  exports.extendClass = extendClass;

});
define('qunit', ['exports'], function (exports) {

	'use strict';

	/* globals test:true */

	var module = QUnit.module;
	var test = QUnit.test;
	var skip = QUnit.skip;
	var only = QUnit.only;

	exports['default'] = QUnit;

	exports.module = module;
	exports.test = test;
	exports.skip = skip;
	exports.only = only;

});//# sourceMappingURL=ember-qunit.amd.map
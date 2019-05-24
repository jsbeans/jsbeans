/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'Unimap.Repository',
	$singleton: true,
	$sync: {
		updateCheckInterval: 0
	},

	_rendersMap: {},
	_selectorsMap: {},

	createAllSelectors: function(opts){
        if(JSB.isClient() && !this.matchTrigger('_initialized')){
            throw new Error('Unimap repository has not been initialized yet');
        }

	    var selectors = {};

	    for(var i in this._selectorsMap){
	        var jsbClass = JSB.get(this._selectorsMap[i]).getClass();

	        selectors[i] = new jsbClass(opts);
	    }

	    return selectors;
	},

	createSelector: function(opts){
	    return this._create('selector', opts);
	},

	_create: function(type, opts){
        if(JSB.isClient() && !this.matchTrigger('_initialized')){
            throw new Error('Unimap repository has not been initialized yet');
        }

        var className;

        if(type === 'selector'){
            className = this._selectorsMap[opts.scheme.render];
        } else {
            className = this._rendersMap[opts.scheme.render];
        }

        if(!className || !JSB.get(className)){
            throw new Error('Unimap repository not contains render with name "' + rName + '"');
        }

        var jsbClass = JSB.get(className).getClass();
        return new jsbClass(opts);
	},

	$client: {
		$constructor: function(){
		    $base();
			this.doSync();

			this.ensureSynchronized(function(){
				var jsbArr = [];

				for(var i in $this._rendersMap){
					jsbArr.push($this._rendersMap[i]);
				}

				for(var i in $this._selectorsMap){
					jsbArr.push($this._selectorsMap[i]);
				}

				JSB.chain(jsbArr, function(jsbName, c){
					JSB.lookup(jsbName, function(){
						c.call($this);
					});
				}, function(){
					$this.setTrigger('_initialized');
				});
			});
		},

		ensureInitialized: function(callback){
			this.ensureTrigger('_initialized', callback);
		},

		createRender: function(opts){
		    return this._create('render', opts);
		}
	},

	$server: {
	    $constructor: function(opts){
	        $base();

			JSB.onLoad(function(){
			    var desc = this.getDescriptor();

				if(this.isSubclassOf('Unimap.Render.Basic') && JSB.isDefined(desc.$alias)){
					$this.register('render', desc.$name, desc.$alias);

					if(this.$selector){
					    $this.register('selector', desc.$selector, desc.$alias);
					}
				}

				if(this.isSubclassOf('Unimap.Selectors.Basic') && JSB.isDefined(desc.$alias)){
					$this.register('selector', desc.$name, desc.$alias);
				}
			});
	    },

		register: function(type, name, alias){
		    if(type === 'selector'){
		        this._selectorsMap[alias] = name;
		    } else {
		        this._rendersMap[alias] = name;
		    }
		}
	}
}
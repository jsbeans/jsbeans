{
	$name: 'DataCube.Api.WidgetController',
	$http: true,
	$singleton: true,
	
	$client: {
		filterManager: null,
		widgets: {},
		wrappers: {},
		
		widgetCallbacks: {},
		wrapperCallbacks: {},
		
		$constructor: function(){
			$base();
			JSB.lookup('DataCube.Widgets.FilterManager', function(FilterManager){
				$this.filterManager = new FilterManager($this);
			});
			this.subscribe('DataCube.Api.Widget.widgetCreated', function(wrapper, msg, params){
				var wid = params.wid;
				$this.widgets[wid] = wrapper.getWidget();
				$this.wrappers[wid] = wrapper;
				
				if($this.wrapperCallbacks[wid] && $this.wrapperCallbacks[wid].length > 0){
					for(var i = 0; i < $this.wrapperCallbacks[wid].length; i++){
						$this.wrapperCallbacks[wid][i].call($this, $this.wrappers[wid]);
					}
					$this.wrapperCallbacks[wid] = [];
				}

				if($this.widgetCallbacks[wid] && $this.widgetCallbacks[wid].length > 0){
					for(var i = 0; i < $this.widgetCallbacks[wid].length; i++){
						$this.widgetCallbacks[wid][i].call($this, $this.widgets[wid]);
					}
					$this.widgetCallbacks[wid] = [];
				}
			});
		},
		
		lookupWidget: function(wid, callback){
			if(this.widgets[wid]){
				callback.call(this, this.widgets[wid]);
				return;
			}
			if(!this.widgetCallbacks[wid]){
				this.widgetCallbacks[wid] = [];
			}
			this.widgetCallbacks[wid].push(callback);
		},
		
		lookupWrapper: function(wid, callback){
			if(this.wrappers[wid]){
				callback.call(this, this.wrappers[wid]);
				return;
			}
			if(!this.wrapperCallbacks[wid]){
				this.wrapperCallbacks[wid] = [];
			}
			this.wrapperCallbacks[wid].push(callback);
			
		},
		
		getFilterManager: function(){
			return $this.filterManager;
		}
	},
	
	$server: {
		$require: ['JSB.Web'],
		
		code: null,
		
		get: function() {
			if(!this.code){
				function setupServerPath(){
					var arrScripts = document.getElementsByTagName('script');
					for(var i in arrScripts){
						var curSrc = arrScripts[i].src;
						var match = /(.*?)\/datacube\/api\/WidgetController\.jsb/gi.exec(curSrc);
						if(!JSB().isNull(match)){
							JSB().getProvider().setServerBase(match[1]);
							break;
						}
					}
				}
				
				var code = '';
				
				// insert engine
				code += Web.getJsbCode();
				
				// insert server version to avoid browser cache
				code += 'JSB().setServerVersion("' + Config.get('build.version') + '");';
				
				// insert setup server code
				code += '(' + setupServerPath.toString() + ')();';
				
				// insert dom controller
				code += Web.getJsbCode('JSB.Crypt.MD5') + ';';
				code += Web.getJsbCode('DataCube.Widgets.FilterManager') + ';';
				code += Web.getJsbCode('DataCube.Api.WidgetController') + ';';
				code += Web.getJsbCode('DataCube.Api.Widget') + ';';
/*				
				code += Web.getJsbCode('JQuery') + ';';
				code += Web.getJsbCode('JQuery.UI.Core') + ';';
				code += Web.getJsbCode('JQuery.UI.Loader') + ';';
				code += Web.getJsbCode('JSB.Widgets.DomController') + ';';
				
				// pack required beans
				code += Web.getJsbCode('JSB.Controls.Control') + ';';
				code += Web.getJsbCode('JSB.Controls.Navigator') + ';';
				
				code += Web.getJsbCode('JSB.Widgets.Control') + ';';
				code += Web.getJsbCode('JSB.Widgets.TabView') + ';';
				code += Web.getJsbCode('JSB.Widgets.WidgetContainer') + ';';
				code += Web.getJsbCode('JSB.Widgets.Widget') + ';';
				
				code += Web.getJsbCode('JSB.Workspace.Entry') + ';';
				code += Web.getJsbCode('JSB.Workspace.Workspace') + ';';
				
				code += Web.getJsbCode('DataCube.Model.Dashboard') + ';';
				code += Web.getJsbCode('DataCube.Model.Widget') + ';';
				code += Web.getJsbCode('DataCube.Model.Slice') + ';';
				code += Web.getJsbCode('DataCube.Model.Cube') + ';';
				code += Web.getJsbCode('DataCube.Api.Widget') + ';';
				code += Web.getJsbCode('DataCube.Widgets.Widget') + ';';
*/				
				this.code = code;
			}
			return this.code;
		}
	}
}
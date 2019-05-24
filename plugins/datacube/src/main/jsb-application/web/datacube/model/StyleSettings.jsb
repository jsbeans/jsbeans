/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Model.StyleSettings',
	$parent: 'JSB.Workspace.Entry',
	
	$expose: {
		priority:0.5, 
		nodeType:'DataCube.StyleSettingsNode',
		create: true,
		move: true,
		remove: true,
		title: 'Стиль',
		description: 'Создает таблицу стилей для оформления виджетов и визуализаций',
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDMwMCAzMDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMwMCAzMDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJYTUxJRF85MDVfIj4NCgk8ZyBpZD0iWE1MSURfOTA4XyI+DQoJCTxnIGlkPSJYTUxJRF85MDlfIj4NCgkJCTxwYXRoIGlkPSJYTUxJRF85MTBfIiBzdHlsZT0iZmlsbDojNDVCN0VGOyIgZD0iTTIxNi45MjQsOTAuNjUzaC0xMi4zNjFjLTMuMzE4LTkuNzM3LTguNjQ0LTIwLjE3Mi0xNS45NzMtMzEuMzA0DQoJCQkJYy03LjMzMy0xMS4xMy0xNC4xMDItMTcuMTIyLTIwLjMwOC0xNy45OGMtMy40MjYtMC40MjYtMzEuMzI1LTEuNjA1LTMxLjMyNS0xLjYwNXYyMDIuNDg1YzAsMy44NTMsMC42OTUsNy4yNTIsMi4wODcsMTAuMTk0DQoJCQkJYzEuMzksMi45NDUsNC4xMTgsNS4yNzMsOC4xODgsNi45ODNjMi40NjEsMC45NjMsNi4yODUsMS45NTQsMTEuNDc3LDIuOTdjNS4xOSwxLjAxOCw5LjYwNSwxLjc0MSwxMy4yNDQsMi4xNjd2MjAuODA3SDQ0Ljk3DQoJCQkJdi0yMC44MDdjMy4xMDMtMC4zMjEsNy40NjUtMC43NzUsMTMuMDg0LTEuMzY0YzUuNjE4LTAuNTg3LDkuNDQ0LTEuMzEsMTEuNDc3LTIuMTY3YzQuMTc0LTEuNzExLDYuOTU2LTQuMDE0LDguMzQ5LTYuOTAzDQoJCQkJYzEuMzktMi44ODksMi4wODctNi4zMTMsMi4wODctMTAuMjc0VjM5Ljc2M2MwLDAtMjcuOTAxLDEuMTc5LTMxLjMyNSwxLjYwNWMtNi4yMDksMC44NTgtMTIuOTc4LDYuODUtMjAuMzA4LDE3Ljk4DQoJCQkJQzIxLjAwMiw3MC40OCwxNS42NzcsODAuOTE1LDEyLjM2MSw5MC42NTJIMFYxNC42M2gyMTYuOTI0VjkwLjY1M3oiLz4NCgkJPC9nPg0KCQk8cGF0aCBpZD0iWE1MSURfOTEyXyIgc3R5bGU9ImZpbGw6IzJGQTFEQjsiIGQ9Ik0xMDguNDYyLDE0LjYzdjI3MC43NGg2My40OTF2LTIwLjgwN2MtMy42MzktMC40MjctOC4wNTQtMS4xNDktMTMuMjQ0LTIuMTY3DQoJCQljLTUuMTkyLTEuMDE2LTkuMDE3LTIuMDA3LTExLjQ3OC0yLjk3Yy00LjA2OS0xLjcxMS02Ljc5OC00LjAzOC04LjE4OC02Ljk4M2MtMS4zOTItMi45NDItMi4wODctNi4zNDEtMi4wODctMTAuMTk0VjM5Ljc2Mw0KCQkJYzAsMCwyNy44OTgsMS4xNzksMzEuMzI1LDEuNjA1YzYuMjA2LDAuODU4LDEyLjk3NSw2Ljg1LDIwLjMwOCwxNy45OGM3LjMyOSwxMS4xMzIsMTIuNjU0LDIxLjU2NywxNS45NzMsMzEuMzA0aDEyLjM2MVYxNC42Mw0KCQkJSDEwOC40NjJ6Ii8+DQoJPC9nPg0KCTxnIGlkPSJYTUxJRF85MTNfIj4NCgkJPHBvbHlnb24gaWQ9IlhNTElEXzkxNF8iIHN0eWxlPSJmaWxsOiNGQ0U5OEU7IiBwb2ludHM9IjI4Mi44LDIzOC42MjQgMjgyLjgsNjEuMzc2IDMwMCw2MS4zNzYgMjY3LjMwNiw2LjM5MSAyMzQuNjEyLDYxLjM3NiANCgkJCTI1MS44MTEsNjEuMzc2IDI1MS44MTEsMjM4LjYyNCAyMzQuNjEyLDIzOC42MjQgMjUxLjgxMSwyNjcuNTUgMjUxLjgxMSwyNjcuOTcgMjUyLjA2MSwyNjcuOTcgMjY3LjMwNiwyOTMuNjA5IDI4Mi41NTEsMjY3Ljk3IA0KCQkJMjgyLjgsMjY3Ljk3IDI4Mi44LDI2Ny41NSAzMDAsMjM4LjYyNCAJCSIvPg0KCQk8cG9seWdvbiBpZD0iWE1MSURfOTE1XyIgc3R5bGU9ImZpbGw6I0ZBRTE2RTsiIHBvaW50cz0iMjgyLjgsNjEuMzc2IDMwMCw2MS4zNzYgMjY3LjMwNiw2LjM5MSAyNjcuMzA2LDI5My42MDkgMjgyLjU1MSwyNjcuOTcgDQoJCQkyODIuOCwyNjcuOTcgMjgyLjgsMjY3LjU1IDMwMCwyMzguNjI0IDI4Mi44LDIzOC42MjQgCQkiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==',
		order: 40
	},

	stylesVersion: 0,

	scheme: {
	    // todo: dashboard style settings
	    widgetSettings: {
	        render: 'group',
	        name: 'Параметры виджета',
	        collapsible: true,
	        items: {
	            colorScheme: {
	                render: 'item',
	                name: 'Цветовая схема',
	                multiple: true,
	                editor: 'JSB.Widgets.ColorEditor'
	            }
	        }
	    }
	},

	$client: {
	    _styles: null,
	    _clientStylesVersion: -1,

	    getStyles: function(callback){
	        if(this._clientStylesVersion !== this.stylesVersion){
	            this.server().getStyles(function(result, fail){
	                if(fail){ return; }

	                $this._styles = result;
	                $this._clientStylesVersion = $this.stylesVersion;

	                callback(result);
	            });
	        } else {
	            callback(this._styles);
	        }
	    }
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'Unimap.Selector'],

        $constructor: function(id, workspace, opts){
            $base(id, workspace);

            this._styles = this.property('styles');

            if(!this._styles){
                var valueSelector = new Selector();

                this._styles = valueSelector.createDefaultValues(this.scheme);

                valueSelector.destroy();
            }
        },

        _styles: null,

        getStyles: function(){
            return this._styles;
        },

        setStyles: function(styles){
            this._styles = styles;
            this.property('styles', styles);

            this.stylesVersion++;

            this._workspace.store();
        }
    }
}
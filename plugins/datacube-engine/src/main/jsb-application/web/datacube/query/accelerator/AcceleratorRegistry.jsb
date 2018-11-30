{
	$name: 'DataCube.Query.Accelerator.AcceleratorRegistry',
	$singleton: true,

	$server: {
		$require: [
		    'JSB.System.Config',
		    'DataCube.Query.QueryUtils'
        ],

        acceleratorsCfg: null,
        accelerators: {},

        $constructor: function(){
        	$base();
        	$this.acceleratorsCfg = Config.get('datacube.query.accelerators');
        },

		register: function(jsb){
            if(jsb instanceof JSB){
				jsb = jsb.$name;
			}

			if ($this.acceleratorsCfg.indexOf(jsb) == -1) {
			    QueryUtils.logDebug('Register disabled accelerator ' + jsb);
			} else {
			    QueryUtils.logDebug('Register enabled accelerator ' + jsb);
			    var bean = JSB.get(jsb);
			    var Accelerator = bean.getClass();
			    $this.accelerators[jsb] = new Accelerator();
			}
		},

		lookupAccelerator: function(name){
            return $this.accelerators[name];
		},
	}
}
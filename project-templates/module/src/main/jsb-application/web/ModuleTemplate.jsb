{
	$name: 'org.jsbeans.modules.module-template.ModuleTemplate',
	$singleton: true,

	$html: {
		title: 'ModuleTemplate',
	},

    $client: {
	    $require: [
        ],

		$constructor: function(opts){
			$base(opts);
			this.addClass('dataMonitor');
			$this.server().getVersion(function(v){
				$this.dcVersion = v;
				$this.init();
			});
		},


		init: function(){
			this.append(`#dot
				<div class="dcHeader">
					<div class="dcLogo"></div>
					<div class="dcTitle">
						<div class="caption">{{=$this.getJsb().$html.title}}</div>
						<div class="version">{{=$this.dcVersion}}</div>
					</div>

				</div>
			`);
        }
    },

	$server: {
	    $require: [
        ],

		getVersion: function(){
			return Config.get('build.version');
		},
    },
}
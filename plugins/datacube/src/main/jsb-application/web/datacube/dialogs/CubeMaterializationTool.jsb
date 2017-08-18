{
	$name: 'DataCube.Dialogs.CubeMaterializationTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager', 
	           'JSB.Widgets.PrimitiveEditor',
	           'JSB.Widgets.ScrollBox'],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'cubeMaterializationTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: true,
					hideByOuterClick: false,
					hideInterval: 0,
					cssClass: 'datacubeToolWrapper'
				}
			});
		},
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('CubeMaterializationTool.css');
			this.addClass('cubeMaterializationTool');
			
			this.append(`#dot
				<div class="header">
					<div class="icon"></div>
					<div class="title">Материализация куба</div>
					<p class="info">Материализация позволяет сформировать проиндексированный слепок данных, в соответствии со структурой куба, и сохранить его в локальную базу. После материализации все обращенные к кубу запросы будут выполняться над слепком.</p>
				</div>

				<div class="group materialized"></div>
				
				<div class="group unmaterialized">
					<div class="status">Выберите базу для сохранения</div>
					<div jsb="DataCube.Controls.DatabaseSelector"
						onchange="{{=this.callbackAttr(function(){ $this.updatePanes(); })}}"></div>
					<p class="warning"><strong>Внимание!</strong> Процедура материализации может занять длительное время</p>

				</div>
				
				<div class="group materializing">
					<div class="status">Выполняется материализация...</div>
					<div class="message"></div>
				</div>

				<div class="buttons">
					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnStart btn16" 
						caption="Материализовать куб"
						onclick="{{=this.callbackAttr(function(evt){ $this.startMaterialization(); })}}" >
					</div>
					
					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnStop btn16" 
						caption="Остановить материализацию"
						onclick="{{=this.callbackAttr(function(evt){ $this.stopMaterialization(); })}}" >
					</div>

					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnCancel btn16" 
						caption="Закрыть"
						onclick="{{=this.callbackAttr(function(evt){ $this.close(); })}}" >
					</div>
				</div>
			`);
			
			this.subscribe('DataCube.Model.Cube.status', {session: true}, function(sender, msg, params){
				var cube = $this.data.data.cube;
				if(sender != cube){
					return;
				}
				$this.updatePanes(params.status);
			});
		},
		
		
		update: function(){
			$jsb.deferUntil(function(){
				$this.updatePanes();
			}, function(){
				return $this.isContentReady();
			});
		},
		
		updatePanes: function(msg){
			var cube = this.data.data.cube;
			cube.server().getMaterializationInfo(function(mInfo){
				if(mInfo && Object.keys(mInfo.materialization).length > 0){
					$this.find('.unmaterialized').addClass('hidden');
					$this.find('.materialized').removeClass('hidden');
					
					$this.find('.btnStart').addClass('hidden');
				} else {
					$this.find('.materialized').addClass('hidden');
					$this.find('.unmaterialized').removeClass('hidden');
					$this.find('div[jsb="DataCube.Controls.DatabaseSelector"]').jsb().setWorkspace(cube.getWorkspace());
					
					var dbSelector = $this.find('div[jsb="DataCube.Controls.DatabaseSelector"]').jsb();
					$this.find('.btnStart').jsb().enable(dbSelector.getSource());
					
					$this.find('.btnStart').removeClass('hidden');
				}
				
				if(mInfo && mInfo.materializing){
					$this.find('.materializing').removeClass('hidden');
					$this.find('.unmaterialized').addClass('hidden');
					
					$this.find('.btnStart').addClass('hidden');
					$this.find('.btnStop').removeClass('hidden');
					
					if(msg){
						$this.find('.materializing > .message').text(msg);
					}
				} else {
					$this.find('.materializing').addClass('hidden');
					
					$this.find('.btnStop').addClass('hidden');
				}

			});
			
		},
		
		startMaterialization: function(){
			var cube = this.data.data.cube;
			var dbSelector = $this.find('div[jsb="DataCube.Controls.DatabaseSelector"]').jsb();
			cube.server().startMaterialization(dbSelector.getSource(), function(){
				$this.updatePanes();
			});
		},
		
		stopMaterialization: function(){
			var cube = this.data.data.cube;
			cube.server().stopMaterialization(function(){
				$this.updatePanes();
			});
		}
		
	},
	
	$server: {	}
}
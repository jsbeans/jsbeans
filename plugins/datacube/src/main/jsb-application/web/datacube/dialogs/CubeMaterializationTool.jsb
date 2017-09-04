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
					<p class="info">Материализация позволяет сформировать проиндексированный слепок данных, в соответствии со структурой куба, и сохранить его в локальную базу. После материализации все запросы, обращенные к кубу и его срезам, будут выполняться над слепком.</p>
				</div>

				<div class="group materialized">
					<div class="status">Материализация выполнена <span class="date"></span></div>
					<div class="message"></div>
				</div>
				
				<div class="group unmaterialized">
					<div class="status">Выберите базу для сохранения</div>
					<div jsb="DataCube.Controls.DatabaseSelector"
						onchange="{{=this.callbackAttr(function(){ $this.updatePanes(); })}}"></div>
					<div class="message"></div>
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
						class="roundButton btnRefresh btn16" 
						caption="Обновить материализацию"
						enabled="false"
						onclick="{{=this.callbackAttr(function(evt){ $this.updateMaterialization(); })}}" >
					</div>

					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnIndex btn16" 
						caption="Обновить индексы"
						onclick="{{=this.callbackAttr(function(evt){ $this.updateIndexes(); })}}" >
					</div>

					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnDelete btn16" 
						caption="Удалить материализацию"
						onclick="{{=this.callbackAttr(function(evt){ $this.removeMaterialization(evt); })}}" >
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
				$this.updatePanes(params.status, params.success != true);
			});
		},
		
		
		update: function(){
			$jsb.deferUntil(function(){
				$this.updatePanes();
			}, function(){
				return $this.isContentReady();
			});
		},
		
		updatePanes: function(msg, bFail){
			var cube = this.data.data.cube;
			cube.server().getMaterializationInfo(function(mInfo){
				if(mInfo && Object.keys(mInfo.materialization).length > 0){
					$this.find('.unmaterialized').addClass('hidden');
					$this.find('.materialized')
						.removeClass('hidden')
						.find('.date').text(new Date(mInfo.materialization.lastUpdate).toLocaleString());
					
					$this.find('.btnStart').addClass('hidden');
					$this.find('.btnRefresh').removeClass('hidden');
					$this.find('.btnIndex').removeClass('hidden');
					$this.find('.btnDelete').removeClass('hidden');
				} else {
					$this.find('.materialized').addClass('hidden');
					$this.find('.unmaterialized').removeClass('hidden');
					$this.find('div[jsb="DataCube.Controls.DatabaseSelector"]').jsb().setWorkspace(cube.getWorkspace());
					
					var dbSelector = $this.find('div[jsb="DataCube.Controls.DatabaseSelector"]').jsb();
					$this.find('.btnStart').jsb().enable(dbSelector.getSource());
					
					$this.find('.btnStart').removeClass('hidden');
					
					$this.find('.btnRefresh').addClass('hidden');
					$this.find('.btnIndex').addClass('hidden');
					$this.find('.btnDelete').addClass('hidden');

				}
				
				if(mInfo && mInfo.materializing){
					$this.find('.materializing').removeClass('hidden');
					$this.find('.unmaterialized').addClass('hidden');
					$this.find('.materialized').addClass('hidden');
					
					$this.find('.btnStart').addClass('hidden');
					$this.find('.btnRefresh').addClass('hidden');
					$this.find('.btnIndex').addClass('hidden');
					$this.find('.btnDelete').addClass('hidden');
					
					$this.find('.btnStop').removeClass('hidden');
					
				} else {
					$this.find('.materializing').addClass('hidden');
					
					$this.find('.btnStop').addClass('hidden');
				}
				
				var msgElt = $this.find('.group > .message');
				if(msg){
					msgElt.text(msg);
					if(bFail){
						msgElt.addClass('error');
					} else {
						msgElt.removeClass('error');
					}
				} else {
					msgElt.empty();
				}


			});
			
		},
		
		updateMaterialization: function(){
			var cube = this.data.data.cube;
			cube.server().startMaterialization(function(){
				$this.updatePanes();
			});
		},
		
		startMaterialization: function(){
			var cube = this.data.data.cube;
			var dbSelector = $this.find('div[jsb="DataCube.Controls.DatabaseSelector"]').jsb();
			cube.server().startMaterialization(dbSelector && dbSelector.getSource(), function(){
				$this.updatePanes();
			});
		},
		
		stopMaterialization: function(){
			var cube = this.data.data.cube;
			cube.server().stopMaterialization(function(){
				$this.updatePanes();
			});
		},
		
		updateIndexes: function(){
			var cube = this.data.data.cube;
			cube.server().updateIndexes(function(){
				$this.updatePanes();
			});
		},
		
		removeMaterialization: function(evt){
			var cube = this.data.data.cube;
			var elt = $this.$(evt.currentTarget);
			ToolManager.showMessage({
				icon: 'removeDialogIcon',
				text: 'Вы уверены что хотите удалить материализацию куба "'+cube.getName()+'" ?',
				buttons: [{text: 'Удалить', value: true},
				          {text: 'Нет', value: false}],
				target: {
					selector: elt
				},
				constraints: [{
					weight: 10.0,
					selector: elt
				}],
				callback: function(bDel){
					if(bDel){
						cube.server().removeMaterialization(function(){
							$this.updatePanes();
						});
					}
				}
			});
		}
		
	},
	
	$server: {	}
}
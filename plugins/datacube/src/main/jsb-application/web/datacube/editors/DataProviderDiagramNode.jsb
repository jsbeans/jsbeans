{
	$name: 'JSB.DataCube.DataProviderDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	
	$client: {
		ready: false,
		provider: null,
		fields: null,
		leftFieldConnectors: {},
		rightFieldConnectors: {},
		
		options: {
			onHighlight: function(bEnable){
				this.highlightNode(bEnable);
			},
			onSelect: function(bEnable){
				this.selectNode(bEnable);
			},
			onRemove: function(){},
			onSaveNode: function(){}
		},
		
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);
			this.provider = opts.provider;
			this.loadCss('DataProviderDiagramNode.css');
			this.addClass('dataProviderDiagramNode');
			this.attr('provider', this.provider.getJsb().$name);
			
			this.caption = this.$(`#dot
				<div class="caption">
					<div class="icon"></div>
					<div class="name">{{=this.provider.getName()}}</div>
				</div>
			`);
			this.body = this.$(`
				<div class="body">
					<div class="loading">
						<div class="icon"></div>
						<div class="text">Загрузка схемы данных...</div>
					</div>
				</div>
			`);
			this.status = this.$('<div class="status"></div>');
			this.append(this.caption);
			this.append(this.body);
			this.append(this.status);
			this.fieldList = this.$('<ul class="fields"></ul>');
			this.body.append(this.fieldList);

			// install drag-move selector
			this.installDragHandle('drag', {
				selector: this.caption
			});
			
			// install resize hande
			var rightBottomGripper = this.$('<div class="gripper cornerGripper rightBottomGripper"></div>');
			this.append(rightBottomGripper);
			
			this.installResizeHandle('rightBottomGripper',{
				selector: rightBottomGripper,
				resize: {right: true}
			});
			
			if($this.fields){
				$this.refresh();
				$this.ready = true;
			} else {
				$this.loadScheme(function(){
					$this.refresh();
					$this.ready = true;
				});
			}
			
		},
		
		loadScheme: function(callback){
			this.provider.server().extractFields(function(fields){
				$this.find('.body > .loading').addClass('hidden');
				$this.fields = fields;
				callback.call($this);
			});
		},
		
		refresh: function(){
			this.fieldList.empty();
			
			debugger;
		},
		
		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		},

		selectNode: function(bEnable){
			if(bEnable){
				this.addClass('selected');
			} else {
				this.removeClass('selected');
			}
		},
	}
}
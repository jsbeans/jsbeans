{
	$name: 'DataCube.Dialogs.SliceOptionsTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager', 
	           'JSB.Widgets.PrimitiveEditor',
	           'JSB.Widgets.ScrollBox',
	           'JQuery.UI.Resizable'],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'sliceOptionsTool',
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
			this.loadCss('SliceOptionsTool.css');
			this.addClass('sliceOptionsTool');
			
			this.append(`#dot
				<div class="header">
					<div class="icon"></div>
					<div class="name" 
						jsb="JSB.Widgets.PrimitiveEditor"
						onchange="{{=this.callbackAttr(function(evt){ $this.updateButtons(); })}}">
					</div>
				</div>
				
				<div jsb="JSB.Widgets.GroupBox" caption="Текст запроса">
					<div jsb="JSB.Widgets.MultiEditor" class="queryEditor" valuetype="org.jsbeans.types.JsonObject" showhints="false"></div>
				</div>

				<span class="error json1 hidden">Некорректный JSON текста запроса!</span>

				<div jsb="JSB.Widgets.GroupBox" caption="Параметры запроса">
                    <div jsb="JSB.Widgets.MultiEditor" class="queryParameters" valuetype="org.jsbeans.types.JsonObject" showhints="false"></div>
                </div>

                <span class="error json2 hidden">Некорректный JSON параметров запроса!</span>
				
				<div class="buttons">
					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnOk btn16" 
						caption="Применить"
						onclick="{{=this.callbackAttr(function(evt){ $this.apply(evt); })}}" >
					</div>
					
					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnCancel btn16" 
						caption="Отмена"
						onclick="{{=this.callbackAttr(function(evt){ $this.close(); })}}" >
					</div>
				</div>
			`);

            this.find('div.queryEditor').resizable({
                handles: "n, s",
                // containment: this.getElement(),
                minHeight: 20,
                minWidth: 320
            });

            this.find('div.queryParameters').resizable({
                handles: "n, s",
                // containment: this.getElement(),
                minHeight: 20,
                minWidth: 320
            });
		},
		
		
		update: function(){
			$jsb.deferUntil(function(){
				$this.construct();
				$this.updateButtons();
			}, function(){
				return $this.isContentReady();
			});
		},
		
		construct: function(){
			var slice = this.data.data.slice;

			this.find('.name._dwp_primitiveEditor').jsb().setData(slice.getName());
			this.find('.queryParameters').jsb().setData(JSON.stringify(slice.getQueryParams(), null, 4));

			var query = slice.getQuery();

            if(!query || Object.keys(query).length == 0){
                query = {
                    $select: {}
                }

                slice.cube.server().load(true, function(desc){
                    if(!desc) return;

                    for(var i in desc.fields){
                        query.$select[i] = i;
                    }

                    $this.find('.queryEditor').jsb().setData(JSON.stringify(query, null, 4));
                });
            } else {
                this.find('.queryEditor').jsb().setData(JSON.stringify(query, null, 4));
            }
			
/*			
			var node = this.data.data.node;
			var entity = this.data.data.entity;
			var view = D2rqScheme.getView(entity);
			var scroll = this.find('div[jsb="JSB.Widgets.ScrollBox"]').jsb();
			scroll.clear();
			if(this.renderer){
				this.renderer.destroy();
			}
			
			var d2rqObjectType = this.find('.d2rqObjectType');
			if($jsb.isInstanceOf(entity, 'Ontoed.Model.ClassMap')){
				d2rqObjectType.attr('type', 'classMap');
				d2rqObjectType.text('Отображение класса');
			} else if($jsb.isInstanceOf(entity, 'Ontoed.Model.PropertyBridge')){
				d2rqObjectType.attr('type', 'propertyBridge');
				d2rqObjectType.text('Отображение свойства');
			} else {
				throw 'Unknown d2rq object type';
			}
			
			var d2rqObjectName = this.find('.d2rqObjectName').jsb();
			d2rqObjectName.setData(entity.getLabel());
			
			$this.schemeWithData = $jsb.clone(view);

			function injectDataToEntry(entry, props){
				switch(entry.type){
				case 'item':
					if(props[entry.item]){
						entry.value = props[entry.item];
						entry.used = true;
						return true;
					}
					return false;
				case 'select':
					var found = false;
					for(var i = 0; i < entry.items.length; i++){
						if(injectDataToEntry(entry.items[i], props)){
							entry.chosenIdx = i;
							found = true;
						}
					}
					entry.used = found;
					return found;
				case 'group':
					var found = false;
					for(var i = 0; i < entry.items.length; i++){
						if(injectDataToEntry(entry.items[i], props)){
							found = true;
						}
					}
					entry.used = found;
					return found;
				}
			
			}
			
			// inject data
			injectDataToEntry($this.schemeWithData, entity.props);			
			
			this.renderer = new D2rqItemRenderer({
				data: $this.schemeWithData, 
				ontology: $this.data.data.ontology, 
				diagram: $this.data.data.diagram,
				node: node,
				entity: entity,
				tool: $this,
				onChange: function(){
					$this.updateButtons();
				}
			});
			scroll.append(this.renderer);
*/
		},
		
		isValid: function(){
			return true;
		},
		
		
		updateButtons: function(){
			this.find('.btnOk').jsb().enable(this.isValid());
		},
		
		apply: function(){
		    var flag1 = false,
		        flag2 = false;
		    try{
		        var json1 = this.find('.queryEditor').jsb().getData().getValue();
		        this.find('.error.json1').addClass('hidden');
		        flag1 = true;
		    } catch (ex){
		        this.find('.error.json1').removeClass('hidden');
		    }

		    try{
                var json2 = this.find('.queryParameters').jsb().getData().getValue();
                this.find('.error.json2').addClass('hidden');
                flag2 = true;
            } catch (ex){
                this.find('.error.json2').removeClass('hidden');
            }

            if(flag1 && flag2){
                // construct response
                this.data.callback.call(this, {
                    name: this.find('.name._dwp_primitiveEditor').jsb().getData().getValue(),
                    query: json1,
                    queryParams: json2
                });

                $this.close();
            }
		}
		
	},
	
	$server: {	}
}
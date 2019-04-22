{
	$name: 'DataCube.HttpServiceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$require: ['JSB.Widgets.Button',
		           'css:HttpServiceNode.css'],
		           
		$constructor: function(opts){
			$base(opts);
			this.addClass('httpServiceNode');
			
			this.append(`#dot
				<div class="status"></div>
			`);
			
			this.createMethodBtn = new Button({
				cssClass: 'roundButton btnCreate btn10',
				tooltip: 'Добавить метод',
				onClick: function(evt){
				    evt.stopPropagation();
					$this.createHttpMethod();
				}
			});
			$this.toolbox.append(this.createMethodBtn.getElement());
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
                $this.update();
			});
			
			this.subscribe('DataCube.HttpServiceNode.createHttpMethod', function(sender, msg, mtd){
                var node = $this.explorer.getEntryNode(mtd);

                if(!node){
                    node = $this.explorer.addTreeItem({
                        entry: mtd,
                        hasEntryChildren: 0,
                        name: mtd.getName()
                    }, $this.treeNode.key, false, {collapsed:true});
                }

                if(sender === $this){
                	$this.explorer.expandNode($this.treeNode.key, function(){
                		$this.explorer.publish('JSB.Workspace.nodeOpen', node);
                	});
                	
                }
            });
			
			$this.update();
		},
		
		createHttpMethod: function(){
			$this.explorer.expandNode($this.treeNode.key, function(){
				$this.getTargetEntry().server().createHttpMethod(function(mtd){
                    $this.publish('DataCube.HttpServiceNode.createHttpMethod', mtd);
				});
			});
		},
		
		update: function(status){
			if(status){
				this.find('.status').empty().text(status);
				return;
			}
			var addr = $this.getTargetEntry().getServiceAddress();
			if(addr && addr.trim().length > 0){
				this.find('.status').empty().append($this.$('<span class="addr"></span>').text(addr));
				this.createMethodBtn.enable(true);
			} else {
				this.find('.status').empty().append($this.$('<span class="empty">Адрес не задан</span>'));
				this.createMethodBtn.enable(false);
			}
		}
		
	}
	
}
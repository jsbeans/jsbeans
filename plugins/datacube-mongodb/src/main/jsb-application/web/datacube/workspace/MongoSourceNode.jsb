/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.MongoSourceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			$jsb.loadCss('MongoSourceNode.css');
			this.addClass('mongoSourceNode');
			
			this.append(`#dot
				<div class="status"></div>
			`);
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				$this.update();
			});
			
			this.subscribe('DataCube.Model.MongoSource.extractScheme', {session: true}, function(sender, msg, params){
				if(sender != $this.getTargetEntry()){
					return;
				}
                $this.update(params.status);
			});
			
			$this.update();
		},
		
		update: function(status){
			if(status){
				this.find('.status').empty().text(status);
				return;
			}
			var details = this.descriptor.entry.getDetails();
			if(!details || !details.updated){
				this.find('.status').empty().text('Схема не загружена');
			} else {
				this.find('.status').empty().append('Коллекций: <span class="count">' + details.collections + '</span>; индексов: <span class="count">' + details.indexes + '</span>; записей: <span class="count">' + details.items + '</span>');
			}
		}
		
	}
	
}
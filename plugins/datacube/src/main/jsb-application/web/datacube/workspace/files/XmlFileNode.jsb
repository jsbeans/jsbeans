/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.XmlFileNode',
	$parent: 'JSB.Workspace.FileNode',
	$client: {
		$require: ['css:XmlFileNode.css'],
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('xmlFileNode');
			
			this.append(`#dot
				<div class="status">
					Записей: <span class="count">{{=this.descriptor.entry.getRecordsCount()}}</span>
				</div>
			`);
			
		},
		
	}
	
}
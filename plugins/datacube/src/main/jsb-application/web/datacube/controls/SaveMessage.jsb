{
	$name: 'DataCube.SaveMessage',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $constructor: function(opts){
	        this.loadStyle('SaveMessage.css');
	        this.addClass('saveMessage hidden');

	        this.icon = this.$('<div class="icon"></div>');
	        this.append(this.icon);

	        this.caption = this.$('<span class="caption"></span>');
	        this.append(this.caption);

	        this.click(function(){
	            $this.addClass('hidden');
	        });
	    },

	    setStatus: function(status){
	        switch(status){
	            case 'saving':

	                break;
                case 'saved':

                    break;
                case 'error':

                    break;
	        }
	    }
	}
}
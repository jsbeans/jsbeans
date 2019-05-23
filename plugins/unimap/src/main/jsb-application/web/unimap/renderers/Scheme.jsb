/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'Unimap.Render.Scheme',
	$parent: 'Unimap.Render.Basic',
	$require: ['css:Scheme.css'],

	$alias: 'scheme',

	$client: {
		
		_innerController: null,

	    construct: function(){
	        this.addClass('schemeRender');
	        
	        if(this._scheme.name){
		        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
		        this.append(name);
	
		        this.createRequireDesc(name);
		        this.createDescription(name);
	        }

	        if(this._values.values.length == 0){
	        	this._values.values.push({value:{}});
	        }
	        this.addItem(this._values.values[0]);
	    },

	    addItem: function(values){
	    	if(values && values.value){
	    		$this.setValue(values.value);
	    	}
	    },
	    
	    setValue: function(val){
    		if(val){
    			$this._values.values[0].value = val;
    			$this.constructScheme();
    		}
	    },
	    
	    constructScheme: function(){
            if(this._innerController){
                this._innerController.destroy();
            }
            
            var scheme = this._scheme.scheme;
            
            if(scheme && Object.keys(scheme).length > 0){
	            $this._innerController = $this.createInnerScheme(scheme, $this._values.values[0].value, function(){
	                $this._values.values[0].linkedFields = $this._innerController.getLinkedFields();
	            });
	            $this.append($this._innerController);
            }
        }
	}
	
}

{
	$name: 'JSB.Widgets.MacKeys',
	$singleton: true,
	$client: {
		cmdKey: false,
		ctrlKey : false,
        shiftKey : false,
        altKey : false,
        
        reset: function(){
        	this.cmdKey = false;
            this.ctrlKey = false;
            this.shiftKey = false;
            this.altKey = false;
        },
        
		$constructor: function(){
			$base();
			
			(function(){
			    var saywho, isMac, webkit, mozilla, opera, kC;
			    isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
			    if (isMac) {
			        //browser detection, originates from: http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
			        saywho = (function(){
			            var ua = navigator.userAgent, tem,
			                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			            if (/trident/i.test(M[1])) {
			                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			                return { 'browser': 'IE', 'version': (tem[1] || '') };
			            }
			            if (M[1] === 'Chrome') {
			                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			                //if(tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
			                if (tem != null) return {'browser':tem.slice(1)[0].replace('OPR', 'Opera'), 'version': tem.slice(1)[1]}
			            }
			            M = M[2] ? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
			            if ((tem = ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
			            return { 'browser': M[0], 'version': M[1] };
			        })();
			        webkit = (saywho.browser === 'Chrome' || saywho.browser === 'Safari');
			        mozilla = saywho.browser === 'Firefox';
			        opera = saywho.browser === 'Opera';
			        window.onkeydown = function(e){
			            kC = e.keyCode;
			            if (((webkit || opera) && (kC === 91 || kC === 93)) || (mozilla && kC === 224)) {
			                $this.cmdKey = true;
			            } else if (kC === 16) {
			            	$this.shiftKey = true;
			            } else if (kC === 17) {
			            	$this.ctrlKey = true;
			            } else if (kC === 18) {
			            	$this.altKey = true;
			            }
			        };
			        window.onkeyup = function(e){
			            kC = e.keyCode;
			            if (((webkit || opera) && (kC === 91 || kC === 93)) || (mozilla && kC === 224)) {
			            	$this.cmdKey = false;
			            } else if (kC === 16) {
			            	$this.shiftKey = false;
			            } else if (kC === 17) {
			            	$this.ctrlKey = false;
			            } else if (kC === 18) {
			            	$this.altKey = false;
			            }
			        };
			        window.onblur = function(){
			        	$this.reset();
			        };
			    }
			})();
		}
	}
}
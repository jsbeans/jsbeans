{
	$name: 'jQuery.UI.Effects',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Effect',
                   'css:lib/styles/theme.css'
		           ],

		$bootstrap: function(){
			(function(jQuery){
				`#include 'lib/effects/effect-blind.js'`;
				`#include 'lib/effects/effect-bounce.js'`;
				`#include 'lib/effects/effect-clip.js'`;
				`#include 'lib/effects/effect-drop.js'`;
				`#include 'lib/effects/effect-explode.js'`;
				`#include 'lib/effects/effect-fade.js'`;
				`#include 'lib/effects/effect-fold.js'`;
				`#include 'lib/effects/effect-puff.js'`;
				`#include 'lib/effects/effect-pulsate.js'`;
				`#include 'lib/effects/effect-scale.js'`;
				`#include 'lib/effects/effect-shake.js'`;
				`#include 'lib/effects/effect-size.js'`;
				`#include 'lib/effects/effect-slide.js'`;
				`#include 'lib/effects/effect-transfer.js'`;
			}).call(null, JSB().$);
		}
	}
}
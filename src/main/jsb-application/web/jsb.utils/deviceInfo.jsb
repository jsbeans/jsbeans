/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Utils.DeviceInfo',

	$client: {
		$require: 'JQuery',
		$singleton: true,
		
		_layouts: {
			desktopHorz:{
				type: 'desktop',
				orientation: 'horizontal',
				width: 1280,
				height: 800,
				smWidth: 20,
				smHeight: 13
			},
			desktopVert:{
				type: 'desktop',
				orientation: 'horizontal',
				width: 800,
				height: 1280,
				smWidth: 13,
				smHeight: 20
			},
			tabletVert: {
				type: 'tablet',
				orientation: 'vertical',
				width: 800,
				height: 1280,
				smWidth: 9,
				smHeight: 16
			},
			tabletHorz: {
				type: 'tablet',
				orientation: 'horizontal',
				width: 1280,
				height: 800,
				smWidth: 16,
				smHeight: 9
			},
			mobileVert: {
				type: 'mobile',
				orientation: 'vertical',
				width: 390,
				height: 840,
				smWidth: 4,
				smHeight: 8
			},
			mobileHorz: {
				type: 'mobile',
				orientation: 'horizontal',
				width: 840,
				height: 390,
				smWidth: 8,
				smHeight: 4
			},
		},
		
		$constructor: function(opts){
			$base(opts);
			
			// append dummy DPI detector
			this.dpiElt = JSB.$('<div style="height: 1in; left: -100%; position: absolute; top: -100%; width: 1in; visibility:hidden; z-index:-1"></div>');
			JSB.$('body').append(this.dpiElt);
		},
		
		getDeviceTypeInfo: function(){
			let smPerInch = 2.541;
			var dpr = window.devicePixelRatio || 1;
			var dpi_x = this.dpiElt.get(0).offsetWidth * dpr;
			var dpi_y = this.dpiElt.get(0).offsetHeight * dpr;
			var smScreenWidth = Math.round(screen.width * smPerInch / dpi_x);
			var smScreenHeight = Math.round(screen.height * smPerInch / dpi_y);
			let sAspect = screen.width / screen.height;
			let bestId = null, bestW = 1;
			for(let lId in this._layouts){
				let lDesc = this._layouts[lId];
				var smLayoutWidth = lDesc.smWidth || Math.round(lDesc.width * smPerInch / dpi_x);
				var smLayoutHeight = lDesc.smHeight || Math.round(lDesc.height * smPerInch / dpi_y);
				
				let kw =  Math.abs(smLayoutWidth - smScreenWidth) / ((smLayoutWidth + smScreenWidth) / 2);
				let kh =  Math.abs(smLayoutHeight - smScreenHeight) / ((smLayoutHeight + smScreenHeight) / 2);
				
				let lAspect = lDesc.width / lDesc.height;
				let ka = Math.abs(sAspect - lAspect) / ((sAspect + lAspect) / 2);
				
				let lW = (kw + kh + ka) / 3;
				if(!bestId || lW < bestW){
					bestId = lId;
					bestW = lW;
				}
			}
			if(!bestId){
				bestId = Object.keys(this._layouts)[0];
			}
			
			let chosenProfile = this._layouts[bestId];
			return {
				type: chosenProfile.type,
				orientation: chosenProfile.orientation,
				smScreenWidth: smScreenWidth,
				smScreenHeight: smScreenHeight,
				screenWidth: screen.width,
				screenHeight: screen.height,
				dpiHorz: dpi_x,
				dpiVert: dpi_y,
				isDesktop: chosenProfile.type == 'desktop',
				isTablet: chosenProfile.type == 'tablet',
				isMobile: chosenProfile.type == 'mobile',
				isHorz: chosenProfile.orientation == 'horizontal',
				isVert: chosenProfile.orientation == 'vertical'
			};
		}
	}
}
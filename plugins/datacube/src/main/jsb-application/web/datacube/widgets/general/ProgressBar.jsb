{
	$name: 'JSB.DataCube.Widgets.ProgressBar',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'ProgressBar',
		description: '',
		category: 'Основные',
		thumb: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ
		bWFnZVJlYWR5ccllPAAAFENJREFUeNrsXAmcFOWV/391dPcww4AxCC6ILEoEBDxQopIE0CWKuJ7E
		JAooGjRurt34c/Pb7C+bTUz0ZzRqNKKJB1FgEcl6hCirBKPBGDxQo2hWYANyKGRGZYY5uruufe9V
		VXd1d/UlA45IY4/dXa++qu/9v3e/r4zxR43fDA99oQCl6I/H/9GfMq8epaGX5+1hGv45mFtP0exB
		Hu0ydLgHKg19FF3NP1g6jOe6UJoGTZWngX+/fKXg7vM0fL5G53sRGhnJqzxOJZpwUlVpNB6PGe1W
		pwn+VaOpNH9VI4/KXC1BPFY25DBKJuY4Drq7umCYZo6hlSaPyGr1Ikzj8ztpHJeACWncGsZxq4BR
		G00wt1poKkhiOR4V33etPCpz37aWk4LIzTDjOjs7kWpowJzLvoKr/u07MqVsNot0Ol3yzmQy8ubP
		3d3d/m/0FgDodc3112PmRbNhkDx20bjh73tDlVWiq4Vmr6pXehnFBMzMBgJixvnn49LL5+KQoUOx
		6L770NbWjjPPPgufmzIZju3k5I+lyLZsuZiZMEWslaaI8V345bzb8W5rK9LdXfjOv38XZ593Lubf
		dTeeXPE7AYwBj167XkbvDhgFKrmXgCEqeMJRx7TR52b+wbIsnHDSSfinb34do0aPwqqnVxEYC/Dy
		mjXo6OjAf/zwB7hg1szYyRQziqVpxplnYevmLdANAxNO+DQuvvRSHDfheLzy0ku47ZZbseb5F5FI
		Jj7SK7qHadq1AgVm2/j8tFMxZuxYbNy4CbffeiueWrmSJMCCrutyPMqQUD3FvViF8fU1Oo/BeWL5
		/2AegdDa0opjxo/HlFNOQTqT3g9G0dwKAEkmk7j5hhtx3TXXoiGVwpKHHsTN836Owz81QqQnHJRt
		AIPB3/mcODXCqoytFv9/9Jgjcfvdd2H+ogXIElDX/vBH+MVt89DU1FRww9XAqEZTbfI9RbOnAON3
		gcqKMnvQoEH44gVfxiWXzcXra9di9pcuwPDhwzFk6CEEji1upEa+oO99eSUXyWYtvEHnpWmshx77
		LQYMHIg7592BB5cuRcvf/ib2wzCMj7UBj6FpLwAkSsDqiQ3viCOOwJhxY7HyiRXCXIdjktCNLBdH
		BKsskUiIqpt2xhl4bvWfsOmvG5EiyWMgPmaMrpXGB4SONVvkAfPbK/DaFSzS/yw1qVQyCHoEB/+P
		KhcY+odTpkuAkK1po1iGpInjEYl2UYWJIQ0rVFOXe3LhkO/uxgRYqBhDKBUJ6DwFXRmBJnDgZDM9
		CryRbBCNsRuAtcvdOa6GEUO6MWRAmnR+KZf5PNfN0EAeXdArjbJCGk+cXqJxhQWv/rUJbbt0JI4a
		RDJo0hikI4PTvVxEX4qGYsnj4xkHakMbPMdFf+MgNGhNElD5mQw3iNTDdEecO+yGyNGYCjYsvGe/
		I2A09h+Ag4YfCVdsnSuhuOJwPGZyrJ59GpZ8f4GoGJp33lwDO5sucy+1ue0GE6QzGmZMasGMM1qI
		CaU5HDeraBIUcSfopvT4PI9HNA7TkFTA9N2Fy6/+FFa/2wTtS4fBPeaTULssQp+mY9JNGVp8YsEi
		RtsuvJQOtb0bie89D9fK4rDksTg0NQa2m/WlBb7q1CWUUjG3xFSOHCHZFMloc1rxdPtikYyBI47G
		9KtugNXtCqB6QoemxcUo5H1mHBlRNw3yGuMZme22seRfz0Tbji3QDPODS1l4VSFgjeAUMjqb1WTl
		pxLBAScm3icamyQryWBoAU1UkAgEdNOPWZq8qfl6xC2SNL5XBoPenkFfdOWvygiDeRU6tMoZDk1k
		wyhSsaFcuAIHD6rJFL3gfC8v0SQZVtoTCdETZqDGinN4dOuksn3AknJeSZKBASMnx7GyqBSD1mrr
		DHG1aNSujI5OUi9eJr8yMpYukpEwaa3ZeqyCYRoGI2EQC1j6Q4klvvPvkikiydDasqJ64GjxN2x7
		vmQwEAwag9iZj3tsz0La60SWLsCj6vTPgV1BMhgMuv+Ahj9b4eTomGNnkN71PpRuEEMzsdG7Q+qH
		F4FuJoneihUfOTdQeQL6bhp5Meqep5qbG200NjgRlJUYQZ4i2w4vNh3t0/BRrYiGz3yXTJRFQCq2
		H4YWaJZSGxSmouWoihwkUBQDSdKU1BtIaMyC873YTGp+QakC98SXnIzbJd/NRArJvv2r5VQKEoLV
		aLrebyGJswvo6/QmfaPODN/ZYeA9/6tPoCJurVdpEK+sqJLK9e9tZxaqTEKxWJRVsYuk+y501qNA
		lJiZv58SVHOeV3Tyvpqzc56drnwj0J1uR2fne7FuWQ7YsF7hQWxQ1DuMenghAzTD2B0whM4Iv+jk
		PelaSOBVHIRXAetg/2a9UpMaeD9OFjkav6ZAisb0c1cOxTmWbVct5ihb5R0H1O6ScgzEarO/Qd6U
		OYyEzRbpU4FliR+KlE4JjRJVtC27XhaFzCzCaNXDSVCjXl3nki49/IRpGHrMRAImftWLvuVIXqNV
		pfsrUjd07NjwOtauWExBp4sTJp6IUz4/lT5bMPR4r8Qh4G0Cnn17CSZjAh/JNgfAmkHdhn9bdO8C
		bNr8f+ifOBjj+kwR++OJV6b7zI4BgyWJQfdp9NAJl9/ftbchY3fKnPZkttmoF1HXtfF3I8fj6Oln
		kZcS43ERFq5FTDRYGvISTHYR/7vqQLz2+EJioIPDRoyQFL8bVCNRlIZnoNLpjKTyObqXgMsrvBcG
		jJOb/HOD0OjB7w6WL3sUGzauk9Vte1mxH3roVMIttIUChiMSpAtYKkKjcsZ6b2QOjLhBmEk8UU4c
		6rpeYsRU6Ix7xZKRB0Nc8djYz7dPuq4FakwVgCGhiGVJJphBiAODUbYZjO600DekGiSrXGzMNPpH
		I6HNbSWBdcpIBt2zsn2Ge5qcUxSmBpLj1KRBdjeNYxQfZDD69OmDKaecjPVvrsOGDRsEmDARyJFq
		y1t/wfpnn6H4IxIn0IRdVh3EYM1IlF6IXNkd614W5jLIW7dsxTOrVkm+rHginK5nDnHBS4uJ1phG
		Ujr0/wTZJAEDYV3GV1nt7e3kiifRYm1Gq7UV5QvckYVTts7re2ihR7lHk6CfPvpYcnu9XLa3s6MD
		F8yahe9+/3u4+MKZUgt55+13sGPHDl8t0OSlYcD1isvEuZl5XrmEo2/YJdVMwLsxhDVNLJCySjQM
		ethFUqCi4urpXmU0om75Hk6CthuFLiKtOJKGs849B+vXr8eLz7+AW26/DaNGj8add/wCjy1bRoB1
		IdWQyneRqGIgVInbrooaIEIUtSLCAu+ljE2rlSba0hOnqgo9JRWbfilgIrw9DYbQFdwp6+4jRo7E
		kWPH4KGlv5a0wl13/BIbCBwu385ftBDTzjhd1JeXm7iWW2khI0remlbCvGIaLUJTbpx6aHpTjaUe
		u1ICyKnTThOD/vuVT6JPYyPeeP11zL1oDi6ZORufHDAAP7npRsyec7EUsT7q5dLe2CShRSuF/fr1
		w9TTTsNTBMbb27bmDPCJEydKc0O/fs147dVX8cpLL4vPvy8y+sMueOXikGwmiwknnoDBQwbjumuu
		8ZOLmQy+deW3ccncr2DL5s24+vs/kGaFDLmkKbI1Ukso45WEdYqCm4nUq8PvbiXmhKmQGmmKJ19g
		GdidD2spFcDwaqCJq+8Xe4MfFLCCwPCcGedh+/btWEPGnF1djoAbSW3d/NMbsXTx/WhraxOXOJVq
		8JN3WvWbzgNQGJTkfq8h/eBVKPlEacqN5efm8vFOrDSFuakaaCo5FT0SGLK6+sSBn5Ag7P6Fi8SH
		Z8ZzPuim62+QLkYGiLtE7GwGY0+bhcMnTi2IQ8R9dLkuYEksonMsErk5jkO2vr4Gzz9wCzSKHYgK
		59jtOM7pRqaIjXyLVuDFmZyC8WJrYjkag+sVRRMz6chGZeJXZn8pYlzx9a9h7FHjKH4pTaNbVlay
		B4ZpwDRiCl5BsMoLlFU4q+sQGj7nrU1v4cbrfiLxz+6qMgkM+SJspK/8xrdkUAYjalv4e66XliLk
		/oOHY9gxxyKbjqS2pZjjpxiMhCbNydEX13fSHV0595Eph7pZHOum0R2tsbP65OCO6zAEhlFmYpmA
		hgEzY2gSPJKWlxz2HI+fMKGgjZWnxEFohtQ1t7kmk6kgc1DIPMkckKPDfOJFW9BHRYuif//+PWZ7
		jCjjxcrH6MLCQbxcYBbeAwXpBIYnP5gJVQKG0HBB0skGJREvDO8K9HwIhkvjJMuAEaVJlAFDpIdz
		Wiqfcom6y7lVT2BwuxJnBFIERk6tqSgYWbGl7Oo3NKT8Nviia0abL3q0t7eSTvRyOX8TW9Y+S9+t
		XI+vY2d9/a0bkuCLLeLQOK2b/pLLg/HfNVoKHUoT9SXjsJHnWML1csXZ0ryTEjotRk3lLhfUc3Z4
		ht+zTt9XPP4ENqxbL0lLfwF6wWc/S6ximi54eJYOUYGmEdsEwVKzbdu2qu7xB+rtrW0QJZ0VnGJX
		kUjdy1XyvNJkUUDDaRcjkcrrbh4LhS09FW86lNYKHYyIROkMWiK4n0w6I9nhaCGrUp2lljajkIa1
		CtvYHnB/2416B2Ewjp5+MQ4/6VRkOzt8m8G5dRWXBHSlY4QnnCQ7JEZ9yc25rgw2vCZQsDoru5te
		ZTBCJsXQJFPMsGSvD1aNegfxPAf9Bg3F4JHjkO12oJt6aWuMCjs2PKHn9plkIxn1XR1+j1MviYp7
		GxgFJdzaB1GSamcPxmwo38vkBLrISBrg7DjTqR4Knj6KEXjdgWGtg+ikbraufa4kBR/Nikq9PdyX
		qBuBM6ChZdO6fHGrp9IhEdeq0ibLWmh6g/TkjHo9g2RsS5oUCuKnqHuZC4q9guNcXzckYMyzstz1
		OBwwoivadssDVpHRKrcP1Yv2D2lBM17vUmXtRj2DMEsaSTK+6bbhABU2aoauJvv+mvzfdDlr6ZUu
		ZZfdSD+GMLgBrYJ6eY1c4qVGXxgOSWJzEtZXR1G0FynTcs+W7fmNdUYZSWIaJwgQdS2/gEwKXN/Y
		CXPJem636VVJUKOeQRgQZuJIirAHerZ0OxVE1/Q94ZaPrrNcC+fmTqJJlKGxpEij0O5qEkz6+RNa
		DKMOABoMP8LkLkeLPDg2SQktvpGNweDMAUsr02gRmiTZvg5LVpHCh2fAqwaGVRENknfcVGrkutBJ
		hUm3B/GLjH25yDnLeScCLUWSkYhpmmMaW/Olpw/RJIvKrmG/L694RaAwk/0+4Zh7DiRDjid8qS1a
		hkG8gr2y6utxKox6EOVvnAh8TG9Ck+6KREQjZ0OLB4MjZzuk4evp8TROULtOkav8ljJ9Mr5o2oHx
		m7egiJHKCiwBffZiulpUAIhMiwD0YnYYKAJK27RLpKYWI783ayxlI/VyK4O/pSUyD5oWwhpCuKej
		yP8tqG9XoJEV64VPN1CiGpMRI6wyTvXNOTV4byr8a2j+tojeFYu01x0YBgYjlxb0n0hQ2iQgkCm/
		6cyVBgifxjRIZRlFRauSCDxm2TcY1Z+2UEvf1L4UGPLWhD4pBzOntqCpj+vvqFLxLTa24+8rYTXG
		O6pEyxAQq9c244/0Ng2vII7YlyPwetRdXYEhOziphIfzp7Rg0MAMyjQCgjOGjqXJ/kKy8nmupyBb
		5p76cz8BZH+TBCqXcKtfyP8jjOYz40rqFj+AQBNpEDCiGsgLyw1qn8g77YkUjVHvIBygv7GxAQe8
		Z6IoTyibR7OWJhtDeUeVUkW9thSkb21JImwX3t8aFJPS51bS0MuqNkiukUCVuv9e0LmoaSrWLofZ
		Ctfbt1Z0D9O01x0Ycs09k7H8+nOYJBLJcaBL04Em43FBiMExgw06fsOyCqRm306h7w7wWq0X4pp7
		V9B9cvI/TEFTU4MYEZ2Cr2ymG1/88vm4/a47MHjwwch0d+KzkyZi6KGHoLtrF92ALbuzZI87Pn4G
		vB4prKliyE+V45agU08/HXO/ejkGHjwI551xZm4vSd++feXZWlxj37F9O9KZjDwnZey4cfjV3fPx
		yIMPorW1VTo2SvabfAxWfT0qUat0kFtfuE3mM5MmYd7dd+KGn92EI0aNxJoXXpC2Ia4l8/6O8ccf
		hwEDDsLS+5dIMx1L0ZoX16CxqQn/ctWVuGfhAlw4e5YAwj1eJTWA/b29+fRUXOrE37rm4sgxYzD7
		kjmyeYdff37lFdx3z3ysevoPPpoESGdHJ278+c/k+VczzjwbmzdtgknSFHbSs6Scdd654gSse3Md
		Fsyfj5UrfpfbF9jbVvSHbOTbSwAJG8MGHHQQHn50mTxGiVf9tVf/CMsefkRiiMamxuARTFkMHDgQ
		Dz36W7z04ou4Yu5lIh1hb5c8k5EkadzRR+E/f/xjjD5ytPx+1T9/G48vX55ryNtfws0/nkmL1WPE
		0C6yG88+80f5zl3x06ZPx6TJk4nhCX+jJXtSZCsmnTxZNvD85uGH/Q2cwarnlk2uKnL75nlf+AKG
		/f0wGWvD+g3YtnVrXc/K6q3qZU/QBI9nUs3FN8zMZRd34mc/g4svvYTsxPHy+x+eehoL771P7AjT
		LliyGIOHDMHZ06bLcxmZ0ayO+LcLL5qFc2fMkN/eefttUlf3YtkjjwjY3Jz2cYrAa6RpN8pdKNyJ
		9NSTv8fqZ/8kTyOdPWcOPjd5EsaMHYPpU0/FocOGiZ154L8WixfFzdj8YrtyxTe+htPIK9v5/vvy
		IM3/fuDX2LFju6ipvQ3GR0nCjEoX4pOZgXxsxfLH8eyqZ/CP/KhYAoVfvH2BX8sffSzoGvfH4YcE
		7Hx/JxYvXIR777kHWzZvEQ+L3eP9UXoVmuJduJUGCfevNzc3y+cxFGcwYM+vXl2ygYUBaNvZBo0i
		wnzv7H4DXoWm3ahnEFZjDAB7V/z5heeek2PM/OIX2wm/fXP/A5LroTHwAdpJQ7c2BKISzf5VX9f8
		RfG/S+/sfqPaKzy8Xf8vwAAYSy93SFkRDQAAAABJRU5ErkJggg==`
	},
	$scheme: {
		type: 'group',
		items: [{
			type: 'group',
			name: 'Данные',
			binding: 'record',
			key: 'record',
			items: [{
				name: 'Серии',
				type: 'group',
				multiple: true,
				key: 'series',
				items: [{
					type: 'select',
					name: 'Тип',
					key: 'type',
					items:[{
						name: 'Линейный',
						type: 'item',
						itemValue: 'Line',
						editor: 'none'
					},{
						name: 'Круговой',
						type: 'item',
						itemValue: 'Circle',
						editor: 'none'
					},{
						name: 'Дуговой',
						type: 'item',
						itemValue: 'SemiCircle',
						editor: 'none'
					}]
				},{
					type: 'item',
					name: 'Минимум',
					itemType: 'integer',
					itemValue: 0,
					binding: 'field'
				},{
					type: 'item',
					name: 'Максимум',
					itemType: 'integer',
					itemValue: 100,
					binding: 'field'
				},{
					type: 'item',
					name: 'Значение',
					itemType: 'integer',
					itemValue: 50,
					binding: 'field'
				},{
					type: 'item',
					name: 'Цвет столбца',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor',
					itemValue: '#555'
				},{
					type: 'item',
					name: 'Толщина столбца',
					itemType: 'float',
					itemValue: 3
				},{
					type: 'item',
					name: 'Цвет дорожки',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor',
					itemValue: '#eee'
				},{
					type: 'item',
					name: 'Толщина дорожки',
					itemType: 'float',
					itemValue: 1
				},{
					name: 'CSS стиль текста',
					type: 'item',
					optional: true,
					itemType: 'string',
					itemValue: `/* Заполните объект CSS значениями */
{
	font-family: 'arial';
}`,
					key: 'textCss',
					editor: 'JSB.Widgets.MultiEditor',
					options: {
						valueType: 'org.jsbeans.types.Css'
					}
					
				}]
			}]
		}]
	},
	
	$client: {
		ready: false,
		
		$bootstrap: function(){
			(function(){
				`#include 'progressbar.js'`
			}).call(null);
		},
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('progressBar');
			this.loadCss('ProgressBar.css');
			
			JSB.loadScript('tpl/d3/d3.min.js', function(){
				$this.ready = true;
			});

		},
		
		refresh: function(){
			if(!this.ready){
				JSB.deferUntil(function(){
					$this.refresh();
				}, function(){
					return $this.ready;
				});
				return;
			}

			var recordContext = this.getContext().find('record');
			if(recordContext.data()){
				$this.draw();
			} else {
				recordContext.fetch({batchSize: 1}, function(){
					recordContext.next();
					$this.draw();
				});
			}
		},
		
		draw: function(){
			
		}
		

	}
}
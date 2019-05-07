{
	$name: 'DataCube.Actions.ShareDashboardAction',
	$parent: 'JSB.Widgets.MenuAction',
	
	$expose: {
		category: ['dashboardViewer'],
		title: 'Поделиться',
		fixed: true,
		description: 'Разместить ссылку на визуализацию в социальных сетях или отправить по email',
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDk2IDk2IiBoZWlnaHQ9Ijk2cHgiIGlkPSJzaGFyZSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgOTYgOTYiIHdpZHRoPSI5NnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNNzIsNTZjLTQuODEzLDAtOS4xMiwyLjEzNy0xMi4wNTQsNS41MDFMMzkuNjQzLDUxLjM1QzM5Ljg3Myw1MC4yNjksNDAsNDkuMTQ5LDQwLDQ4cy0wLjEyNy0yLjI2OS0wLjM1Ny0zLjM0OSAgbDIwLjMwMy0xMC4xNTJDNjIuODc5LDM3Ljg2NCw2Ny4xODcsNDAsNzIsNDBjOC44MzYsMCwxNi03LjE2NCwxNi0xNlM4MC44MzYsOCw3Miw4cy0xNiw3LjE2NC0xNiwxNiAgYzAsMS4xNDksMC4xMjcsMi4yNjksMC4zNTcsMy4zNDlMMzYuMDU0LDM3LjUwMUMzMy4xMjEsMzQuMTM2LDI4LjgxNCwzMiwyNCwzMmMtOC44MzYsMC0xNiw3LjE2NC0xNiwxNmMwLDguODM2LDcuMTY0LDE2LDE2LDE2ICBjNC44MTQsMCw5LjEyLTIuMTM3LDEyLjA1NC01LjUwMWwyMC4zMDQsMTAuMTUyQzU2LjEyNyw2OS43MzEsNTYsNzAuODUxLDU2LDcyYzAsOC44MzYsNy4xNjQsMTYsMTYsMTZzMTYtNy4xNjQsMTYtMTYgIFM4MC44MzYsNTYsNzIsNTZ6IE03MiwxNmM0LjQxOCwwLDgsMy41ODIsOCw4cy0zLjU4Miw4LTgsOHMtOC0zLjU4Mi04LThTNjcuNTgyLDE2LDcyLDE2eiBNMjQsNTZjLTQuNDE4LDAtOC0zLjU4Mi04LTggIGMwLTQuNDE4LDMuNTgyLTgsOC04czgsMy41ODIsOCw4QzMyLDUyLjQxOCwyOC40MTgsNTYsMjQsNTZ6IE03Miw4MGMtNC40MTgsMC04LTMuNTgyLTgtOHMzLjU4Mi04LDgtOHM4LDMuNTgyLDgsOFM3Ni40MTgsODAsNzIsODAgIHoiLz48L3N2Zz4='
	},

	$client: {
		$require: ['JSB.Widgets.ToolManager',
		           'css:ShareDashboardAction.css',
		           'script:../../tpl/sharer/sharer.min.js'],
		
		execute: function(opts){
			var ctx = opts.context;
			
			var dashboardEntry = ctx.getDashboard();
			var targetElt = opts.sender.getElement();
			var elt = $this.$(opts.event.currentTarget);
			var title = dashboardEntry.getName();
			var url = window.location.href;
			var tags = JSB.$('meta[name="keywords"]').attr('content');
			var logo = JSB.$('meta[property="og:image"]').attr('content');
			
			function _twitterPrepareTags(){
				if(!tags || tags.length == 0){
					return '';
				}
				var newTagsStr = '';
				var tagParts = tags.split(',');
				for(var i = 0; i < tagParts.length; i++){
					if(newTagsStr.length > 0){
						newTagsStr += ', ';
					}
					newTagsStr += tagParts[i].trim().toLowerCase().replace(/\s/g, '');
				}
				return newTagsStr;
			}

			
			// generate items
			ToolManager.activate({
				id: '_dwp_droplistTool',
				cmd: 'show',
				data: [{
					key: 'email',
					element: JSB.$('<div data-sharer="email">Email</div>')
						.attr('data-title', title)
						.attr('data-subject', title)
						.attr('data-to', 'some@email.com')
						.attr('data-url', url)
				},{
					key: 'twitter',
					element: JSB.$('<div data-sharer="twitter">Twitter</div>')
						.attr('data-title', title)
						.attr('data-hashtags', _twitterPrepareTags())
						.attr('data-url', url)
				},{
					key: 'facebook',
					element: JSB.$('<div data-sharer="facebook">Facebook</div>')
						.attr('data-url', url)
						.attr('data-hashtag', tags && tags.split(',')[0].trim() || '')
				},{
					key: 'vk',
					element: JSB.$('<div data-sharer="vk">VK</div>')
						.attr('data-url', url)
						.attr('data-title', title)
						.attr('data-caption', title)
						.attr('data-image', logo)
				},{
					key: 'okru',
					element: JSB.$('<div data-sharer="okru">Ok</div>')
						.attr('data-url', url)
						.attr('data-title', title)
				},{
					key: 'linkedin',
					element: JSB.$('<div data-sharer="linkedin">Linkedin</div>')
						.attr('data-url', url)
				},{
					key: 'whatsapp',
					element: JSB.$('<div data-sharer="whatsapp">WhatsApp</div>')
						.attr('data-title', title)
						.attr('data-url', url)
						.attr('data-web', true)
				},{
					key: 'skype',
					element: JSB.$('<div data-sharer="skype">Skype</div>')
						.attr('data-title', title)
						.attr('data-url', url)
				}],
				key: 'shareAction',
				target: {
					selector: elt,
					dock: 'bottom'
				},
				callback: function(key, data){
					Sharer.add({srcElement: data.wrapper.find('[data-sharer]').get(0)})
				}
				
			});
		}
		

	}
	
}
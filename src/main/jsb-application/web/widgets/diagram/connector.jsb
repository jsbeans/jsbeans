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
	$name: 'JSB.Widgets.Diagram.Connector',
	
	$client: {
		node: null,
		_lalCallCnt: 0,
		remoteConnectors: {},
		links: {},
		originRc: {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		},
		
		options: {
			enabled: true,
			userLink: true,
			checkSize: true,
			allowLinkCallback: function(remoteConnector, linkId, callback){
				return true;
			},
			onHighlight: function(bEnable, meta){},
			onDenyWiring: function(bEnable){
				if(this.options.handle){
					var handle = this.options.handle;
					if(!JSB().isArray(handle)){
						handle = [handle];
					}
					for(var i = 0; i < handle.length; i++){
						if(bEnable){
							handle[i].css({
								'cursor': 'not-allowed'
							})
						} else {
							handle[i].css({
								'cursor': ''
							})
						}
					}
				}
			},
			onChangeConnection: function(link){}
		},
		
		$constructor: function(node, key, opts){
			var self = this;
			$base();
			this.node = node;
			this.key = key;
			JSB().merge(this.options, opts);

			if(opts.handle){
				JSB().chain([opts.handle, opts.origin], this.node.resolveSelector, function(selArr){
					self.options.handle = selArr[0];
					self.options.origin = selArr[1];
					
					self.install();
				});
			} else {
				this.node.resolveSelector(opts.origin, function(sel){
					self.options.origin = sel;
					self.install();
				});
			}
			
			if(this.options.checkSize && this.options.origin){
				$this.options.origin.on({
					resize: function(){
						if(!$this.options.origin.is(':visible')){
							return;
						}
						$this.updateOrigin();
						var links = $this.getLinks();
						for(var lId in links){
							links[lId].redraw();
						}
					}
				});
			}
		},
		
		destroy: function(){
			if(!this.node.diagram){
				return;
			}

			if(this.node._connectors[this.getId()]){
				delete this.node._connectors[this.getId()];
			}
			
			var links = this.getLinks();
			for(var lId in links){
				links[lId].destroy();
			}
			
			$base();
		},
		
		updateOrigin: function(){
			var zoom = this.node.diagram.getOption('zoom');
			var nodePos = this.node.getElement().get(0).getBoundingClientRect();
			var originRc = this.options.origin.get(0).getBoundingClientRect();
			if(this.node.isFixed()){
				this.originRc.left = (originRc.left - nodePos.left);
				this.originRc.top = (originRc.top - nodePos.top);
				this.originRc.width = (originRc.right - originRc.left);
				this.originRc.height = (originRc.bottom - originRc.top);
			} else {
				this.originRc.left = (originRc.left - nodePos.left) / zoom;
				this.originRc.top = (originRc.top - nodePos.top) / zoom;
				this.originRc.width = (originRc.right - originRc.left) / zoom;
				this.originRc.height = (originRc.bottom - originRc.top) / zoom;
			}
		},
		
		install: function(){
			var self = this;
			if(!this.node.diagram){
				this.installed = false;
				return;
			}
			
			var cOpts = this.node.diagram.connectorDescs[this.key].options;
			
			this.options = JSB().merge(this.options, cOpts);
			
			if(this.options.origin){
				this.updateOrigin();
			}

			if(this.options.handle && this.options.userLink){
				var handle = this.options.handle;
				if(!JSB().isArray(handle)){
					handle = [handle];
				}
				for(var i = 0; i < handle.length; i++){
					handle[i].on({
						mouseover: function(evt){
							self.publish('_jsb_diagramMouseEvent', {name: 'mouseover', event: evt});
						},
						
						mouseout: function(evt){
							self.publish('_jsb_diagramMouseEvent', {name: 'mouseout', event: evt});
						},
						
						click: function(evt){
							self.publish('_jsb_diagramMouseEvent', {name: 'click', event: evt});
						},
						
						mousedown: function(evt){
							self.publish('_jsb_diagramMouseEvent', {name: 'mousedown', event: evt});
						},

						mouseup: function(evt){
							self.publish('_jsb_diagramMouseEvent', {name: 'mouseup', event: evt});
						},

						mousemove: function(evt){
							self.publish('_jsb_diagramMouseEvent', {name: 'mousemove', event: evt});
						},
					});
				}
			}
			
			this.subscribe('_jsb_diagramConnectorUserHover', function(sender, msg, source){
				if(sender.diagram != $this.getNode().diagram || !self.isEnabled()){
					return;
				}
				
				self._lalCallCnt++;
				if(source == self){
					// highlight source connector
					self.highlight(true, 'source');
				} else {
					// highlight target connector if accepted
					if(source.node != self.node || source.options.acceptLocalLinks){
						var lalStored = self._lalCallCnt;
						self.node.diagram.lookupAppropriateLinks(source, self, function(lMap){
							if(lalStored != self._lalCallCnt){
								return;
							}
							if(lMap && Object.keys(lMap).length > 0){
								self.highlight(true, 'target');
							} else {
								self.highlight(false, 'target');
							}
						});
					} else {
						self.highlight(false, 'target');
					}
				}
			});
			
			this.subscribe('_jsb_diagramConnectorUserOut', function(sender, msg, source){
				if(sender.diagram != $this.getNode().diagram || !self.isEnabled()){
					return;
				}

				self._lalCallCnt++;
				if(source == self){
					self.highlight(false, 'source');
				} else {
					self.highlight(false, 'target');
				}
			});

			this.installed = true;
			this.publish('_jsb_diagramConnectorInstalled');
			this.setTrigger('_jsb_diagramConnectorInstalled');
		},
		
		isInstalled: function(){
			return this.installed;
		},
		
		getOrigin: function(){
			return this.options.origin;
		},
		
		getPoint: function(){
			if(!this.installed){
				return null;
			}
			var nodePos = this.node.getPosition();
			
			var ox = Math.round(this.originRc.left + this.originRc.width / 2);
			var oy = Math.round(this.originRc.top + this.originRc.height / 2);

			switch(this.options.hAlign){
			case 'left':
				ox = this.originRc.left;
				break;
			case 'right':
				ox = this.originRc.left + this.originRc.width - 1;
				break;
			}
			
			switch(this.options.vAlign){
			case 'top':
				oy = this.originRc.top;
				break;
			case 'bottom':
				oy = this.originRc.top + this.originRc.height - 1;
				break;
			}

			if(this.options.offsetX){
				ox += this.options.offsetX;
			}

			if(this.options.offsetY){
				oy += this.options.offsetY;
			}
			
			if(this.getNode().isFixed()){
				ox /= this.getNode().diagram.getOption('zoom');
				oy /= this.getNode().diagram.getOption('zoom');
			}
			
			return {
				x: nodePos.x + ox,
				y: nodePos.y + oy
			};
		},

		highlight: function(bEnable, meta){
			if(!this.options.onHighlight){
				return;
			}
			var self = this;
			self.options.onHighlight.call(self, bEnable, meta);
		},
		
		denyWiring: function(bEnable){
			if(!this.options.onDenyWiring){
				return;
			}
			this.options.onDenyWiring.call(this, bEnable);
		},
		
		addLink: function(link){
			// get remote connector
			var remoteConnector = link.source;
			if(remoteConnector == this){
				remoteConnector = link.target;
			}
			var linkMap = this.remoteConnectors[remoteConnector.getId()];
			if(!linkMap){
				linkMap = this.remoteConnectors[remoteConnector.getId()] = {};
			}
			if(!linkMap[link.key]){
				linkMap[link.key] = link;
			}
			this.links[link.getId()] = link;
		},
		
		getLinks: function(){
			return this.links;
		},
		
		hasLink: function(link){
			var linkId = null;
			if($jsb.isString(link)){
				linkId = link;
			} else {
				linkId = link.getId();
			}
			if(this.links[linkId]){
				return true;
			} 
			return false;
		},
		
		notifyChangeConnection: function(link){
			if(this.options.onChangeConnection){
				this.options.onChangeConnection.call(this, link);
			}
		},
		
		removeLink: function(link){
			if(this.links[link.getId()]){
				delete this.links[link.getId()];
			}
			// get remote connector
			var remoteConnector = link.source;
			if(remoteConnector == this){
				remoteConnector = link.target;
			}
			if(!JSB().isInstanceOf(remoteConnector, 'JSB.Widgets.Diagram.Connector')){
				return;
			}
			var linkMap = this.remoteConnectors[remoteConnector.getId()];
			if(!linkMap || !linkMap[link.key]){
				return;
			}
			delete linkMap[link.key];
			if(Object.keys(linkMap).length === 0){
				delete this.remoteConnectors[remoteConnector.getId()];
			}
		},
		
		enable: function(bEnable){
			this.options.enabled = bEnable;
		},
		
		isEnabled: function(){
			return this.options.enabled;
		},
		
		getRemote: function(link){
			if(link){
				var linkId = null;
				if($jsb.isString(link)){
					linkId = link;
				} else {
					linkId = link.getId();
				}
				var link = this.links[linkId];
				if(!link){
					return null;
				}
				var rConn = link.source;
				if(rConn == this){
					rConn = link.target;
				}
				return {connector: rConn, link: link, node: rConn.node};
			} else {
				var remoteConnArr = [];
				for(var lId in this.links){
					var link = this.links[lId];
					var rConn = link.source;
					if(rConn == this){
						rConn = link.target;
					}
					remoteConnArr.push({connector: rConn, link: link, node: rConn.node});
				}
				
				return remoteConnArr;
			}
		},
		
		getNode: function(){
			return this.node;
		}
		
	},
	
	$server: {}
}
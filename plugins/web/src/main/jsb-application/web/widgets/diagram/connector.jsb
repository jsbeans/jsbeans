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
			$base();
			this.node = node;
			this.key = key;

			this.options = JSB().merge(this.options, node.getDiagram().getConnectorDescription(key).options, opts);

			this.getNode().ensureInitialize(function(){
			    $this.install();
			});
			
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

			if(this.node.connectors[this.getId()]){
				delete this.node.connectors[this.getId()];
			}
			
			var links = this.getLinks();
			for(var lId in links){
				links[lId].destroy();
			}
			
			$base();
		},
		
		updateOrigin: function(){
			var nodePos = this.node.getElement().get(0).getBoundingClientRect();
			var originRc = this.options.origin.get(0).getBoundingClientRect();
			this.originRc.left = originRc.left - nodePos.left;
			this.originRc.top = originRc.top - nodePos.top;
			this.originRc.width = originRc.right - originRc.left;
			this.originRc.height = originRc.bottom - originRc.top;
		},
		
		install: function(){
			if(!this.node.diagram){
				this.installed = false;
				return;
			}
			
			var cOpts = this.node.diagram.connectorDescs[this.key].options;
			
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
							$this.node.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mouseover', event: evt});
						},
						
						mouseout: function(evt){
							$this.node.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mouseout', event: evt});
						},
						
						click: function(evt){
							$this.node.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'click', event: evt});
						},
						
						mousedown: function(evt){
							$this.node.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mousedown', event: evt});
						},

						mouseup: function(evt){
							$this.node.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mouseup', event: evt});
						},

						mousemove: function(evt){
							$this.node.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mousemove', event: evt});
						},
					});
				}
			}
			
			this.subscribe('_jsb_diagramConnectorUserHover', function(sender, msg, source){
				if(!$this.isEnabled()){
					return;
				}
				$this._lalCallCnt++;
				if(source == $this){
					// highlight source connector
					$this.highlight(true, 'source');
				} else {
					// highlight target connector if accepted
					if(source.node != $this.node || source.options.acceptLocalLinks){
						var lalStored = $this._lalCallCnt;
						$this.node.diagram.lookupAppropriateLinks(source, $this, function(lMap){
							if(lalStored != $this._lalCallCnt){
								return;
							}
							if(lMap && Object.keys(lMap).length > 0){
								$this.highlight(true, 'target');
							} else {
								$this.highlight(false, 'target');
							}
						});
					} else {
						$this.highlight(false, 'target');
					}
				}
			});
			
			this.subscribe('_jsb_diagramConnectorUserOut', function(sender, msg, source){
				if(!$this.isEnabled()){
					return;
				}

				$this._lalCallCnt++;
				if(source == $this){
					$this.highlight(false, 'source');
				} else {
					$this.highlight(false, 'target');
				}
			});

			this.installed = true;
			this.publish('_jsb_diagramConnectorInstalled');
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

			this.options.onHighlight.call(this, bEnable, meta);
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
	}
}
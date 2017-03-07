{
	name: 'JSB.Widgets.Diagram.WiringController',
	parent: 'JSB.Widgets.Diagram.Controller',
	require: {
	},
	
	client: {
		fromConnector: null,
		toPt: null,
		wiringLink: null,
		wiringType: null,

		constructor: function(opts){
			var self = this;
			$base(opts);
		},
		
		enter: function(fromConnector, curPt){
			this.fromConnector = fromConnector;
			this.toPt = curPt;
			
			// construct temporary wire
			var wiringLinkKey = '_jsb_diagramUserWiringLink';
			this.wiringType = 'source';
			if(this.fromConnector.options.wiringLink){
				wiringLinkKey = this.fromConnector.options.wiringLink.key;
				this.wiringType = this.fromConnector.options.wiringLink.type;
			}
			this.wiringLink = this.diagram.createLink(wiringLinkKey);
			this.wiringLink.setWiringModeStyle(true);
			if(this.wiringType == 'source'){
				this.wiringLink.setSource(this.fromConnector);
				this.wiringLink.setTarget(this.toPt);
			} else {
				this.wiringLink.setSource(this.toPt);
				this.wiringLink.setTarget(this.fromConnector);
			}
			this.publish('_jsb_diagramConnectorUserHover', this.fromConnector);
		},
		
		onMessage: function(sender, msg, params){
			// do something
			switch(msg){
			case '_jsb_diagramMouseEvent':
				return this.handleMouseEvent(sender, params);
				break;
			}
		},
		
		handleMouseEvent: function(sender, params){
			var self = this;
			switch(params.name){
			case 'mouseover':
			case 'mouseout':
				return true;
				break;
			case 'mouseup':
				this.releaseCapture();
				if(params.event.which != 1){
					return;
				}
				if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Connector') && sender != this.fromConnector){
					params.event.stopPropagation();
					// connect link and complete wiring
					this.diagram.lookupAppropriateLinks(this.fromConnector, sender, function(lMap){
						if(lMap && Object.keys(lMap).length > 0){
							// create new link
							if(Object.keys(lMap).length > 1){
								// TODO: ask choose link dialog
								debugger;
							} else {
								// create link
								var linkId = Object.keys(lMap)[0];
								var link = self.diagram.createLink(linkId);
								var wiringType = lMap[linkId];
								if(wiringType == 'source'){
									link.setSource(self.fromConnector);
									link.setTarget(sender);
								} else {
									link.setSource(sender);
									link.setTarget(self.fromConnector);
								}								
							}
							
						}
					});
					
					sender.denyWiring(false);
				}
				this.diagram.removeLink(this.wiringLink);
				this.publish('_jsb_diagramConnectorUserOut', this.fromConnector);
				this.diagram.popController();	// exit wiring
				this.diagram.controllers.normal.preventClick = true;
				return true;
				break;
			case 'mousemove':
				var curPt = this.diagram.pageToSheetCoords({x: params.event.pageX, y: params.event.pageY});
				
				function _connectPoint(pt){
					self.toPt = pt;
					if(self.wiringType == 'source'){
						self.wiringLink.setTarget(self.toPt);
					} else {
						self.wiringLink.setSource(self.toPt);
					}
				}
				
				if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Connector') && sender != this.fromConnector && sender.isEnabled()){
					params.event.stopPropagation();
					// check current connector
					this.diagram.lookupAppropriateLinks(this.fromConnector, sender, function(lMap){
						if(lMap && Object.keys(lMap).length > 0){
							// allow
							sender.denyWiring(false);
							_connectPoint(sender.getPoint());
							self.wiringLink.setWiringModeStyle(false);
						} else {
							// deny
							self.wiringLink.setWiringModeStyle(true);
							self.lastConnectorDenied = sender;
							sender.denyWiring(true);
							_connectPoint(curPt);
						}
					});
				} else {
					if(self.lastConnectorDenied){
						self.lastConnectorDenied.denyWiring(false);
						self.lastConnectorDenied = null;
					}
					_connectPoint(curPt);
					self.wiringLink.setWiringModeStyle(true);
				}
				break;
			}
		}
	}
}
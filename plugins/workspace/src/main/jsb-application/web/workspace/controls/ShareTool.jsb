{
	$name:'JSB.Workspace.ShareTool',
	$parent: 'JSB.Widgets.Tool',
	$require: {
		RendererRepository: 'JSB.Widgets.RendererRepository',
		ComboBox: 'JSB.Widgets.ComboBox'
	},
	$client: {
		$bootstrap: function(){
			// register tooltip
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: 'JSB.Workspace.ShareTool',
					jso: $this,
					wrapperOpts: {
						exclusive: 'JSB.Workspace.ShareTool',
						modal: true,
						hideByOuterClick: false,
						hideInterval: 0,
						cssClass: '_jsb_workspaceShareToolWrapper'
					}
				});
			});
		},
		
		$constructor: function(opts){
			$base(opts);
			this.construct();
		},
		
		construct: function(){
			this.loadCss('ShareTool.css');
			this.addClass('_jsb_workspaceShareTool');
			
			this.append(`#dot
				<div class="header">Предоставить доступ к объекту <div class="shareObject"></div></div>
				<div class="target local">
					<div class="header">рабочим областям:</div>
					<div jsb="JSB.Controls.ScrollBox">
						<table cellspacing="0" cellpadding="0">
							<colgroup>
								<col class="workspace" />
								<col class="access" />
							</colgroup>
							<tbody></tbody>
						</table>
					</div>
				</div>
				<div class="target users">
					<div class="header">пользователям:</div>
					<div jsb="JSB.Controls.ScrollBox">
						<table cellspacing="0" cellpadding="0">
							<colgroup>
								<col class="user" />
								<col class="access" />
							</colgroup>
							<tbody></tbody>
						</table>
					</div>
				</div>
				<div class="emptyMessage hidden">Нет ни рабочих областей ни пользователей, которым можно было бы предоставить доступ</div>
				<div class="btnBar">
					<div 
						jsb="JSB.Widgets.Button" 
						class="btnOk" 
						caption="Применить"
						onclick="{{=$this.callbackAttr(function(evt){ $this.apply(); })}}">
					</div>
					<div 
						jsb="JSB.Widgets.Button" 
						class="btnCancel" 
						caption="Отмена" 
						onclick="{{=$this.callbackAttr(function(evt){ $this.close(); })}}">
					</div>
				</div>
`);
			this.localTableBody = $this.find('.target.local tbody');
			this.usersTableBody = $this.find('.target.users tbody');
		},
		
		complete: function(){
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			if(!this.isContentReady()){
				JSB.deferUntil(function(){
					$this.update();
				}, function(){
					return $this.isContentReady();
				});
				return;
			}
			
			var entry = this.data.data.entry;
			var explorer = this.data.data.explorer;
			
			$this.find('.btnBar .btnOk').jsb().enable(false);
			// clear table
			$this.localTableBody.empty();
			$this.usersTableBody.empty();
			if($this.shareObjectRenderer){
				$this.shareObjectRenderer.destroy();
			}
			
			$this.shareObjectRenderer = RendererRepository.createRendererFor(entry);
			$this.find('.header .shareObject').append($this.shareObjectRenderer.getElement());
			
			$this.getElement().loader();
			entry.server().getShareInfo(function(shareDesc){
				var shareMap = shareDesc.shares;
				var maxAccess = shareDesc.maxAccess;
				$this.getElement().loader('hide');
				
				$this.shareMap = shareMap;
				$this.newShareMap = JSB.clone(shareMap);
				
				var accessItems = [{
					key: 'not', 
					element:'Нет'
				},{
					key: 'readOnly', 
					element:'Только чтение'
				},{
					key: 'readWrite', 
					element:'Чтение и запись'
				}].slice(0, maxAccess + 1);
				
				function fillList(tableBody, itemList, nameProc){
					// fill table
					for(var i = 0; i < itemList.length; i++){
						var itemName = nameProc(itemList[i]);
						var tr = $this.$('<tr></tr>');
						tableBody.append(tr);
						tr.append($this.$('<td key="'+itemList[i].id+'"></td>').text(itemName));
						
						var accessCombo = new ComboBox({
							key: itemList[i].id,
							items:accessItems, 
							value: ['not', 'readOnly', 'readWrite'][itemList[i].access],
							onChange: function(val){
								var id = this.getOption('key');
								if(!$this.newShareMap[id]){
									return;
								}
								$this.newShareMap[id].access = {'not':0, 'readOnly':1, 'readWrite':2}[val];
								$this.invalidate();
							}
						});
						tr.append($this.$('<td></td>').append(accessCombo.getElement()));
					}
				}
				
				// fill local workspaces
				var localList = [];
				for(var i in shareMap){
					if(shareMap[i].local && shareMap[i].wId != explorer.getCurrentWorkspace().getId()){
						localList.push(shareMap[i]);
					}
				}
				if(localList.length > 0){
					localList.sort(function(a, b){
						return a.wName.localeCompare(b.wName);
					});
					
					fillList($this.localTableBody, localList, function(item){
						return item.wName;
					});
					$this.find('.target.local').removeClass('hidden');
				} else {
					$this.find('.target.local').addClass('hidden');
				}
				
				// fill users
				var usersList = [];
				for(var i in shareMap){
					if(!shareMap[i].local && explorer.getCurrentWorkspace().getOwner() != shareMap[i].user){
						usersList.push(shareMap[i]);
					}
				}
				if(usersList.length > 0){
					usersList.sort(function(a, b){
						return a.user.localeCompare(b.user);
					});
					
					fillList($this.usersTableBody, usersList, function(item){
						return item.user;
					});
					$this.find('.target.users').removeClass('hidden');
				} else {
					$this.find('.target.users').addClass('hidden');
				}
				
				if(localList.length > 0 || usersList.length > 0){
					$this.find('.emptyMessage').addClass('hidden');
				} else {
					$this.find('.emptyMessage').removeClass('hidden');
				}
			});
			
		},
		
		invalidate: function(){
			// compare share maps
			var bChanged = false;
			for(var id in $this.newShareMap){
				if($this.newShareMap[id].access != $this.shareMap[id].access){
					bChanged = true;
					break;
				}
			}
			
			$this.find('.btnBar .btnOk').jsb().enable(bChanged);
			return bChanged;
		},
		
		apply: function(){
			if(!$this.invalidate()){
				return;
			}
			
			var entry = this.data.data.entry;
			$this.getElement().loader();
			entry.server().changeShares($this.newShareMap, function(){
				$this.getElement().loader('hide');
				$this.close();
			});
		},
		
		setFocus: function(){
		}
	}
}


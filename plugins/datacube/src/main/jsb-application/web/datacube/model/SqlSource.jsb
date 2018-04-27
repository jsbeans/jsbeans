{
	$name: 'DataCube.Model.SqlSource',
	$parent: 'DataCube.Model.DatabaseSource',
	$require: ['DataCube.Model.SqlTable'],
	
	details: null,
	
	getDetails: function(){
		return this.details;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.Store.StoreManager',
		           'JSB.Crypt.MD5'],
		
		settings: null,
		
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority:0.5, 
				nodeType:'DataCube.SqlSourceNode',
				create: true,
				move: true,
				remove: true,
				title: 'База данных',
				prefix: 'База',
				description: 'Создает подключение к внешней базе данных для использования в аналитике и визуализации',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB3aWR0aD0iMTg2LjY5MzI1IiBoZWlnaHQ9IjIwNi4wNzQyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxmaWx0ZXIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBoZWlnaHQ9IjEuMzg1NTQyIiB5PSItMC4xOTI3NzEiIHdpZHRoPSIxLjEyODUxNCIgeD0iLTAuMDY0MjU3IiBpZD0iZmlsdGVyNjA5MyI+DQogICA8ZmVHYXVzc2lhbkJsdXIgaWQ9ImZlR2F1c3NpYW5CbHVyNjA5NSIgc3RkRGV2aWF0aW9uPSIwLjg5MjUwNCIvPg0KICA8L2ZpbHRlcj4NCiAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDYwMzUiPg0KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2ZmZmZmZiIgaWQ9InN0b3A2MDM3IiBvZmZzZXQ9IjAiLz4NCiAgIDxzdG9wIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMCIgaWQ9InN0b3A2MDM5IiBvZmZzZXQ9IjEiLz4NCiAgPC9saW5lYXJHcmFkaWVudD4NCiAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDU0OTUiPg0KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2M2YzZjNiIgb2Zmc2V0PSIwIiBpZD0ic3RvcDU0OTciLz4NCiAgIDxzdG9wIHN0b3AtY29sb3I9IiNlM2UzZTMiIGlkPSJzdG9wNTUwMSIgb2Zmc2V0PSIwLjIwNDg0NiIvPg0KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2E1YTVhOCIgb2Zmc2V0PSIxIiBpZD0ic3RvcDU0OTkiLz4NCiAgPC9saW5lYXJHcmFkaWVudD4NCiAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDU0NjYiPg0KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2UzZTNlMyIgaWQ9InN0b3A1NDY4IiBvZmZzZXQ9IjAiLz4NCiAgIDxzdG9wIHN0b3AtY29sb3I9IiNhNWE1YTgiIGlkPSJzdG9wNTQ3MCIgb2Zmc2V0PSIxIi8+DQogIDwvbGluZWFyR3JhZGllbnQ+DQogIDxsaW5lYXJHcmFkaWVudCB5Mj0iMC40ODU3ODYiIHgyPSIwLjUwMDAwMSIgeTE9IjAuNDg1Nzg2IiB4MT0iMCIgc3ByZWFkTWV0aG9kPSJyZWZsZWN0IiBpZD0ibGluZWFyR3JhZGllbnQ2MTEwIiB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ1NDk1Ii8+DQogIDxsaW5lYXJHcmFkaWVudCB5Mj0iMC45OTk5NTEiIHgyPSIwLjQ5OTk5OCIgeTE9IjAuMjEwMDU2IiB4MT0iMC4zNzE3ODEiIGlkPSJsaW5lYXJHcmFkaWVudDYxMTIiIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDU0NjYiLz4NCiAgPGxpbmVhckdyYWRpZW50IHkyPSIwLjQ5OTk5OSIgeDI9IjEiIHkxPSIwLjg1MzA5MSIgeDE9IjAuNTEwNzA2IiBzcHJlYWRNZXRob2Q9InJlZmxlY3QiIGlkPSJsaW5lYXJHcmFkaWVudDYxMTQiIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDYwMzUiLz4NCiAgPGxpbmVhckdyYWRpZW50IHkyPSIwLjQ5OTk5OSIgeDI9IjEiIHkxPSIwLjg1MzA5MSIgeDE9IjAuNTEwNzA2IiBzcHJlYWRNZXRob2Q9InJlZmxlY3QiIGlkPSJsaW5lYXJHcmFkaWVudDYxMTYiIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDYwMzUiLz4NCiAgPGxpbmVhckdyYWRpZW50IHkyPSIwLjQ5OTk5OSIgeDI9IjEiIHkxPSIwLjg1MzA5MSIgeDE9IjAuNTEwNzA2IiBzcHJlYWRNZXRob2Q9InJlZmxlY3QiIGlkPSJsaW5lYXJHcmFkaWVudDYxMTgiIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDYwMzUiLz4NCiA8L2RlZnM+DQogPG1ldGFkYXRhIGlkPSJtZXRhZGF0YTQiPmltYWdlL3N2Zyt4bWw8L21ldGFkYXRhPg0KIDxnPg0KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+DQogIDxwYXRoIGZpbGw9IiMyZTM0MzYiIGZpbHRlcj0idXJsKCNmaWx0ZXI2MDkzKSIgZD0ibTE3Ni4wNjMwMDQsMTY3Ljg3MTkzM2MwLDE1LjIyNzczNyAtMzcuMDMzNDMyLDI3LjU3MjA4MyAtODIuNzE2Mzg1LDI3LjU3MjA4M2MtNDUuNjgzMDcxLDAgLTgyLjcxNjUsLTEyLjM0NDM0NSAtODIuNzE2NSwtMjcuNTcyMDgzYzAsLTE1LjIyNzczNyAzNy4wMzM0MjksLTI3LjU3MjIyIDgyLjcxNjUsLTI3LjU3MjIyYzQ1LjY4Mjk1MywwIDgyLjcxNjM4NSwxMi4zNDQ0ODIgODIuNzE2Mzg1LDI3LjU3MjIyeiIgaWQ9InBhdGg2MDc5Ii8+DQogIDxwYXRoIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQ2MTEwKSIgZD0ibTEwLjY2MjQ3NiwyOC42MDQzbDAsMTI2LjM2MzAxNmwwLjUyNDkwNCwwYy0wLjMzODQ0NSwxLjAxMzE1MyAtMC41MjQ5MDQsMS45NzUwNTIgLTAuNTI0OTA0LDMuMDE4MTg4YzAsMTUuMjI3NjE1IDM2Ljk4OTQ3NSwyNy41NTc0OCA4Mi42NzI0MTcsMjcuNTU3NDhjNDUuNjgyOTQ1LDAgODIuNjcyNDkzLC0xMi4zMjk4NjUgODIuNjcyNDkzLC0yNy41NTc0OGMwLC0xLjA0NDY3OCAtMC4xODU1NjIsLTIuMDAzNzU0IC0wLjUyNDkxOCwtMy4wMTgxODhsMC41MjQ5MTgsMGwwLC0xMjYuMzYzMDE2bC0xNjUuMzQ0OTEsMHoiIGlkPSJwYXRoNTQ4OCIvPg0KICA8cGF0aCBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50NjExMikiIGlkPSJwYXRoNTQ2MCIgZD0ibTE3Ni4wNjMwMDQsMjcuNTcyMTc2YzAsMTUuMjI3NzMyIC0zNy4wMzM0MzIsMjcuNTcyMDgxIC04Mi43MTYzODUsMjcuNTcyMDgxYy00NS42ODMwNzEsMCAtODIuNzE2NSwtMTIuMzQ0MzQ5IC04Mi43MTY1LC0yNy41NzIwODFjMCwtMTUuMjI3NzM1IDM3LjAzMzQyOSwtMjcuNTcyMjExIDgyLjcxNjUsLTI3LjU3MjIxMWM0NS42ODI5NTMsMCA4Mi43MTYzODUsMTIuMzQ0NDc2IDgyLjcxNjM4NSwyNy41NzIyMTF6Ii8+DQogIDxwYXRoIGZpbGw9IiM1NjU2NTYiIGQ9Im0xMC41MzEyNSwxMTkuMjgxNTA5YzAuNjE4NzExLDE1LjA0OTk4OCAzNy41MDY4MTcsMjcuMTYzNzg4IDgyLjgwMzY0MiwyNy4xNjM3ODhjNDUuMTY4MTc1LDAgODEuODUwNTMzLC0xMi4wNDIwMzggODIuNjcyNDkzLC0yNy4wMzI1NjJjLTE0LjQ5MzgyLDEyLjMyODU4MyAtNDYuMDIwMzA5LDIwLjg2NDk0NCAtODIuNjcyNDkzLDIwLjg2NDk0NGMtMzYuNzI3MDIsMCAtNjguMzUwMzIzLC04LjYyNzA5IC04Mi44MDM2NDIsLTIwLjk5NjE3eiIgaWQ9InBhdGg2MDI2Ii8+DQogIDxwYXRoIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQ2MTE0KSIgZD0ibTEwLjUzMTI1LDI3Ljk0OTE5NGMwLjYxNzMwMSwxNS4wNDk5OSAzNy41MDc1ODcsMjcuMTYwNzE5IDgyLjgwNDY3MiwyNy4xNjA3MTljNDUuMTY3MDA3LDAgODEuODUxNTQ3LC0xMi4wMzkyMjMgODIuNjcwNDI1LC0yNy4wMzA1MThjLTAuOTAyOTM5LDAuNzY4MzkxIC0xLjg1MjAyLDEuNDkwNjQ2IC0yLjg4NDkxOCwyLjIyOTgxOGMtMC4wMzc5MzMsMC4wNTA0OTEgLTAuMDkyNTI5LDAuMDg0MDY2IC0wLjEzMDIwMywwLjEzMDE5OWMtOS42Mjg5NjcsMTEuNjY1NTM3IC00MS41ODkyMzMsMjAuMjEwODYzIC03OS42NTUzMDQsMjAuMjEwODYzYy0zOC4zMDU0NTQsMCAtNzAuNDg4MjYsLTguNjk2NTQ1IC03OS45MTU2NDgsLTIwLjQ3MTI2NGMtMC4xMDQ5NTYsLTAuMDc1NjA5IC0wLjE1OTU0OCwtMC4xODg4OTQgLTAuMjY0NTAzLC0wLjI2NDUwM2MtMC45MTk2MDgsLTAuNjY3NjY0IC0xLjgxNDA5OCwtMS4yNzI1MzMgLTIuNjI0NTIxLC0xLjk2NTMxNWwwLDB6IiBpZD0icGF0aDYwMzAiLz4NCiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoNC4xOTkyMywgMCwgMCwgNC4xOTkyMywgLTkxNC41NTYsIC0xNjMzLjgxKSIgaWQ9Imc2MDcxIj4NCiAgIDxnIGlkPSJnNjA2NyI+DQogICAgPHBhdGggZmlsbD0iIzU2NTY1NiIgaWQ9InBhdGg2MDIyIiBkPSJtMjIwLjI5ODk5Niw0MDYuOTU1OTYzYzAuMTQ3MzM5LDMuNTgzOTg0IDguOTMxODI0LDYuNDY4NzUgMTkuNzE4NzUsNi40Njg3NWMxMC43NTYyODcsMCAxOS40OTE3NzYsLTIuODY3Njc2IDE5LjY4NzUxNSwtNi40Mzc1Yy0zLjQ1MTUzOCwyLjkzNTkxMyAtMTAuOTU5MjEzLDQuOTY4NzUgLTE5LjY4NzUxNSw0Ljk2ODc1Yy04Ljc0NjEyNCwwIC0xNi4yNzY4NTUsLTIuMDU0NDQzIC0xOS43MTg3NSwtNXoiLz4NCiAgICA8cGF0aCBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50NjExNikiIGQ9Im0yMjAuMjk4OTk2LDQwNi45NTYyMDdjMC4xNDcwMDMsMy41ODM5ODQgOC45MzIwMDcsNi40NjgwMTggMTkuNzE4OTk0LDYuNDY4MDE4YzEwLjc1NjAxMiwwIDE5LjQ5MjAyLC0yLjg2NzAwNCAxOS42ODcwMjcsLTYuNDM3MDEyYy0wLjA0OTAxMSwwLjA0MTk5MiAtMC4xMDUwNDIsMC4wODM5ODQgLTAuMTU2MDA2LDAuMTI1Yy0xLjI0MjAwNCwzLjIyNjk5IC05LjUxMTAwMiw1LjcxODk5NCAtMTkuNTMxMDIxLDUuNzE4OTk0Yy0xMC4xMTMwMDcsMCAtMTguNDY3OTg3LC0yLjUxMDk4NiAtMTkuNTkzOTk0LC01Ljc4MTAwNmMtMC4wNDAwMDksLTAuMDMxOTgyIC0wLjA4NTk5OSwtMC4wNjA5NzQgLTAuMTI1LC0wLjA5Mzk5NGwwLDB6IiBpZD0icGF0aDYwNDMiLz4NCiAgIDwvZz4NCiAgIDxwYXRoIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQ2MTE4KSIgZD0ibTIyMC4yOTg5OTYsNDE3LjQ3OTM3YzAuMTQ3MDAzLDMuNTgzOTg0IDguOTMyMDA3LDYuNDY4MDE4IDE5LjcxODk5NCw2LjQ2ODAxOGMxMC43NTYwMTIsMCAxOS40OTIwMiwtMi44NjcwMDQgMTkuNjg3MDI3LC02LjQzNzAxMmMtMC4wNDkwMTEsMC4wNDE5OTIgLTAuMTA1MDQyLDAuMDgzOTg0IC0wLjE1NjAwNiwwLjEyNWMtMS4yNDIwMDQsMy4yMjY5OSAtOS41MTEwMDIsNS43MTg5OTQgLTE5LjUzMTAyMSw1LjcxODk5NGMtMTAuMTEzMDA3LDAgLTE4LjQ2Nzk4NywtMi41MTA5ODYgLTE5LjU5Mzk5NCwtNS43ODEwMDZjLTAuMDQwMDA5LC0wLjAzMTk4MiAtMC4wODU5OTksLTAuMDYwOTc0IC0wLjEyNSwtMC4wOTM5OTRsMCwweiIgaWQ9InBhdGg2MDU0Ii8+DQogIDwvZz4NCiAgPHBhdGggZmlsbD0iIzU2NTY1NiIgZD0ibTExLjA1NjE1NCwxNjQuODE2OTU2YzQuNzI4MzY3LDEzLjczMTU2NyAzOS44MTI4ODMsMjQuMjc2ODI1IDgyLjI3ODczOCwyNC4yNzY4MjVjNDIuMDc4ODUsMCA3Ni44MDAxMTcsLTEwLjQ2NDUyMyA4Mi4wMTYzNSwtMjQuMDE0Mzc0Yy0xNC43NjYwMDYsMTIuMDQyNTU3IC00NS44OTE2MzIsMjAuMzQwMDQyIC04Mi4wMTYzNSwyMC4zNDAwNDJjLTM2LjMxNDI0NywwIC02Ny42MDc4MTksLTguNDU2MTQ2IC04Mi4yNzg3MzgsLTIwLjYwMjQ5M3oiIGlkPSJwYXRoNjA2MCIvPg0KIDwvZz4NCjwvc3ZnPg==',
				order: 10
			});
		},

		$constructor: function(id, workspace){
			$base(id, workspace);
			this.settings = this.property('settings');
			this.details = this.property('details');
		},
		
		getSettings: function(){
			return this.settings;
		},
		
		updateSettings: function(settings){
			this.settings = JSB.merge({
				name: $this.getId(),
				type: 'JSB.Store.Sql.SQLStore',
				url: '',
				properties: {}
			}, settings);
			this.property('settings', this.settings);
			this.getWorkspace().store();
			this.publish('DataCube.Model.SqlSource.updateSettings');
		},
		
		testConnection: function(settings){
			this.updateSettings(settings);
			
			// test connection
			var store = StoreManager.getStore(this.settings);
			store.getConnection(true).close();
			return true;
		},
		
		getStore: function(){
			return StoreManager.getStore(this.settings);
		},
		
		loadAffectedCubes: function(){
			// temp: load all cubes
			var it = this.getWorkspace().search(function(eDesc){
				return eDesc.eType == 'DataCube.Model.Cube';
			});
			
			while(it.hasNext()){
				var e = it.next();
				e.load();
			}
			
			// TODO: load only affected cubes
			
		},
		
		fuxupAffectedCubes: function(){
			var it = this.getWorkspace().search(function(eDesc){
				return eDesc.eType == 'DataCube.Model.Cube';
			});
			
			while(it.hasNext()){
				var e = it.next();
				e.load();
				e.fixupProviders();
			}
		},
		
		clearCache: function(){
			this.loadAffectedCubes();
			$this.publish('DataCube.Model.SqlSource.clearCache');
		},
		
		updateCache: function(){
			this.loadAffectedCubes();
			$this.publish('DataCube.Model.SqlSource.updateCache');
		},
		
		extractScheme: function(){
			var mtx = 'DataCube.Model.SqlSource.extractScheme.' + this.getId();
			JSB.getLocker().lock(mtx);
			try {
				$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Соединение с базой данных', success: true}, {session: true});
				var store = this.getStore();
				var lastPP = -1;
				$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Получение списка таблиц', success: true}, {session: true});
				var schema = store.extractSchema(function(idx, total){
					var pp = Math.round(idx * 100 / total);
	            	if(pp > lastPP){
	            		$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Обновление схемы ' + pp + '%', success: true}, {session: true});
	            		lastPP = pp;
	            	}
				}, this.settings.filter);
				$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Сохранение схемы', success: true}, {session: true});
	
				// update entries
				var existedTables = JSB.clone(this.getChildren());
				for(var sName in schema){
					var sDesc = schema[sName];
					for(var tName in sDesc.tables){
						var tDesc = sDesc.tables[tName];
						var tId = MD5.md5(this.getId() + '|' + sName + '|' + tName);
						if(existedTables[tId]){
							// already exists
							existedTables[tId].updateDescriptor(tDesc);
							if(existedTables[tId].isMissing()){
								existedTables[tId].setMissing(false);
								existedTables[tId].doSync();
							}
							delete existedTables[tId];
							continue;
						}
						var tEntry = new SqlTable(tId, this.getWorkspace(), tDesc);
						this.addChildEntry(tEntry);
					}
				}
				
				// remove unexisted
				for(var tId in existedTables){
					if(!existedTables[tId].isMissing()){
						existedTables[tId].setMissing(true);
						existedTables[tId].doSync();
					}
/*					var cEntry = this.removeChildEntry(tId);
					if(cEntry){
						cEntry.remove();
					}*/
				}
				
				// construct details
				var details = {
					updated: Date.now(),
					schemes: 0,
					tables: 0,
					columns: 0
				};
				for(var sName in schema){
					details.schemes++;
					var sDesc = schema[sName];
					for(var tName in sDesc.tables){
						details.tables++;
						var tDesc = sDesc.tables[tName];
						for(var cName in tDesc.columns){
							details.columns++;
						}
					}
				}
				this.details = details;
				this.property('details', this.details);
				$this.publish('DataCube.Model.SqlSource.schemeUpdated');
			} finally {
				JSB.getLocker().unlock(mtx);
			}
			this.getWorkspace().store();
			
			return details;
		}
	}
}
{
	$name: 'DataCube.HttpMethodView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$expose: {
		priority: 1,
		acceptNode: ['DataCube.HttpMethodNode'],
		acceptEntry: ['DataCube.Model.HttpMethod'],
		caption: 'Настройка',
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjIwIgogICBoZWlnaHQ9IjIwIgogICB2aWV3Qm94PSIwIDAgMjAgMjAiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzIiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJodHRwLW1ldGhvZC5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTE1Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT5jb2RlPC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiCiAgICAgaWQ9Im5hbWVkdmlldzEzIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBzaG93Z3VpZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiCiAgICAgaW5rc2NhcGU6em9vbT0iNDEuNzE5MyIKICAgICBpbmtzY2FwZTpjeD0iMTIuNjE4MTI5IgogICAgIGlua3NjYXBlOmN5PSIxMC4xMzk1MTQiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMiI+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSI1MTQuMTY5NDksMzI5Ljc2MjcxIgogICAgICAgb3JpZW50YXRpb249IjEsMCIKICAgICAgIGlkPSJndWlkZTQxNDkiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSI2MzUuNjYxMDIsNTEyIgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQxNTEiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIxMS44NDEwNDIsOS45NzE0MDQxIgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQxNTkiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSI5Ljk3MTQwNDEsOC45NjQ2NzU4IgogICAgICAgb3JpZW50YXRpb249IjEsMCIKICAgICAgIGlkPSJndWlkZTQxNjEiIC8+CiAgPC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0Ni4xICg0NDQ2MykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlNCI+Y29kZTwvdGl0bGU+CiAgPGRlc2MKICAgICBpZD0iZGVzYzYiPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM4IiAvPgogIDxnCiAgICAgc3R5bGU9Im9wYWNpdHk6MC43Nzk3MzQxMTtmaWxsOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEiCiAgICAgaWQ9IuWwj+ermSIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAxOTU0ODM5LDAsMCwwLjAxOTU0ODM5LC0wLjAyOTU2MjYsMC4wNTMzMzU1MSkiPgogICAgPGcKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAwMDAiCiAgICAgICBpZD0iY29kZSI+CiAgICAgIDxwYXRoCiAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICAgIGQ9Im0gMTAxOC42NDQ5LDUzMS4yOTc2NCBjIDguNjM0NiwtMTguNjEwMjQgNC42MDEzLC00MS40MTg4NSAtMTEuNDQxNiwtNTUuODYzOTUgbCAtMjA1LjEwOCwtMTg0LjY4MDA0IDAsMCBjIC0xOS43MDA1MiwtMTcuNzM4NDMgLTUwLjA1MDc5LC0xNi4xNDc4NCAtNjcuNzg5MjIsMy41NTI2OCBsIDAsMCAwLDAgYyAtMTcuNzM4NDMsMTkuNzAwNTIgLTE2LjE0Nzg0LDUwLjA1MDc5IDMuNTUyNjksNjcuNzg5MjIgTCA5MDQuMTM4NDIsNTExLjgxNDQyIDczNi44NTg3Nyw2NjIuNDMzNjkgYyAtMTkuNzAwNTMsMTcuNzM4NDQgLTIxLjI5MTEyLDQ4LjA4ODcgLTMuNTUyNjksNjcuNzg5MjIgMTcuNzM4NDMsMTkuNzAwNTMgNDguMDg4NywyMS4yOTExMiA2Ny43ODkyMiwzLjU1MjY5IGwgMjA1LjEwOCwtMTg0LjY4MDA1IGMgNS42NDIyLC01LjA4MDMgOS43OTksLTExLjE5NTA5IDEyLjQ0MTYsLTE3Ljc5NzkxIHogTSAxMTkuOTQ3LDUxMS4zOTAyMyAyODYuMjI2NjUsMzYxLjY3MTM2IGMgMTkuNzAwNTIsLTE3LjczODQzIDIxLjI5MTExLC00OC4wODg3IDMuNTUyNjgsLTY3Ljc4OTIyIGwgMCwwIDAsMCBjIC0xNy43Mzg0MywtMTkuNzAwNTIgLTQ4LjA4ODcsLTIxLjI5MTExIC02Ny43ODkyMiwtMy41NTI2OCBsIDAsMCBMIDE2Ljg4MjE0LDQ3NS4wMDk1IGMgLTE2LjA0MjkwMzgsMTQuNDQ1MSAtMjAuMDc2MjQyLDM3LjI1MzcxIC0xMS40NDE2NzM2LDU1Ljg2Mzk1IDIuNjQyNjU5NCw2LjYwMjgyIDYuNzk5NDI5NiwxMi43MTc2MSAxMi40NDE2NzM2LDE3Ljc5NzkxIGwgMjA1LjEwNzk3LDE4NC42ODAwNSBjIDE5LjcwMDUyLDE3LjczODQzIDUwLjA1MDc5LDE2LjE0Nzg0IDY3Ljc4OTIyLC0zLjU1MjY4IDE3LjczODQzLC0xOS43MDA1MyAxNi4xNDc4NCwtNTAuMDUwOCAtMy41NTI2OCwtNjcuNzg5MjMgTCAxMTkuOTQ3LDUxMS4zOTAyMyBaIgogICAgICAgICBpZD0iQ29tYmluZWQtU2hhcGUiIC8+CiAgICA8L2c+CiAgPC9nPgogIDxwYXRoCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBkPSJtIDEzLjc3NjA0LDkuMTI4MDkyMyAtMC4zNDI2NjUsMCBjIC0wLjI3OTU0NCwwIC0wLjUxMzk5OSwtMC4yNDEyMTg4IC0wLjUxMzk5OSwtMC41Mjc1MjU0IDAsLTAuMTQ0MjgwNSAwLjA2MDg3LC0wLjI3NTAzNDggMC4xNjkwNzksLTAuMzcxOTczMSBMIDEzLjMwOTM4NCw4LjAxMjE3MyBjIDAuMjE4Njc1LC0wLjIxNjQyMDcgMC4yMTg2NzUsLTAuNTcwMzU4NyAwLC0wLjc4Njc3OTUgTCAxMi44MDY2NTcsNi43MjcxNzUgQyAxMi43MDc0NjcsNi42Mjc5ODIgMTIuNTYwOTI4LDYuNTY5MzY4MiAxMi40MTIxNCw2LjU2OTM2ODIgYyAtMC4xNDg3OSwwIC0wLjI5MzA3LDAuMDU4NjE0IC0wLjM5NDUxOCwwLjE1NzgwNjggTCAxMS44MDU3MSw2LjkzOTA4NyBjIC0wLjEwMTQ0OSwwLjExMjcxOTIgLTAuMjM2NzEsMC4xNzM1ODc0IC0wLjM4MzI0NSwwLjE3MzU4NzQgLTAuMjg4NTYxLDAgLTAuNTI5NzgsLTAuMjM0NDU1OCAtMC41Mjk3OCwtMC41MTE3NDQ5IGwgMCwtMC4zNDQ5MjA1IGMgMCwtMC4zMDQzNDE2IC0wLjI0NTcyNywtMC41NjU4NDk5IC0wLjU1MjMyMywtMC41NjU4NDk5IGwgLTAuNjg1MzI3NSwwIGMgLTAuMzA2NTkyOCwwIC0wLjU1MDA2NjEsMC4yNTkyNTM5IC0wLjU1MDA2NjEsMC41NjU4NDk5IGwgMCwwLjM0MjY2NjIgYyAwLDAuMjc3Mjg5MSAtMC4yNDEyMTg5LDAuNTExNzQ0OCAtMC41Mjk3Nzk5LDAuNTExNzQ0OCAtMC4xNDQyODA1LDAgLTAuMjc3Mjg5MSwtMC4wNjA4NjkgLTAuMzc0MjI3NSwtMC4xNjY4MjQzIEwgNy45ODIyODYsNi43MjcxNzUgQyA3Ljg4MzA5MzEsNi42MjU3Mjc3IDcuNzM2NTU4Miw2LjU2OTM2ODIgNy41ODc3Njg5LDYuNTY5MzY4MiBjIC0wLjE0ODc4OTEsMCAtMC4yOTMwNjk2LDAuMDU4NjE0IC0wLjM5NDUxNjksMC4xNTc4MDY4IEwgNi42ODYwMTU5LDcuMjIzMTM5MiBjIC0wLjIxNjQyMDcsMC4yMTY0MjA2IC0wLjIxNjQyMDcsMC41NzAzNTg3IDAsMC43ODQ1MjUgbCAwLjIxMTkxMiwwLjIxMTkxMiBjIDAuMTEyNzE5MiwwLjEwMTQ0NzMgMC4xNzU4NDE4LDAuMjM2NzEwMiAwLjE3NTg0MTgsMC4zODA5OTA3IDAsMC4yODg1NjA5IC0wLjIzNDQ1NTcsMC41Mjc1MjU0IC0wLjUxMzk5OTEsMC41Mjc1MjU0IGwgLTAuMzQyNjY2MiwwIEMgNS45MDgyNTQsOS4xMjgwOTIzIDUuNjQ5LDkuMzY5MzExMyA1LjY0OSw5LjY3NTkwNzMgbCAwLDAuMzQyNjY2NyAwLDAuMzQyNjcgYyAwLDAuMzA0MzQ1IDAuMjU5MjU0LDAuNTQ3ODE4IDAuNTY4MTA0NCwwLjU0NzgxOCBsIDAuMzQyNjY2MiwwIGMgMC4yNzk1NDM0LDAgMC41MTM5OTkxLDAuMjQxMjE5IDAuNTEzOTk5MSwwLjUyNzUyNSAwLDAuMTQ0MjgxIC0wLjA2MzEyMiwwLjI3OTU0NCAtMC4xNzU4NDE4LDAuMzgwOTkxIGwgLTAuMjExOTEyLDAuMjA5NjU3IGMgLTAuMjE2NDIwNywwLjIxNjQyMSAtMC4yMTY0MjA3LDAuNTcwMzYgMCwwLjc4NDUyNSBsIDAuNTAyNzI3MywwLjUwMDQ3NCBjIDAuMDk5MTkzLDAuMTAxNDUgMC4yNDU3Mjc4LDAuMTU3ODA2IDAuMzk0NTE3MSwwLjE1NzgwNiAwLjE0ODc4OTEsMCAwLjI5MzA2OTYsLTAuMDU4NjIgMC4zOTQ1MTY5LC0wLjE1NzgwNiBsIDAuMjE4Njc1MSwtMC4yMTY0MjEgYyAwLjA5NDY4NCwtMC4xMDU5NTkgMC4yMjk5NDY5LC0wLjE2NjgyNCAwLjM3NDIyNzQsLTAuMTY2ODI0IDAuMjg4NTYxLDAgMC41Mjk3Nzk5LDAuMjM0NDU1IDAuNTI5Nzc5OSwwLjUxMTc0NCBsIDAsMC4zNDI2NjcgYyAwLDAuMzA0MzQxIDAuMjQzNDczMywwLjU2NTg0OSAwLjU1MjMyMDksMC41NjU4NDkgbCAwLjY4NTMyNjUsMCBjIDAuMzA2NTk2LDAgMC41NTAwNywtMC4yNTkyNTMgMC41NTAwNywtMC41NjU4NDkgbCAwLC0wLjM0MjY2NyBjIDAsLTAuMjc3Mjg5IDAuMjQxMjE4LC0wLjUxMTc0NCAwLjUyOTc4LC0wLjUxMTc0NCAwLjE0NDI4MSwwIDAuMjc5NTQzLDAuMDYzMTMgMC4zODMyNDQsMC4xNzM1ODYgbCAwLjIxMTkxMiwwLjIxMTkxMyBjIDAuMTAxNDUsMC4wOTkxOSAwLjI0NTcyOSwwLjE1NzgwNyAwLjM5NDUxNywwLjE1NzgwNyAwLjE0ODc5LDAgMC4yOTMwNywtMC4wNTg2MiAwLjM5NDUxOCwtMC4xNTc4MDcgbCAwLjUwMjcyNywtMC41MDA0NzMgYyAwLjIxNjQyMSwtMC4yMTY0MiAwLjIxNjQyMSwtMC41NzAzNTkgMCwtMC43ODY3OCBsIC0wLjIyMDkyOSwtMC4yMTY0MiBjIC0wLjEwODIwOCwtMC4wOTY5NCAtMC4xNjkwNzksLTAuMjI5OTQ3IC0wLjE2OTA3OSwtMC4zNzE5NzQgMCwtMC4yODg1NiAwLjIzNDQ1NSwtMC41Mjc1MjUgMC41MTM5OTksLTAuNTI3NTI1IGwgMC4zNDI2NjYsMCBjIDAuMzA2NTk2LDAgMC41MjUyNzEsLTAuMjQxMjE5IDAuNTI1MjcxLC0wLjU0NzgxOCBsIDAsLTAuMzQ0OTI0IDAsLTAuMzQyNjY2NyBjIDAuMDA0NSwtMC4zMDY1OTYgLTAuMjE0MTY2LC0wLjU0NzgxNSAtMC41MjA3NjMsLTAuNTQ3ODE1IHogbSAtMS45NzcwOTIsMC44OTA0ODE3IDAsMCBjIDAsMC45OTQxOSAtMC44MDQ4MTUsMS44MDM1MTMgLTEuODAzNTA1NywxLjgwMzUxMyAtMC45OTg2ODQzLDAgLTEuODAzNDk4OCwtMC44MDkzMjMgLTEuODAzNDk4OCwtMS44MDM1MTMgbCAwLDAgMCwwIGMgMCwtMC45OTQxODMzIDAuODA0ODE0NSwtMS44MDM1MDY2IDEuODAzNDk4OCwtMS44MDM1MDY2IDAuOTk4NjkwNywwIDEuODAzNTA1NywwLjgwOTMyMzMgMS44MDM1MDU3LDEuODAzNTA2NiBsIDAsMCB6IgogICAgIGlkPSJwYXRoMyIKICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPgo8L3N2Zz4K'
	},
	
	$client: {
	    $require: ['Unimap.Controller',
                   'JSB.Controls.ScrollBox',
                   'JSB.Widgets.SplitBox',
                   'DataCube.Widgets.WidgetWrapper',
                   'JSB.Widgets.PrimitiveEditor',
                   'JSB.Widgets.Button',
                   'JSB.Controls.Grid',
                   'JSB.Widgets.TabView',
                   'DataCube.ParserManager',
                   'css:HttpMethodView.css'
        ],
        
        resultPreview: null,

		$constructor: function(opts){
			$base(opts);
			
			this.addClass('httpMethodView');

            this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);
            
            this.serviceUrlBlock = this.$('<span class="namePrefix">Название метода: </span>');
            this.titleBlock.append(this.serviceUrlBlock);

            this.titleEditor = new PrimitiveEditor();
            this.titleBlock.append(this.titleEditor.getElement());

            if(!$this.options.dontSave){
	            var saveBtn = new Button({
	                cssClass: "btnOk",
	                caption: "Сохранить",
	                onClick: function(){
	                    $this.applySettings();
	                }
	            });
	            this.titleBlock.append(saveBtn.getElement());
            }

            var updateBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Обновить",
                onClick: function(){
                    $this.updatePreview();
                }
            });
            this.titleBlock.append(updateBtn.getElement());
            
            this.stageCtrl = new TabView({
            	allowCloseTab: false,
				allowNewTab: false,
				onSwitchTab: function(tabId){
					$this.stage = tabId;
					$this.attr('stage', $this.stage);
				}
            });
            this.stageCtrl.addClass('stage');
            
            this.titleBlock.append(this.stageCtrl.getElement());
            
            // add stages
            this.stageCtrl.addTab('<span>1</span>Параметры запроса', $this.$('<div class="stagePage"></div>'), {id: 'request'});
            this.stageCtrl.addTab('<span>2</span>Анализ ответа', $this.$('<div class="stagePage"></div>'), {id: 'analysis'});
            this.stageCtrl.addTab('<span>3</span>Настройка результата', $this.$('<div class="stagePage"></div>'), {id: 'tables'});
            
            var splitBox = new SplitBox({
				type: 'vertical',
				position: 0.35
			});
			this.append(splitBox);

	        this.schemeScroll = new ScrollBox();
	        this.schemeScroll.addClass('schemeScroll');
	        splitBox.append(this.schemeScroll.getElement());
	        
	        this.schemeContainer = this.$('<div class="schemeContainer"></div>');
			this.schemeScroll.append(this.schemeContainer);

	        this.warningBlock = this.$('<div class="warningBlock hidden"></div>');
	        this.schemeContainer.append(this.warningBlock);
	        
	     // buttons
			this.buttonBar = this.$('<div class="buttonBar"></div>');
			this.schemeScroll.append(this.buttonBar);
			
			this.requestBtn = new Button({
                cssClass: "btnRequest",
                caption: "Отправить запрос",
                onClick: function(){
                	$this.executeRequestStage();
                }
            });
            this.buttonBar.append(this.requestBtn.getElement());

			var analyzeBtn = new Button({
                cssClass: "btnAnalyze",
                caption: "Анализировать",
                onClick: function(){
                	$this.executeAnalyzeStage();
                }
            });
            this.buttonBar.append(analyzeBtn.getElement());

			var previewBtn = new Button({
                cssClass: "btnPreview",
                caption: "Посмотреть результат",
                onClick: function(){
                	$this.executePreviewStage();
                }
            });
            this.buttonBar.append(previewBtn.getElement());

            this.tableTabView = new TabView({
				tabPosition: 'bottom',
				allowCloseTab: false,
				allowNewTab: false
			});
            splitBox.append(this.tableTabView);
			this.tableTabView.addClass('tablesView');
			
			this.responseTable = new Grid({
	        	headerRenderer: function(th, header){
                	th.append($this.$('<div class="name" title="'+header+'">' + header + '</div>'));
                	return th;
                }
	        });
			
			this.resultTable = new Grid({
				headerRenderer: function(th, header){
                	var type = $this.resultPreview.cols[header].type;
                	th.append($this.$('<div class="name" type="'+type+'" title="'+header+'">' + header + '</div><div class="type">'+type+'</div>'));
                	return th;
                }
	        });
			
			$this.responseTab = $this.tableTabView.addTab('Ответ сервиса', this.responseTable, {id:'__response'});
			$this.resultTab = $this.tableTabView.addTab('Выходная таблица', this.resultTable, {id:'__result'});
			
			this.subscribe('DataCube.Model.HttpMethod.statusChanged', function(sender, msg, status){
				if(sender != $this.getCurrentEntry()){
					return;
				}
				$this.updateStatus();
			});
			
			this.subscribe('DataCube.Model.SettingsEntry.settingsUpdated', function(sender, msg, settings){
	        	if(sender != $this.getCurrentEntry()){
	        		return;
	        	}
	        	$this.refresh();
	        });
		},
		
		refresh: function(){
			this.entry = this.getCurrentEntry();
			$this.enableStage('analysis', false);
/*
            this.wrapper = new WidgetWrapper(this.entry, null, { isCacheMod: true, designMode: true, filterManager: this.filterManager });
            this.widgetBlock.append(this.wrapper.getElement());
*/
            if(this.widgetSchemeRenderer){
                this.widgetSchemeRenderer.destroy();
            }

            this.schemeScroll.getElement().loader();
        	$this.entry.loadSettings(function(settings, fail){
				if(fail){
					debugger;
					return;
				}
				$this.entry.loadSettingsScheme(function(scheme, fail){
					$this.widgetSchemeRenderer = new Controller({
	                    scheme: scheme,
	                    values: settings,
	                    context: $this.entry.getId()
	                });
	                $this.schemeContainer.append($this.widgetSchemeRenderer.getElement());
	                $this.updateStatus();

	                $this.schemeScroll.getElement().loader('hide');
				});
			});	
            /*
            var serviceUrl = this.entry.getHttpService().getServiceAddress().trim();
            if(serviceUrl[serviceUrl.length -1] != '/'){
            	serviceUrl += '/';
            }
            this.serviceUrlBlock.text(serviceUrl);
            */
            this.titleEditor.setData(this.entry.getName());
		},
		
		applySettings: function(){
			if($this.options.dontSave){
				return;
			}
		    var values = this.widgetSchemeRenderer.getValues();

            this.updateValidation();

            this.getElement().loader({message:'Сохранение...'});
            
            this.entry.server().storeValues({
                name: this.titleEditor.getData().getValue(),
                values: values
            }, function(sourceDesc){
                $this.getElement().loader('hide');
            });
            
		},

		updatePreview: function(){
			$this.getCurrentEntry().server().getInfo(function(info){
				var tab = $this.stageCtrl.getCurrentTab();
				switch(tab.id){
				case 'request':
					$this.executeRequestStage();
					break;
				case 'analysis':
					if(!info.hasResponse){
						$this.executeRequestStage();
					} else {
						$this.updateResponsePreview(info.hasResponse);
					}
					break;
				case 'tables':
					$this.executePreviewStage();
					break;
				}
				
			});
		},

		updateValidation: function(){
		    this.warningBlock.empty();

            var validate = this.widgetSchemeRenderer.validate();
            if(validate.length > 0){
                this.warningBlock.removeClass('hidden');

                for(var i = 0; i < validate.length; i++){
                    this.warningBlock.append('<p>Поле <b>' + validate[i].name + '</b> обязательно к заполнению!</p>');
                }

                var warningBlockHeight = this.warningBlock.outerHeight();

                if(warningBlockHeight > 200){
                    this.warningBlock.outerHeight(200);
                    this.schemeScroll.getElement().outerHeight('calc(100% - 200px)');
                } else {
                    this.schemeScroll.getElement().outerHeight('calc(100% - ' + warningBlockHeight + 'px)');
                }
            } else {
                this.warningBlock.addClass('hidden');
                this.schemeScroll.getElement().outerHeight('100%');
            }
		},
		
		executeRequestStage: function(){
		    if(!this.warningBlock.hasClass('hidden')){
		        this.updateValidation();
		    }
		    
		    this.server().executeRequestStage(this.entry, this.titleEditor.getData().getValue(), this.widgetSchemeRenderer.getValues());
		},
		
		executeAnalyzeStage: function(){
			if(!this.warningBlock.hasClass('hidden')){
		        this.updateValidation();
		    }
			this.server().executeAnalyzeStage(this.entry, this.titleEditor.getData().getValue(), this.widgetSchemeRenderer.getValues());
		},
		
		executePreviewStage: function(){
			if(!this.warningBlock.hasClass('hidden')){
		        this.updateValidation();
		    }
			$this.resultTable.getElement().loader();
			this.server().executePreviewStage(this.entry, this.titleEditor.getData().getValue(), this.widgetSchemeRenderer.getValues(), function(rDesc, fail){
				$this.resultTable.getElement().loader('hide');
				$this.updateResultPreview(true, rDesc);
			});
		},
		
		switchStage: function(stage){
			this.enableStage(stage, true);
			this.stageCtrl.switchTab(stage);
		},
		
		enableStage: function(stage, b){
			var stages = ['request', 'analysis', 'tables'];
			if(b){
				for(var i = 0; i < stages.length; i++){
					var s = stages[i];
					this.stageCtrl.enableTab(s, true);
					if(s == stage){
						break;
					}
				}
			} else {
				var curStage = this.stageCtrl.getCurrentTab().id;
				var needSwitchStage = false;
				for(var i = stages.length - 1; i >= 0; i--){
					var s = stages[i];
					this.stageCtrl.enableTab(s, false);
					if(curStage == s){
						if(i > 0){
							curStage = stages[i - 1];
							needSwitchStage = true;
						} else {
							curStage = null;
							needSwitchStage = false;
						}
					}
					if(s == stage){
						break;
					}
				}
				if(needSwitchStage){
					this.switchStage(curStage);
				}
			}
		},
		
		updateStatus: function(){
			$this.getCurrentEntry().server().getInfo(function(info){
				if(info.status == 'analyzing'){
					$this.schemeScroll.getElement().loader({
						style:'parser',
						message:`#dot 
								<div class="title">Выполняется анализ структуры файла...</div>
								<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnCancel" caption="Отмена"
									onclick="{{=$this.callbackAttr(function(evt){ $this.cancelAction(); })}}"></div>`
					});
					$this.enableStage('request', true);
					$this.enableStage('analysis', true);
					$this.enableStage('tables', false);
					
					$this.switchStage('analysis');
					
				} else if(info.status == 'requesting'){
					$this.schemeScroll.getElement().loader({
						style:'parser',
						message:`#dot 
								<div class="title">Выполняется запрос к серверу...</div>
								<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnCancel" caption="Отмена"
									onclick="{{=$this.callbackAttr(function(evt){ $this.cancelAction(); })}}"></div>`
					});
					
					$this.enableStage('request', true);
					$this.enableStage('analysis', false);
					$this.enableStage('tables', false);
					
					$this.switchStage('request');

				} else {
					// ready to next
					try {
						$this.schemeScroll.getElement().loader('hide');
					}catch(e){}
					
					$this.enableStage('request', true);
					$this.enableStage('analysis', info.hasResponse);
					$this.enableStage('tables', info.hasStructure);
					
					if(info.hasResponse){
						$this.switchStage('analysis');
					}
					if(info.hasStructure){
						$this.switchStage('tables');
					}
				}
				
				$this.updateResponsePreview(info.hasResponse);
				$this.updateResultPreview(info.hasStructure);
			});
		},
		
		updateResponsePreview: function(bShow){
			$this.tableTabView.showTab($this.responseTab, bShow);
			if(!bShow){
				return;
			}
			$this.tableTabView.switchTab($this.responseTab);
			$this.getCurrentEntry().server().loadResponseData(function(rows, fail){
				if(fail){
					debugger;
					return;
				}
				$this.responseTable.setData(rows);
			});
		},
		
		updateResultPreview: function(bShow, rDesc){
			$this.tableTabView.showTab($this.resultTab, bShow);
			if(!bShow){
				return;
			}
			$this.tableTabView.switchTab($this.resultTab);
			if(rDesc){
				$this.resultPreview = rDesc;
				$this.resultTable.setData($this.resultPreview.rows);
			} else {
				$this.resultTable.getElement().loader();
				$this.getCurrentEntry().server().executePreviewStage(function(rDesc, fail){
					$this.resultTable.getElement().loader('hide');
					if(fail){
						debugger;
						return;
					}
					$this.resultPreview = rDesc;
					$this.resultTable.setData($this.resultPreview.rows);
				});
			}
		},
		
		cancelAction: function(){
			this.server().cancelAction($this.entry);
		},
	},
	
	$server: {
		executeRequestStage: function(method, name, values){
			return method.executeRequestStage({
				name: name,
				settings: values
			});
		},
		
		executeAnalyzeStage: function(method, name, values){
			return method.executeAnalyzeStage({
				name: name,
				settings: values
			});
		},
		
		executePreviewStage: function(method, name, values){
			return method.executePreviewStage({
				name: name,
				settings: values
			});
		},
		
		cancelAction: function(method){
			method.setStatus('ready');
		}
	}
	
}
{
	$name:'JSB.Widgets.Page',
	$parent: 'JSB.Widgets.Widget',
	$http: true,
	$server:{
		get: function(params){
			var htmlSection = this.getJsb()['$html'];
			return `#dot
			<!DOCTYPE html>
			<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<meta name="viewport" content="width=1024, user-scalable=no" />
				{{? htmlSection.title}}
				<title>{{=htmlSection.title}}</title>
				{{?}}
				{{? htmlSection.favicon}}
				<link rel="shortcut icon" type="image/png" href="{{=htmlSection.favicon}}"/>
				{{?}}
			 	<script type="text/javascript" src="/jsbeans.jsb"></script>
			 	
			 	<style>
			 		body {
						overflow: hidden; /* this is important to prevent the whole page to bounce */
						margin: 0;
					}

					.mainContainer {
						width: 100%;
						height: 100%;
						left: 0%;
						top: 0%;
						display: block;
						position: absolute !important;
					}
			 	</style>
			</head>

			<body>
				<div jsb="{{=this.getJsb().$name}}" bind="{{=this.getId()}}" class="mainContainer" ></div>
			</body>

			</html>`;
		}


	}
}
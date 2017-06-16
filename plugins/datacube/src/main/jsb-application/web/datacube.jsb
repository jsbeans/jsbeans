{
	$name: 'JSB.DataCube.Main',
	$require: ['Web'],
	$http: true,
	$singleton: true,
	
	$server: {
		
		get: function(params) {
			if(Object.keys(params).length == 0){
				return this.getEditor();
			}
		},
		
		getEditor: function(){
			return `<!DOCTYPE html>
			<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<meta name="viewport" content="width=1024, user-scalable=no" />
				<title>DataCube</title>
				<link rel="shortcut icon" type="image/png" href="/datacube/images/datacube.png"/>
				
			 	<script type="text/javascript" src="jsbeans.jsb"></script>
			 	
			 	<style>
			 		body {
						font-family: verdana, lucida, sans, arial, sans-serif;
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
				<div jsb="JSB.DataCube.Editor" class="mainContainer" ></div>
			</body>

			</html>`;
		}
	}
}
{
	$name: 'DataCube.Query.Console',
	$singleton: true,

	$server: {
		$require: [
            'DataCube.Query.QueryUtils',
        ],


        message: function(desc/*{message:'', params:{}, error: err}*/){
            // TODO: send to client UI
            $this.logMessage(desc);
        },

        logMessage: function(desc){
            if (desc.error){
                QueryUtils.logDebug('\nConsole [ERROR]: ' + desc.message + '\n' + JSB.stringifyError(desc.error) + '\n' + $this._stringify(desc.params));
            } else {
                QueryUtils.logDebug('\nConsole [INFO]: ' + desc.message + '\n' + $this._stringify(desc.params));
            }
        },


        _stringify: function(params) {
            var s = '{ \n';
            for(var p in params) if(params.hasOwnProperty(p)) {
                if(s.length > 3) s += ', \n';
                s += '\t' + p + ': ' + (JSB.isString(params[p]) ? params[p] : JSON.stringify(params[p]));
            }
            return s + ' \n}';
        }
	}
}
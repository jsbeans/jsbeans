{
	$name: 'DataCube.Model.CacheControllerSettings',
	$parent: 'DataCube.Model.SettingsEntry',
	
	$scheme: {
		intervalRange: {
			render: 'group',
			name: 'Диапазон интервалов обновления',
			collapsible: true,
			items: {
				minInterval: {
			        render: 'item',
			        name: 'Минимум (ms)',
			        value: 1000,	// 1 sec
			        valueType: 'number'
				},
				maxInterval: {
			        render: 'item',
			        name: 'Максимум (ms)',
			        value: 2592000000,	// 1 month
			        valueType: 'number'
				}
			}
		}
		
	}
}
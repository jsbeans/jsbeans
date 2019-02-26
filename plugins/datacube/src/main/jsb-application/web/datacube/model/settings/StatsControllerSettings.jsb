{
	$name: 'DataCube.Model.StatsControllerSettings',
	$parent: 'DataCube.Model.SettingsEntry',
	
	$scheme: {
		statsGroup: {
			render: 'group',
			name: 'Настройки сбора статистики',
			items: {
				useStats: {
					render: 'switch',
					name: 'Включить сбор статистики',
					optional: 'checked',
					items: {
						updateInterval: {
		                    render: 'item',
		                    name: 'Обновлять статистику',
		                    editor: 'JSB.Widgets.CronEditor',
		                    value: '* * * * *'
		                },
		                cleanupSettings: {
		                	render: 'group',
		                	name: 'Установить график очистки журнала статистики',
		                	optional: 'checked',
		                	items: {
		                		cleanupTime: {
		                			render: 'item',
		                            name: 'Запускать очистку журнала',
		                            editor: 'JSB.Widgets.CronEditor',
		                            value: '15 4 * * *'
		                		},
		                		actualWindow: {
		                			render: 'select',
		                            name: 'Сохранять статистику за',
		                            defaultValue: 'windowYear',
		                            items: {
		                            	windowDay: {
		                            		render: 'item',
		                            		name: 'день'
		                            	},
		                            	window3Days: {
		                            		render: 'item',
		                            		name: '3 дня'
		                            	},
		                            	windowWeek: {
		                            		render: 'item',
		                            		name: 'неделю'
		                            	},
		                            	windowMonth: {
		                            		render: 'item',
		                            		name: 'месяц'
		                            	},
		                            	window3Months: {
		                            		render: 'item',
		                            		name: '3 месяца'
		                            	},
		                            	windowYear: {
		                            		render: 'item',
		                            		name: 'год'
		                            	},
		                            	window3Years: {
		                            		render: 'item',
		                            		name: '3 года'
		                            	},
		                            	window5Years: {
		                            		render: 'item',
		                            		name: '5 лет'
		                            	}
		                            }
		                		}
		                	}
		                }
		                
					}
				}
			}
		}
	},
	
	$server: {
	}
}
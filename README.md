# jsBeans - Client-server JavaScript Fullstack  Web Framework
  
 ```jsBeans``` — клиент-серверный веб-фреймворк класса "full-stack" для создания веб-приложений на языке JavaScript. Реализован на Java 1.8 с Mozilla Rhino в качестве серверного JavaScript движка, встроенным Web сервером на Eclipse Jetty и сервисной шиной на Akka.
 
 Может использоваться:
 1. В виде самостоятельного сервера приложений с развертыванием прикладных приложений "из папки".
 2. В виде подключаемой Java библиотеки. Прикладные модули как правило так же подключаются в общий classpath основного приложения.
 
 Ключевые фитчи "из коробки":
 
 * ```JavaScript Bean (JSB)``` - изоморфные объекты-классы, включающие $server, $client и $common части.
 * Базовые концепции ООП поверх JavaScript
 * Прозрачное взаимодействие частей бина и автоматическая синхронизация данных на единой RPC шине, оптимизирующей Ajax запросы при синхронизации большого числа бинов 
 * Дескриптор бина (JSON с функциями) представляет логически законченный функциональный компонент и одновременно содержит клиенсткий и серверный код
 * Шаблонизатор ``` `#dot ...` ``` (сейчас ```#dot{{...}}```)
 * Аннотирование полей и методов ```/** @annotation {...} */``` (не реализовано)
 * Поддержка пакетов, управление зависимостями
 * Базовая библиотека системных бинов
 * Базовая библиотека бинов виджетов
 * Публикация методов бина в HTTP JSON API
 * Расширения бинов, позволяющие повесить на бины дополнительный базовый функционал
 * Динамическая отложенная загрузка допонительных бинов с сервера на клиент
 * Минификатор и упаковщик с управлением зависимостями

 * TODO
 * TODO

## Простейший бин
```javascript
JSB({
    $name: 'MyBean',
    
    myFiled: 123,
    
    myMethod: function(){
        return this.myField;
    }    
});
```

## Клиент-серверный бин

```javascript
JSB({
    /** пакет и имя бина */
    $name: 'my.examples.MyBean',
    
    /** бин может наследовать свойства и методы родительского */
    $parent: 'my.examples.ParentBean',
     
    /** бин может импортировать другие бины (например, для создания экземпляров), 
    типы импортированных бинов будут интегрированы в scope методов */
    $require: {MyWorld: 'my.examples.MyWorld'},

    /** методы из общей секции могут использоваться (копируются) в $client и $server*/
    formatMessageText: function(data){
        var text = '';
        for (let p: data) if (data.hasOwnProperty(p)) {
            text += p + ' = ' + data[p] + '\n';
        }
        return text;
    },

    /** секция клиентского кода (исполняется в браузере)*/
    $client: {
        $constructor: function(){
            window.setInterval(function(){
                /** вызов метода из "противоположной секции" осуществляется 
                асинхронно через адаптер, получаемый внутри методов $server() 
                и вне jsb.$server()*/
                $server().getTimestamp(function(result, error){                    
                    /** в scope всех методов добавляется $this равный this метода бина, чтобы 
                    перед вложенными функциями не декларировать 'var self = this' */
                    if (!error) {
                        let data = {timestamp: 0 + result};
                        alert($this.formatMessageText(data));
                    }
                });                
            }, 1000);
        }
    },

    /** секция серверного кода (исполняется на сервере)*/
    $server: {
        /** серверный конструктор вызывается при порождении серверной части 
        экземпляра бина */
        $constructor: function(){
            /** создание экземпляра импортированного бина */
            this.myWorld = new MyWorld();                        
        },
        
        /** методы, объявленные в серверной секции могут вызываться с клиента 
        и наоборот */
        getTimestamp: function (){
            return 0 + this.getSystemTimestamp();
        },
        
        /** В серверной секции так же можно использовать java классы и объекты, 
        добавив префикс 'Packages.' */
        getSystemTimestamp: function() {
            return Packages.java.lang.System.currentTimeMillis();
        }
    }    
});
```

## Web компонент
```javascript
JSB({
	$name: 'my.examples.MyWebControl',

	/** Унаследуем наш компонент от бина Control из библиотеки JSB.Widgets */
	$parent: 'JSB.Widgets.Control', 

	/** Наш компонент будет использовать ComboBox из библиотеки JSB.Widgtets */	
	$require: ['JSB.Widgets.ComboBox'],

	/** Клиентская секция (код будет выполняться в браузере) */
	$client: {
		#constructor: function(opts){
			$base(opts); // Вызываем родительский конструктор
			
			/** Загружаем стили (путь задается относительно места расположения 
			файла с текущим бином) */
			this.loadCss('myWebControl.css');

			/** Создадим экземпляр бина ComboBox из библиотеки JSB.Widgets */
			var cb = new ComboBox({
				cssClass: 'myCombo',
				dropDown: true,
				items: [{
					key: 'first',
					element: 'Первый'
				},{
					key: 'second',
					element: 'Второй'
				},{ 
					key: 'third',
					element: '<div class="cool">Третий</div>'
				}],

				/* инициализируем комбо значением, переданным через параметр 
				конструктора */
				value: opts.initialValue,
				
				onChange: function(key, obj){
					$this.updateMyData();
				}
			});
			
			/** Добавим ComboBox в DOM элемент нашего компонента */
			this.append(cb); 

			/** Создадим DOM элемент для помещения туда данных с сервера */
			this.append($('<div class="myContainer"></div>'));
			
			/** Загрузим/обновим данные с сервера и выведем их */
			this.updateMyData();
		},

		updateMyData: function(){
			/** Получим текущее значение из комбо-бокса */
			var cbVal = this.find('.myCombo').jsb().getData();
			
			/** Вызываем серверную функцию для получения данных с сервера.
			Первым аргументом передаем значение из комбо, а вторым - колбэк 
			функцию, которая будет вызвана сразу как только серверный метод 
			вернет данные */
			$server().loadMyData(cbVal, function(res){
				$this.drawData(res); // отрисуем данные
			});
		},
		
		drawData: function(data){
			/** Предварительно очистим контейнерный элемент */
			$('.myContainer').empty(); // вызов jQuery

			/** Добавим данные в контейнерный элемент при помощи встроенного
			шаблонизатора doT */
			$('.myContainer').append(`#dot
				<ul class="myTags">
				{{ for(var i in data) { }}
					<li class="myTag">{{=data[i]}}</li>
				{{ } }}
				</ul>
			`);
		}
	},

	/** Серверная секция (код будет выполняться на стороне сервера) */
	$server: {
		myDictionary: {
			first: ['Анна', 'Мария'],
			second: ['Вера', 'Лариса'],
			third: ['Вероника','Петр']
		},
		
		loadMyData: function(key){
			return this.myDictionary[key];
		}
	}
});
```

##  Встраивание компонента в HTML

#### Встраивание при помощи JavaScript
```html
<html>
	<head>
		<script type="text/javascript" src="jsbeans.js"></script>
	</head>
	<body>
		<div id="myGlobalContainer"></div>
		
		<script type="text/javascript">
			JSB.create('my.examples.MyWebControl', {
				container: '#myGlobalContainer',
				initialValue: 'second'
			}, function(){
				/** place code here if you want to do anything after control
				has been created */
			});
		</script>
	</body>
</html>
```

#### Автоматическое встраивание
```html
<html>
	<head>
		<script type="text/javascript" src="jsbeans.js"></script>
	</head>
	<body>
		<div id="myGlobalContainer" 
			jsb="my.examples.MyWebControl"
			initialvalue="second"
		></div>
	</body>
</html>
```

## Управление жизненным циклом
Бин является составным объектом, разные его части (клиентская и серверная) имеют различные JavaScript объекты, у каждого может быть свой жизненный цикл и область видимости. Разработчик может привязать жизненный цикл бина к сесии пользователя, управлять автопорождением экземпляров или управлять жизненным циклом вручную. Ниже приведено несколько часто используемых случаев. 

#### Синглтон 
* TODO

#### Синглтон в рамках сессии
* TODO

#### Автопорождение серверной части с клиента
* TODO

#### Один бин: один клиентский - один серверный
* TODO

#### Один бин: много клиентских - один серверный
* TODO

#### Один бин: много клиентских - много серверных
* TODO


  
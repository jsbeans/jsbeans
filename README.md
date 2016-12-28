# jsBeans - Client-server JavaScript Fullstack Web Framework
  
```jsBeans``` — изоморфный клиент-серверный фреймворк класса "full-stack" для создания комплексных программных решений с развитым веб-интерфейсом, объектной иерархией и клиент-серверным взаимодействием.
 
 Реализован на Java 1.8 с Mozilla Rhino в качестве серверного JavaScript движка, встроенным Web сервером на Eclipse Jetty и сервисной шиной на Akka.
 
#### Ключевые особенности jsBeans:
 
 * Веб-интерфейс и бизнес логика приложений разрабатываются на атомарных объектно-ориентированных классах - бинах (```JavaScript Beans (JSB)``` по аналогии с ```JavaBeans```).
 * Дескриптор бина (JSON с функциями) представляет логически законченный функциональный компонент и одновременно содержит как клиентский, так и серверный код.
 * Прозрачное взаимодействие клиентской и серверной частей бина и автоматическая синхронизация данных на единой RPC шине.
 * Динамическое разрешение зависимостей бинов.
 * Обмен сообщениями между бинами в едином клиент-серверном пространстве (Actors).
 * Встроенная библиотека клиент-серверных веб-компонентов (JSB.Widgets) и возможность подключения компонентов из репозитория.
 * Возможность использования на серверной стороне любых сторонних Java библиотек.
 
#### А также
 * Шаблонизатор ``` `#dot ...` ``` (сейчас ```#dot{{...}}```)
 * Аннотирование полей и методов ```/** @annotation {...} */``` (не реализовано)
 * Публикация методов бина в HTTP API
 * Расширения бинов (traits), позволяющие навесить на бины дополнительный функционал.
 * Минификатор и упаковщик с управлением зависимостями
 * TODO

#### Использование
 
1. В виде самостоятельного сервера приложений с развертыванием прикладных приложений "из папки".
2. В виде подключаемой Java библиотеки. Прикладные модули, как правило, также подключаются в общий classpath основного приложения.


## Что такое бины?
В соответствии с концепцией jsBeans вся логика приложений (как серверная, так и клиентская) строится в виде иерархий объектов на языке JavaScript, напоминающих EJB-компоненты в Java EE. Они изоморфны, соответствуют основным принципам ООП, могут порождаться и удаляться, могут вызываться удаленно и мигрировать с одного сервера на другой или в браузер. Такие объекты мы называем - **бинами**.

#### Простейший бин
Бины описываются в виде JSON объектов. Они содержат системные поля, отражающие специфику функционирования бина, а также ряд пользовательских полей и методов для описания бизнес логики.
Все системные поля начинаются на $, например ```$name```, ```$parent```, ```$require``` и т.п.

Декларация бина осуществляется с помощью функции ```JSB(beanDeclarationJson);``` и выглядит следубщим образом:

```javascript
JSB({
    $name: 'MyBean',
    
    myField: 123,
    
    myMethod: function(){
        return this.myField;
    }    
});
```

Функция ```JSB(beanDeclarationJson)``` непосредственно формирует сам бин по описанию в ```beanDeclarationJson``` и помещает его в специальный контейнер бинов (JSB-контейнер) с целью дальнейшего управления их жизненным циклом. JSB-контейнер изоморфен и присутствует как на стороне сервера так и на стороне клиента.

Таким образом вышеприведенный бин может быть одинаково использован как стороне сервера, так и на стороне клиента(ов).

```javascript
JSB.lookup('MyBean', function(MyBeanClass){
	var myBeanInst = new MyBeanClass();
	myBeanInst.myMethod();
});
```

#### Клиент-серверный бин
Клиент-серверные бины, как правило, содержат несколько секций (в частности – ```$server``` и ```$client```).

В секции ```$client```, в основном, располагаются поля и методы для взаимодействия с DOM моделью браузера, а в секции ```$server``` – серверные поля и методы, отвечающие за бизнес логику, работу с СУБД, файловой системой и другими ресурсами операционной системы.
В общем случае при создании экземпляра бина на стороне клиента создается соответствующий ему серверный экземпляр и между ними устанавливается взаимодействие, характер которого (один к одному / много к одному) задается разработчиком при декларации бина.
Взаимодейтвие между секциями осуществляется прозрачно для разработчика, путем выхова автоматически генерируемых асинхронных proxy методов.

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
            this.scheduleTimestampMessage();
        },

		scheduleTimestampMessage: function(){
			window.setInterval(function(){
                /** вызов метода из "противоположной секции" осуществляется 
                асинхронно через адаптер, получаемый внутри методов $server() 
                и вне jsb.$server()*/
                $server().getTimestamp(function(result, error){                    
                    /** в scope всех методов добавляется $this равный this 
                    метода бина, чтобы перед вложенными функциями не декларировать '
                    var self = this' */
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

#### Web компонент
```javascript
JSB({
	$name: 'my.examples.MyWebControl',

	/** Унаследуем наш компонент от бина Control из библиотеки JSB.Widgets */
	$parent: 'JSB.Widgets.Control', 

	/** Наш компонент будет использовать ComboBox из библиотеки JSB.Widgets */	
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

####  Встраивание компонента в HTML при помощи JavaScript
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
			}, function(myCtrl){
				/** place code here if you want to do anything after control
				has been created */
			});
		</script>
	</body>
</html>
```

#### Автоматическое встраивание компонента в HTML
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

## Синхронизация общих полей
Поля и методы, объявленные в общей секции бина (вне ```$server``` и ```$client```) являются общими и для сервера и для клиента и могут использоваться в коде обеих секций. JsBeans позволяет синхронизировать общие поля таким образом, что поле измененное кодом на одной стороне автоматически обновится и на другой. 
Политика синхронизации полей гибко настраивается опцией ```$sync```, которая может задаваться в разных секциях бина. Синхронизация может быть однонаправленной и двунаправленной, она может осуществляться автоматически, а может управляться программно.

#### Автоматическая однонаправленная синхронизация
Для включения автоматической однонаправленной синхронизации необходимо в общей секции бина установить опцию ```$sync: true```. В этом случае все общие поля, изменяемые кодом на стороне сервера, будут автоматически изменяться на стороне клиента, **но не наоборот**.

```javascript
JSB({
	$name: 'my.examples.MySyncBean',
	$sync: true,

	/** Общее поле, подлежащее синхронизации */
	myCommonField: 'starting...',

	$client: {
		$constructor: function(){
			console.log(this.myCommonField);
		},
		
		/** Метод $onSyncAfter будет вызван сразу как только одно или несколько
		синхронизируемых полей будут обновлены */
		$onSyncAfter: function(syncInfo){
			console.log(this.myCommonField);
		}
	},

	$server: {
		$constructor: function(){
			/** Будем обновлять поле на стороне сервера каждую минуту */
			JSB.interval(function(){
				$this.myCommonField = new Date().toString();
			}, 60000);
		}
	}
});
```

После создания экземпляра бина на стороне клиента, на серверной стороне будет автоматически создана его серверная часть и вызовется конструктор. Далее серверный конструктор вызывает встроенную функцию ```JSB.interval```, которая установит интервал обновления поля на стороне сервера в одну минуту. В результате, в консоли клиента каждую минуту будет печататься текущее время.

#### Настройка политики синхронизации
Опция ```$sync:true``` устанавливает политику синхронизации по умолчанию, которая эквивалентна следующей настройке:

```javascript
$sync: {
	updateClient: true,
	updateServer: false,
	updateCheckInterval: 1000,
	include: [],
	exclude: []
}
```

Установка значений для ```updateClient``` и ```updateServer``` позволяет задать направление синхронизации, при этом синхронизация может быть как однонаправленной, так и двунаправленной (оба значения установлены в ```true```).
При помощи опций ```include``` и ```exclude``` можно указать имена полей, подлежащих синхронизации.
Опция ```updateCheckInterval``` позволяет установить интервал проверки полей на необходимость их синхронизации. Надо отметить, что в случае большого количества синхронизируемых полей, автоматическая проверка может негативно сказаться на производительности. В таких случаях рекомендуется выполнять проверку изменений только по мере необходимости и желательно в тех местах, где эти изменения происходят. Для этого нужно отключить автоматическую проверку, установив опцию ```updateCheckInterval: 0``` и запускать эту процедуру программно, при помощи вызова метода ```$doSync```, который имеется у каждого бина.

```javascript
JSB({
	$name: 'my.examples.MySyncBean2',
	$sync: {
		updateCheckInterval: 0 // отключим автоматическую синхронизацию
	},

	/** Общее поле, подлежащее синхронизации */
	myCommonField: 'starting...',

	$client: {
		$constructor: function(){
			console.log(this.myCommonField);
		},
		
		/** Метод $onSyncAfter будет вызван сразу как только одно или несколько
		синхронизируемых полей будут обновлены */
		$onSyncAfter: function(syncInfo){
			console.log(this.myCommonField);
		}
	},

	$server: {
		$constructor: function(){
			/** Будем обновлять поле на стороне сервера каждую минуту */
			JSB.interval(function(){
				$this.myCommonField = new Date().toString();

				/** Вызовем процедуру синхронизации */
				$this.$doSync();
			}, 60000);
		}
	}
});
```
#### Управление логикой синхронизации
При изменении общих полей на одной стороне, ```jsBeans``` обнаруживает эти изменения и формирует так называемый синхропакет, который впоследствии передается на другую сторону и используется для обновления полей. Перед непосредственным обновлением, синхропакет проходит через метод ```$onBeforeSync```, который есть у каждого бина. Переопределение этого метода позволит разработчику принимать решения об обновлении полей, предварительно проанализировав синхропакет.

```javascript
JSB({
	$name: 'my.examples.SyncBeforeAfterTest'

	myField1: 'test',
	myField2: {},

	$client: {
		// ...
		/** $onBeforeSync вызывается после получения синхропакета, 
		но до синхронизации полей. 
		Здесь мы можем принять решение - стоит	ли применять синхропакет или нет */
		$onBeforeSync: function(syncInfo){
			if(syncInfo.isChanged('myField1')) {
				return false; // не будем принимать изменения
			}
			return true; // примем изменения
		}
		// ...
	}
});
```

После обновления полей фреймворк вызывает метод ```$onAfterSync``` в целях уведомления о произведенной синхронизации.

```javascript
JSB({
	$name: 'my.examples.SyncBeforeAfterTest2'

	myField1: 'test',
	myField2: {},

	$client: {
		// ...
		/** $onAfterSync вызывается после синхронизации.
		Здесь мы можем выполнить какие-либо действия узнав, что поле обновилось*/
		$onAfterSync: function(syncInfo){
			if(syncInfo.isChanged('myField1')) {
				console.log('Ура, теперь myField1 = ' + $this.myField1);
			}
		}
		// ...
	}
});
```


## Обмен сообщениями

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


  
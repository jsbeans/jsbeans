 h1. Описание папок в архивах исходных файлов

 h2. ps-avi (он же keshif-demo)

| keshif-demo-build | Проект сборки архива с исполняемыми файлами приложения ПС АВИ  |
| keshif-demo-jsb | Проект модуля фронтенда приложения ПС АВИ, содержит дополнительные компоненты и стили  | 
| keshif-demo-jsb/src/main/java | Содержит класс активатора текущего модуля в платформе  | 
| keshif-demo-jsb/src/main/jsb-application/config | Исходные конфигурационные файлы модуля  | 
| keshif-demo-jsb/src/main/jsb-application/web | Исходные файлы фронтенда приложения, содержит: описание макросов языка запросов, дополнительные виджеты и другие компоненты  | 
| | |
| thirdparty/jsbeans | Проекты сервера приложений и модулей-расширений (плагинов)  | 
| thirdparty/jsbeans/kernel | Ядро сервера приложений jsbeans  | 
| | |
| thirdparty/jsbeans/kernel/src/main/java/com/google/gson | Компоненты для сериализации/десериализации JSON  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/cluster | Поддержка работы jsbeans в кластере  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/documentation | Генератор документации бинов (*.jsb) в формате jsDoc  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/helpers | Дополнительные вспомогательные классы, как правило статические  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/messages | Классы системных сообщений  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/monads | Классы библиотеки "монад" (цепочек асинхронных вызовов)  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/plugin | Содержит класс активации модуля ядра платформы  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/scripting | Реализация JavaScript интерпретатора и серверного окружения  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/security | Поддержка базовой системы разграничения доступа и управления полномочиями  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/serialization | Классы для сериализации/десериализации специфичных типов  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/services | Реализация сервисов jsbeans и сервис-менеджера  | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/types | Классы специфичных типов  | 
| thirdparty/jsbeans/kernel/src/main/java/org/mozilla | Дополнительные классы для интеграции и работы встроенного Rhino отладчика JavaScript кода  | 
| thirdparty/jsbeans/kernel/src/main/jsb-application/config | Основные конфигурационные файлы ядра платформы  | 
| thirdparty/jsbeans/kernel/src/main/jsb-system | Системные компоненты (бины *.jsb) и ресурсы платформы jsbeans  | 
| | |
| thirdparty/jsbeans/plugins | Проекты модулей-плагинов платформы jsbeans  | 
| thirdparty/jsbeans/plugins/web | Реализация Web сервера в платформе jsBeans  | 
| | |
| thirdparty/jsbeans/plugins/datacube | Проект модуля с основным функционалом редактора визуализаций ПС АВИ  | 
| thirdparty/jsbeans/plugins/datacube/src/main/java | Включает класс активатора текущего модуля в платформе  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/config | Конфигурационные файлы редактора визуализаций ПС АВИ  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube | Исходные файлы редактора визуализаций ПС АВИ  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/api | Реализация API    | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/controls | Реализация элементов/компонентов графического интерфейса  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/diagram | Реализация диаграммы реактора (источники данных, куб, срезы)   | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/dialogs | Реалиация некоторых стандартных для приложения диалогов и форм  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/editors | Реализация редакторов отдельных элементов  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/export | Реализация экспорта данных  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/images | Некоторые картинки графического интерфейса   | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/materialization | Реализация движка материализации куба/срезов  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/model | Реализация объектной модели куба  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/providers | Реализация источников данных  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/query | Реализация движка запросов и транслятора запросов к источникам данных (в частности в SQL)  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/renderers | Реализация графияеского представления отдельных элементов объектной модели куба   | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/views | Отдельные диалогии формы приложения  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/widgets | Реализации виджетов для визуализации данных в дашборжах  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/datacube/workspace | Реализация рабочего пространства пользователя  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/fonts | Дополнительные шрифты графического интерфейса  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/jsb/store | реализация абстрактного хранилища данных и реализация SQL через JDBC  | 
| thirdparty/jsbeans/plugins/datacube/src/main/jsb-application/web/tpl | Дополнительные JavaScript библиотеки графического интерфейса  | 
| | |
| thirdparty/jsbeans/plugins/unimap | Реализация интерактивной карты  | 
| thirdparty/jsbeans/plugins/unimap/src/main/java | Содержит класс активатора текущего модуля в платформе  | 
| thirdparty/jsbeans/plugins/unimap/src/main/jsb-application/config | Конфигурационные файлы текущего модуля  | 
| thirdparty/jsbeans/plugins/unimap/src/main/jsb-application/web/unimap | Реализация интерактивной карты  | 
| | |
| thirdparty/jsbeans/plugins/workspace | Абстрактная реализация рабочего пространства пользователя |

h2. ontoed, ontoed-d2rq, ontoed-engine-d2rq:

| ont-d2rq | Реализация транслятора реляционных данных в RDF формат на основе D2RQ | 
| ont-d2rq/src/main/java/d2rq | Классы стандартных утилит D2RQ | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/algebra | Реализация реляционной алгебры (связи таблиц, столбцов и прочее) | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/csv | Поддержка CSV формата | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/dbschema | Реализация извлечения схемы БД | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/engine | Реализация основной части движка трансляции в RDF (итераторы) | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/expr | Объектное представление некоторых выражений в формате SQL | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/find | Разные поисковые утилиты для работы с множеством триплетов | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/jena | Расширение для Jena (реализует надстройку над Jena для работы с реляционными данными под капотом) | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/map | Реализация объектной модели D2RQ | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/mapgen | Реализация генератора стандартных правил отображения по схеме БД | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/nodes | Некоторые объекты движка транслятора | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/optimizer | Дополнительные оптимизации транслятора | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/pp | (pretty printer) Реализация строкового вывода для некоторых объектов (для отладки) | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/sql | Некоторые вспомогательные объекты и классы для работы с SQL, включая vendor специфичные оптимизации | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/values | Некоторые вспомогательные объекты движка | 
| ont-d2rq/src/main/java/de/fuberlin/wiwiss/d2rq/vocab | Классы со словарными константами, как правило словарь IRI | 
| ont-d2rq/src/main/java/ru/avicomp/ontapi/jena | Реализация Jena Graph, предсталяющего абстрактный граф, состоящий из коллекции графов | 
| | |
| ontoed-d2rq-build | Проект сборки исполняемого файла Ontoed (редактора правил отображения) | 
| | |
| ontoed-d2rq-jsb | Проект модуля редактора онтологий с правилами отображения D2RQ (расширение ontoed-main) | 
| ontoed-d2rq-jsb/src/main/java | Включает класс активатора текущего модуля в платформе и ряд дополнительных вспомогательных классов | 
| | |
| ontoed-d2rq-jsb/src/main/jsb-application/config | Конфигурация модуля редактора правил отображения | 
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed- Фронтенд модуля редактора правил отображения | 
| | |
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed/diagram | Реализация диаграммы правил отображения D2RQ |
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed/dialogs | Некоторые диалоговые окна редактора правил отображения |
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed/editors | Основные элементы управления для редактирования различных сущностей правил отображения |
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed/model | Объектная модель правил отбражения |
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed/renderers | Бины для визуализации объектов объектной модели правил отображения |
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed/views | Формы графического интерфейса |
| ontoed-d2rq-jsb/src/main/jsb-application/web/ontoed/workspace | Дополнительные объекты рабочего пространства пользователя |
| ontoed-d2rq-jsb/src/main/jsb-resource/ontoed/d2rq | Включает реактор онтологий D2RQ (runtime менеджер) и реализацию источника данных | 
| | |
| ontoed-d2rq-jsb/src/main/resources/ontoed/d2rq | Содержит онтологию D2RQ | 
| | |
| ontoed-engine-d2rq | Проект модуля движка трансляции реляционных данных в RDF согласно правилам отображения D2RQ | 
| ontoed-engine-d2rq/src/main/java/ru/avicomp/ontoed/engine/d2rq | Содержит осноыне классы движка (main класс, реализацию воркера, абстрактное хранилище результатов преобразования, реализацию сохранения результатов в файл) | 
| ontoed-engine-d2rq/src/main/java/ru/avicomp/ontoed/engine/d2rq/idb | Содержит реализацию сохранения в хранилище ИБД | 
| | |
| ontoed-engine-d2rq-build | Проект сборки модуля движка трансляции реляционных данных в RDF согласно правилам отображения D2RQ | 
| | |
| ontoed-main | 
| ontoed-main/ontoed-build | Проект сборки дистрибутива редактора онтологий Ontoed | 
| | |
| ontoed-main/ontoed-jsb | Проект модуля редактора онтологий Ontoed | 
| ontoed-main/ontoed-jsb/src/main/java/ru/avicomp/ontoed | Содержит класс активатора текущего модуля в платформе и сервис запуска браузера вместе с приложением (для режима stand-alone), который не используется (отключен в конфиге опцией "startBrowser.enabled") | 
| | |
| ontoed-main/ontoed-jsb/src/main/jsb-application/config | Конфигурация модуля редактора онтологий | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed | Основной код вронтенда редактора онтологий | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/controls | Базовые элементы графического интерфейса | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/diagram | Реализация диаграммы редактора онтологий (классы, свойства, объекты) | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/dialogs | Базовые диалоговые окна приложения | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/editors | Основные элементы управления для редактирования различных сущностей онтологии | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/fonts | Набор дополнительных шрифтов графического интерфейса | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/images | Картинки и иконки элементов графического интерфейса | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/model | Упрощенная объектная модель онтологии | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/renderers | Бины для визуализации объектов объектной модели онтологии | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/views | Формы графического интерфейса | 
| ontoed-main/ontoed-jsb/src/main/jsb-application/web/ontoed/workspace | Реализация рабочего ространства пользовалея (его представление в GUI) | 
| ontoed-main/ontoed-jsb/src/main/jsb-resource/ontoed/owlapi | Включает OWL реактор (управление онтологиями в runtime) | 
| ontoed-main/ontoed-jsb/src/main/jsb-resource/ontoed/runtime | Базовая абстрактная реализация Runtime редактора онтологий | 
| ontoed-main/ontoed-jsb/src/main/jsb-resource/ontoed/workspace | Системная реализация рабочего пространства пользователя | 
| | |
| ontoed-main/ontoed-owlapi | Проект модуля взаимодействия с OWLAPI (содержит ряд вспомогательных классов и компонетов для чтения и редактирования онтологий) | 
| | |
| ontoed-main/ontoed-owlapi/src/main/java/ru/avicomp/ontoed/owlapi | Содержит класс активатора текущего модуля в платформе и ряд дополнительных вспомогательных классов | 
| ontoed-main/ontoed-owlapi/src/main/java/ru/avicomp/ontoed/owlapi/customimpl | Расширение OWLAPI (по большей части с целью ограничить источники размещения онтологий и исключить их скачивание из сети) | 
| ontoed-main/ontoed-owlapi/src/main/java/ru/avicomp/ontoed/owlapi/json | Реализация JSON представления для объектов онтологии | 
| ontoed-main/ontoed-owlapi/src/main/js | Включает ряд вспомогательных JavaScript оберток (для работы в серверном окружении с онтологиями) | 
| ontoed-main/ontoed-owlapi/src/main/resources/META-INF/services | Включает конфигурации сервисов OWLAPI (содержит перечисление поддерживаемых выходных и входных форматов представления RDF) | 
| ontoed-main/ontoed-owlapi/src/main/resources/ontologies | Включает ряд стандартных онтологий (в том числе словарные) | 
| | |
| rdf-sdb-loader | Проект модуля библиотеки сохранения RDF документов в ИБД | 
| | |
| thirdparty/jsbeans | Проекты сервера приложений и модулей-расширений (плагинов) | | 
| thirdparty/jsbeans/kernel | Ядро сервера приложений jsbeans | | 
| | |
| thirdparty/jsbeans/kernel/src/main/java/com/google/gson | Компоненты для сериализации/десериализации JSON | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/cluster | Поддержка работы jsbeans в кластере | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/documentation | Генератор документации бинов (*.jsb) в формате jsDoc | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/helpers | Дополнительные вспомогательные классы, как правило статические | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/messages | Классы системных сообщений | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/monads | Классы библиотеки "монад" (цепочек асинхронных вызовов) | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/plugin | Содержит класс активации модуля ядра платформы | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/scripting | Реализация JavaScript интерпретатора и серверного окружения | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/security | Поддержка базовой системы разграничения доступа и управления полномочиями | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/serialization | Классы для сериализации/десериализации специфичных типов | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/services | Реализация сервисов jsbeans и сервис-менеджера | | 
| thirdparty/jsbeans/kernel/src/main/java/org/jsbeans/types | Классы специфичных типов | | 
| thirdparty/jsbeans/kernel/src/main/java/org/mozilla | Дополнительные классы для интеграции и работы встроенного Rhino отладчика JavaScript кода | | 
| thirdparty/jsbeans/kernel/src/main/jsb-application/config | Основные конфигурационные файлы ядра платформы | | 
| thirdparty/jsbeans/kernel/src/main/jsb-system | Системные компоненты (бины *.jsb) и ресурсы платформы jsbeans | | 
| | |
| thirdparty/jsbeans/plugins | Проекты модулей-плагинов платформы jsbeans | | 
| thirdparty/jsbeans/plugins/web | Реализация Web сервера в платформе jsBeans | | 
| | |
| thirdparty/jsbeans/plugins/worker | Абстрактный базовый обработчик задач | | 
| thirdparty/jsbeans/plugins/workspace | Абстрактная реализация рабочего пространства пользователя | | 
| | |

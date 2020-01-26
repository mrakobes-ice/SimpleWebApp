Simple Express Web App with Webpack & Hot-Controller-Replacment

Packages (frontend):
* axios

Packages (backend):
* express
* serve-favicon

Dev dependencies:
* webpack
* webpack-cli
* webpack-dev-middleware
* webpack-dev-server
* webpack-hot-middleware
* webpack-merge

* @babel/core
* @babel/preset-env
* @babel-loader
* @babel-watch

* css-loader
* mini-css-extract-plugin
* remove-files-webpack-plugin


Description:

Это простая реализация веб-приложения основанного на Express и Webpack.
Код клиентсвой и серверной части разделен (в корне репозитория можно найти каталоги "backend" и "frontend").

Бэкенд веб-приложения описывается в виде "контроллеров" (содержащих обработчики запросов), причем здесь реализована поддержка "горячей замены" контроллеров во время разработки
(т.е. изменение в файле контроллера приводит к удалению старого экземпляра контроллера из веб-сервера, и подключение нового - примерно также, как это делает Webpack).

Запуск:

_> npm start

Сборка:

_> npm build


Веб-сервер состоит из:

* backend/WebServer.js
* backend/core/controller.js
* backend/core/controller-proxy.js

Данние файлы не желательно изменять (разве только "controller.js").
Файл "controller-proxy.js" содержит реализацию ControllerProxy - сущности, за счет которой возможна "горячая подмена" контроллеров в Express.
ControllerProxy играет роль посредника между Express и экземпляром контроллера (т.к. Express не умеет выгружать свои роутеры).

Файл "controller.js" содержит базовый класс для всех "контроллеров".
Controller является особой фабрикой экземляров "Router" - эти экземпляры содержат свойство "mountUrl" в которое при создании Controller нужно передать некоторый "Base URL",
который будет обрабатываться контроллером (этот параметр также используется для связывания контроллера с его прокси).

Примечание:

	Когда изменяется файл контроллера (в т.ч. mountURL), то новый экземпляр контроллера передается в ControllerProxy...
	Как было сказано, Express не умеет выгружать свои Middleware - по этому, в случае удаления контроллера, в его ControllerProxy передается "заглушка" (EmptyController).
	Иными словами, при удалении контроллера остаются неиспользуемые "точки входа" (но они могут быть снова задействованы, если создать контроллер с тем-же "mountUrl").	


Основная логика бэкенда должна быть сосредоточена в реализациях "контроллеров" (они-же Express Router) - размещаются в каталоге "backend/controllers/".
Логика взаимодействия со внешними сервисами (например, обработка файлов, запросы к БД и т.п.), желательно, должна выноситься в отдельные классы - сервисы (в каталоге "backend/services/").
Более общая логика может размещаться в классах, в каталоге "backend/core/".

Особых ограничений на структуру фронтенда нету...

* Файл "frontend/main.css" - главный файл стилей приложения.
* Файл "frontend/index.js" является точкой входа Webpack приложения (сюда же должны импортироваться другие модули, и файл "main.css").
* Каталог "frontend/public/" является точкой монтирования веб-приложения (клиент не сможет получить доступ к файлам за его пределами).

Файлы стилей подключаются в js файлах через обычный "import" (Webpack собирает их в отдельный бэндл).

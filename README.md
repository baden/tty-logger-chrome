magnum8-chrome-app
==================

Приложение для Chrome для программирования Magnum8 через USB-шнур.


## Установка зависимостей


### Создание (памятка)

Проект был создан с помощью [yeoman](https://github.com/yeoman/generator-chrome-extension)-генератора.

```bash
    npm install -g generator-chrome-extension
    yo chrome-extension
```

### Инструменты

Вам нужно установить Node.js а затем инструменты разработчика.
Node.js поставляется с пакет-менеджером [npm](http://npmjs.org) для установки NodeJS приложений и библиотек.
* [Установить node.js](http://nodejs.org/download/) (требуется node.js версии> = 0.8.4)
* Установите grunt-cli и модули:

```bash
    sudo npm install -g grunt-cli
```

### Установка зависимостей

```bash
    npm install
    bower install
    grunt bowerInstall
```

### Разработка


```bash
    grunt debug
```


### Сборка

```bash
    grunt
```

Только сборка, без тестирования

```bash
    grunt build
```

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var InputSurface = require('famous/surfaces/InputSurface');
    var RenderController = require('famous/views/RenderController');

    function PageView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);

        _setListeners.call(this);

    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;
    PageView.prototype.UpdateTitle = function(title) {
        this.backgroundSurface.setContent(title);
    }

    PageView.DEFAULT_OPTIONS = {
        headerSize: 44
    };

    function _createBacking() {
        var backing = new Surface({
            properties: {
                backgroundColor: 'black',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }
        });

        this.add(backing);
    }

    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(layoutModifier).add(this.layout);
    }

    function _createHeader() {
        var myTitleSurface = new Surface({
            content: 'title',
            properties: {
                backgroundColor: 'green'
            }
        });

        this.backgroundSurface = new Surface({
            properties: {
                backgroundColor: 'black'
            }
        });

        this.hamburgerSurface = new ImageSurface({
            size: [44, 44],
            content: 'img/hamburger.png'
        });

        var searchSurface = new ImageSurface({
            size: [232, 44],
            content: 'img/search.png'
        });

        var iconSurface = new ImageSurface({
            size: [44, 44],
            content: 'img/icon.png'
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.behind
        });

        var hamburgerModifier = new StateModifier({
            origin: [0, 0.5],
            align: [0, 0.5]
        });

        var searchModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
        });

        var iconModifier = new StateModifier({
            origin: [1, 0.5],
            align: [1, 0.5]
        });

        this.layout.header.add(backgroundModifier).add(this.backgroundSurface);
        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(searchModifier).add(searchSurface);
        this.layout.header.add(iconModifier).add(iconSurface);
    }

    function _createBody() {
        this.renderer = new RenderController();
        this.bodySurface = new ImageSurface({
            size: [undefined, true],
            content: 'img/body.png'
        });

        this.layout.content.add(this.renderer);
        this.renderer.show(this.bodySurface);
    }

    function _setListeners() {
        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));
        this.bodySurface.pipe(this._eventOutput);
    }

    PageView.prototype.showPage = function showPage(data) {
        // Only a simple example to show how you can build a page and show it
        // You should create a  page view and pass the data and that would be your new bodySurface
        //   like this.bodySurface = new ContentView({data: data});
        this.bodySurface = new Surface({
            size: [undefined, true],
            content: JSON.stringify(data),
            properties: {
                color: '#fff'
            }
        });
        this.renderer.show(this.bodySurface);
    }

    module.exports = PageView;
});

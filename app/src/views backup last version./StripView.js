/*** StripView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    function StripView() {
        View.apply(this, arguments);

        _createBackground.call(this);
        _createIcon.call(this);
        _createTitle.call(this);

        _createTransparentBackground.call(this);

        _setListeners.call(this);


    }

    StripView.prototype = Object.create(View.prototype);
    StripView.prototype.constructor = StripView;

    StripView.DEFAULT_OPTIONS = {
        width: 320,
        height: 55,
        angle: -0.2,
        iconSize: 32,
        iconUrl: 'img/strip-icons/famous.png',
        title: 'Famo.us',
        fontSize: 26,
    };

    function _createBackground() {
        var backgroundSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: 'grey',
                boxShadow: '0 0 1px black'

            }
        });

        var rotateModifier = new StateModifier({
            transform: Transform.rotateZ(this.options.angle)
        });

        var skewModifier = new StateModifier({
            transform: Transform.skew(0, 0, this.options.angle)
        });

        this.add(backgroundSurface);
    }

    function _createIcon() {
        var iconSurface = new ImageSurface({
            size: [this.options.iconSize, this.options.iconSize],
            content : this.options.iconUrl,
            pointerEvents : 'none'
        });

        var iconModifier = new StateModifier({
            transform: Transform.translate(24, 10, 0)
        });

        this.add(iconModifier).add(iconSurface);
    }

    function _createTitle() {
        var titleSurface = new Surface({
            size: [true, true],
            content: this.options.title,
            properties: {
                color: 'white',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.fontSize + 'px',
                textTransform: 'uppercase',
                pointerEvents : 'none'
            }
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(75, 10, 0)
        });

        this.add(titleModifier).add(titleSurface);
    }

    function _createTransparentBackground () {
        this.transparentBackground = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: 'none',
                boxShadow: '0 0 1px black'

            } 
        });

        var transparentModifier = new StateModifier({
            transform: Transform.infront
        });

        this.add(transparentModifier).add(this.transparentBackground);
    }

    function _setListeners() {
        this.transparentBackground.on('click', function() {
            this._eventOutput.emit('clickstrip', this.options.title);
            console.log('I shouted clickstrip');
        }.bind(this));

        this.transparentBackground.pipe(this._eventOutput);
    }

    module.exports = StripView;
});

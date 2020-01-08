import {
    Acceleration,
    AssetManager,
    Black,
    BlendMode,
    ColorHelper,
    ColorOverLife,
    Ease,
    Emitter,
    FloatScatter,
    FontStyle,
    FontWeight,
    GameObject,
    InitialLife,
    InitialVelocity,
    ScaleOverLife,
    Sprite,
    TextField,
    Tween
} from 'black-engine';
import particle from 'assets/textures/particle.png';
import pipeUp from 'assets/textures/Mario_pipe_up.png';
import pipeDown from 'assets/textures/Mario_pipe_down.png';

export class Game extends GameObject {
    constructor() {
        super();

        // Pick default AssetManager
        var assets = new AssetManager();

        // load images, make sure to import them first
        assets.enqueueImage('pipeDown', pipeDown);
        assets.enqueueImage('pipeUp', pipeUp);
        assets.enqueueImage('star', particle);

        // load font
        assets.enqueueGoogleFont('Titillium Web');

        // Listen for a complete message
        assets.on('complete', this.onAssetsLoadded, this);

        // Start preloading all enqueued assets
        assets.loadQueue();
    }

    onAssetsLoadded(m) {
        // Create all parts we neen and at the end of add all of them to this.add, to whit what we are working
        // Create a sprite
        const shotSprite = new Sprite('pipeDown');
        shotSprite.alignPivotOffset(0.5, 4);

        shotSprite.x = this.stage.centerX;
        shotSprite.y = this.stage.centerY + 100;

        const sprite = new Sprite('pipeUp');
        sprite.alignPivotOffset(0.5, 1);

        sprite.x = this.stage.centerX;
        sprite.y = this.stage.centerY + 200;

        // make this game object touchable so children elements can be able to receive input too
        this.touchable = true;

        // sprite also needs to be touchable
        sprite.touchable = true;
        shotSprite.touchable = true;

        // Create a emitter
        let emitter = new Emitter();
        emitter.space = this.parent;
        emitter.blendMode = BlendMode.ADD;
        emitter.x = this.stage.centerX;

        // initial parameters of out particles, physic, way to move and texture
        emitter.emitCount = new FloatScatter(10);
        emitter.emitDelay = new FloatScatter(0);
        emitter.emitInterval = new FloatScatter(0);
        emitter.emitDuration = new FloatScatter(Infinity);
        emitter.emitNumRepeats = new FloatScatter(Infinity);
        emitter.textures = [Black.assets.getTexture('star')];

        // parameters that our particles duration, velocity, where it needs to go and color
        emitter.add(new InitialLife(0.1, 0.5));
        emitter.add(new InitialVelocity(-50, 0, 50, -200));
        emitter.add(new Acceleration(0, -800, 500, 100));
        emitter.add(new ColorOverLife(0xf1e400, 0xf17500));
        emitter.add(new ScaleOverLife(new FloatScatter(1, 0, Ease.exponentialIn)));

        emitter.y = this.stage.bounds.y - 500;

        //create a Tween
        let tween = new Tween({y: [0, sprite.y - 110]}, 1, {loop: true, repeatDelay: 1});
        emitter.add(tween);

        // Tween sprite color, here we have a shooting bouncing effect that needs 3 colors
        shotSprite.color = 0xffffff;
        shotSprite.add(new Tween({color: [0xffffaa, 0xff0000, 0xffffaa]}, 0.5, {
            delay: 0,
            loop: true,
            repeatDelay: 1.5
        }, {color: ColorHelper.lerpHSV}));
        shotSprite.add(new Tween({scaleY: [1.2, 0.9, 1]}, 0.5, {delay: 0, loop: true, repeatDelay: 1.5}));
        // two different timers to have them have a nice timing
        sprite.color = 0xffffff;
        sprite.add(new Tween({color: [0xffffaa, 0xff0000, 0xffffaa]}, 0.5, {
            delay: 0.7,
            loop: true,
            repeatDelay: 1.5
        }, {color: ColorHelper.lerpHSV}));
        sprite.add(new Tween({scaleY: [1, 0.9, 1]}, 0.5, {delay: 0.69, loop: true, repeatDelay: 1.5}));

        let textField = new TextField('Black Engine v0.5.10', 'Titillium Web', 0xffffff, 15, FontStyle.NORMAL, FontWeight.BOLD);
        textField.highQuality = true;
        textField.x = this.stage.bounds.x;
        textField.y = this.stage.bounds.y;

        // Add sprite, text and emitter onto the stage
        this.add(emitter, sprite, shotSprite, textField);

        this.shotSprite = shotSprite;
        this.sprite = sprite;
        this.emitter = emitter;
        this.text = textField;

        this.stage.on('resize', this.onResize, this);
    }

    // Set up your resize logic
    onResize() {
        this.text.x = this.stage.bounds.x;
        this.text.y = this.stage.bounds.y;
    }
}

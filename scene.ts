namespace scenes {
    // frame handler priorities
    export const CONTROLLER_PRIORITY = 8;
    export const UPDATE_CONTROLLER_PRIORITY = 13;
    export const FOLLOW_SPRITE_PRIORITY = 14;
    export const PHYSICS_PRIORITY = 15;
    export const ANIMATION_UPDATE_PRIORITY = 15;
    export const CONTROLLER_SPRITES_PRIORITY = 13;
    export const UPDATE_INTERVAL_PRIORITY = 19;
    export const UPDATE_PRIORITY = 20;
    export const PRE_RENDER_UPDATE_PRIORITY = 55;
    export const RENDER_BACKGROUND_PRIORITY = 60;
    export const RENDER_SPRITES_PRIORITY = 90;
    export const RENDER_DIAGNOSTICS_PRIORITY = 150;
    export const MULTIPLAYER_SCREEN_PRIORITY = 190;
    export const UPDATE_SCREEN_PRIORITY = 200;
    export const MULTIPLAYER_POST_SCREEN_PRIORITY = 210;

    export class Scene {
        background: Background;
        camera: Camera 
        allSprites: Sprite[]
        eventContext: control.EventContext
        _millis: number
        physicsEngine: PhysicsEngine
        flags: number

        constructor(eventcontext: control.EventContext, protected previousScene?: Scene) {
            this.camera = new Camera();
            this.background = new Background(this.camera);
            this.allSprites = [];
            this.eventContext = eventcontext || control.eventContext();
            this._millis = 0;
            this.physicsEngine = new PhysicsEngine(); // ⚠ important!
            this.flags = 0; // ⚠ important!
        }


        init () {
            this.eventContext.registerFrameHandler(CONTROLLER_PRIORITY, () => {
                this._millis += this.eventContext.deltaTimeMillis;
                control.enablePerfCounter("controller_update")
                controller.__update(this.eventContext.deltaTime);
            })
            // controller update 13
            this.eventContext.registerFrameHandler(CONTROLLER_SPRITES_PRIORITY, controller._moveSprites);
            // sprite following 14
            // apply physics and collisions 15
            this.eventContext.registerFrameHandler(PHYSICS_PRIORITY, () => {
                control.enablePerfCounter("physics and collisions")
                this.physicsEngine.move(this.eventContext.deltaTime);
            });
            // user update interval 19s

            // user update 20

            // prerender update 55
            this.eventContext.registerFrameHandler(PRE_RENDER_UPDATE_PRIORITY, () => {
                const dt = this.eventContext.deltaTime;
                this.camera.update();

                // for (const s of this.allSprites)
                //     // s.__update(this.camera, dt);
            })

            // render background 60

            // render 90
            this.eventContext.registerFrameHandler(RENDER_SPRITES_PRIORITY, () => {
                control.enablePerfCounter("scene_draw");
                this.render();
            });
        }

        render() {
            // bail out from recursive or parallel call.
            if (this.flags & scene.Flag.IsRendering) return;
            this.flags |= scene.Flag.IsRendering;

            control.enablePerfCounter("render background")
            if ((this.flags & scene.Flag.SeeThrough) && this.previousScene) {
                this.previousScene.render();
            } else {
                this.background.draw();
            }

            control.enablePerfCounter("sprite sort")
            if (this.flags & scene.Flag.NeedsSorting) {
                this.allSprites.sort(function (a, b) { return a.z - b.z || a.id - b.id; })
                this.flags &= ~scene.Flag.NeedsSorting;
            }

            control.enablePerfCounter("sprite draw")
            // for (const s of this.allSprites) {
            //     s.__draw(this.camera);
            // }

            this.flags &= ~scene.Flag.IsRendering;
        }
    }

    }

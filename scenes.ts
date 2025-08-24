namespace scenes {
    /**
     * get the background image
     */

    //% blockId="gane_background_image" block="background image" weight = 95
    export function backgroundImage () {
        const backgroundImage = updated.currentScene().background
        return backgroundImage;
    }
    
    /**
     * sets the background image
     */
    //% blockId="game_set_background_image" block="set background image %image=background_image_picker" weight = 100
    export function setBackgroundImage (image: Image) {
        const backgroundImage = updated.currentScene()
        backgroundImage.background.image = image
    }

    /**
     * sets the background color
     */
      //% blockId="game_set_background_color" block="set background color %color=colorindexpicker"
      //% weight=90
    export function setBackgroundColor (color: number) {
        const scene = updated.currentScene()
        scene.background.color = color
    }
    
    /**
    *  gets a background color
    */
      //% blockId="game_background_color" block="background color %color=colorWheelPicker"
      //% weight=85
    export function backgroundColor () {
        const scene = updated.currentScene()
        return scene.background.color
    }
}

namespace updatedScene {
    let _scene = new scenes.Scene(control.pushEventContext())

    function init(forceNewScene?: boolean) {
        if (!_scene || forceNewScene) {
            _scene = new scenes.Scene(control.pushEventContext(), _scene);
        }
        _scene.init();
    }

    export function currentScene(): scenes.Scene {
        init();
        return _scene;
    }
}
// this is no longer avilable for blocks it is deprecated
namespace updated {
    let _scene: scenes.Scene;

    function init(forceNew?: boolean) {
        if (!_scene || forceNew) {
            _scene = new scenes.Scene(control.pushEventContext());
            _scene.init();
        }
    }

    export function currentScene(): scenes.Scene {
        init(); // ensure scene exists
        return _scene;
    }

    export function backgroundImage(): scenes.Background {
        return currentScene().background;
    }

    export function setBackgroundImage(img: Image) {
        currentScene().background.image = img;
    }

    export function drawScene() {
        currentScene().render();
    }
}

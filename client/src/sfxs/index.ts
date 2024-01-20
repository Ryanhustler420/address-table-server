import WinFx from './mixkit-win-game';
import LooseFx from './mixkit-lose-game';

var Sound = (function () {
    var df = document.createDocumentFragment();
    return function Sound(base64Mp3: string) {
        var snd = new Audio(base64Mp3);
        df.appendChild(snd); // keep in fragment until finished playing
        snd.addEventListener('ended', function () { df.removeChild(snd); });
        snd.play();
        return snd;
    }
}());

export var play = (win: boolean, cb: (win: boolean) => void) => {
    if (win) Sound(WinFx); else { Sound(LooseFx); cb(win) };
};

export default Sound;
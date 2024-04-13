import { Public } from '../js/_config.js';
export class Helpers {
    static start() {
        Public.startTimer = Date.now();
    }
    static done(t, m = null) {
        Public.endTimer = Date.now();
        let _default = `...done in ${Public.endTimer - Public.startTimer}ms`;
        // the result
        console.log(_default);
        // ! the result
        // if message passed show message, else show default
        document.querySelector(t).innerHTML = (null == m ? "...done" : _default);
    }
    static now(m = null) {
        let now = 0;
        if (Public.now == 0) {
            now = Date.now() - Public.startTimer;
        }
        else {
            now = Date.now() - Public.now;
        }
        Public.now = Date.now();
        let _default = `${now}ms`;
        // the result
        console.log(`${m} :: ${_default}`);
        return this;
    }
}
//# sourceMappingURL=_helpers.js.map
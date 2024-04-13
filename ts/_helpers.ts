import {Public} from '../js/_config.js'
export class Helpers
{ 
    public static start() {
        Public.startTimer = Date.now();
    }
    public static done(t:string,m:string = null)
    {
        Public.endTimer = Date.now();
        let _default:string = `...done in ${Public.endTimer - Public.startTimer}ms`;
        
        // the result
        console.log(_default);
        // ! the result
        // if message passed show message, else show default
        document.querySelector(t).innerHTML = (null == m ? "...done" : _default);
    }
    public static now(m:string = null)
    {
        let now:number = 0;

        if(Public.now == 0) {
            now = Date.now() - Public.startTimer;
        }else{
            now = Date.now() - Public.now;
        }
        Public.now = Date.now();
        let _default:string = `${now}ms`;
        // the result
        console.log(`${m} :: ${_default}`);
        return this;
    }
}
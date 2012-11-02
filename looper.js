/*
bookmarklet
javascript:(function(){var%20script=document.createElement('script');script.type='text/javascript';script.src='https://raw.github.com/deleteme/looper.js/master/looper.js'+(new%20Date().getTime());document.getElementsByTagName('body')[0].appendChild(script);})()

usage:

    var looper = new Looper({
        times: 100, interval: 1000
    });

    looper
        .add(function(){ $("#logo").click(); },
            function(){ $("#page").click(); })
        .start();

*/

var Looper = function(options){
    // the index of the next callback
    this.stepCount = 0;
    // the current loop count
    this.count = 0;
    // the number of times to loop
    this.times = options && 'times' in options ? options.times : 25;
    // how long in ms it takes to loop
    this.interval = options && 'interval' in options ? options.interval : 800;
    this.periodic = undefined;
    this.callbacks = options && 'callbacks' in options ? options.callbacks : [];
    return this;
};

Looper.prototype = {
    add: function(f){
        this.callbacks.push.apply(this.callbacks, arguments);
        return this;
    },
    remove: function(f){
        var reduced = [];
        for (var i = 0, argumentsLength = arguments.length; i < argumentsLength; i++){
            while (this.has(arguments[i]))
                this.callbacks = Looper._remove(this.callbacks, arguments[i]);
        }
        this.callbacks = reduced;
        return this;
    },
    has: function(f){
        var match = false;
        for (var i = 0, l = this.callbacks.length; i < l; i++){
            match = this.callbacks[i] === f;
            if (match) break;
        }
        return match;
    },
    start: function(){
        var _this = this;
        if (this.periodic) this.stop();
        this.count = 0;
        if (this.callbacks.length){
            this.callbacks[this.stepCount](this.count);
            this.stepCount += 1;
            this.periodic = setInterval(function(){
                if (_this.count < _this.times){
                    if (_this.callbacks[_this.stepCount]){
                        _this.callbacks[_this.stepCount](_this.count);
                        _this.stepCount += 1;
                    }
                    if (_this.stepCount >= _this.callbacks.length){
                        _this.stepCount = 0;
                        _this.count += 1;
                    }
                } else {
                    _this.stop().done();
                }

            }, this.interval / this.callbacks.length);
        }
        return this;
    },
    stop: function(){
        clearInterval(this.periodic);
        this.periodic = undefined;
        return this;
    },
    done: function(f){
        if (f) this._doneCallback = f;
        else if (this._doneCallback) this._doneCallback();
        return this;
    },
    empty: function(){
        this.callbacks = [];
        return this;
    }
};

Looper._remove = function(array, value){
    var reduced = [];
    for (var i = 0, l = array.length; i < l; i++){
        if (array[i] !== value){
            reduced.push(array[i]);
        }
    }
    return reduced;
};

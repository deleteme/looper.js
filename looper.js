/*
bookmarklet
javascript:(function(){var%20script=document.createElement('script');script.type='text/javascript';script.src='https://raw.github.com/deleteme/looper.js/master/looper.js?'+(new%20Date().getTime());document.getElementsByTagName('body')[0].appendChild(script);})()

usage:

    var looper = new Looper({
        times: 100, interval: 1000
    });

    looper
        .add(function(){ $("#logo").click(); },
            function(){ $("#page").click(); })
        .start();

*/

/*
var cycle = [
  function(){}
  ,function(){}
  ,function(){}
  ,function(){}
  ,function(){}
];

var sequence = Looper(cycle);

//  sequence.times + ' cycles', sequence._duration + 'ms';

sequence.runs = 153;
sequence.duration = 15300;

sequence();
*/




var looper = function(sequence, options){
    var runs = options && options.runs ? options.runs : 25;
    var duration = options && options.duration ? options.duration : 15000;
    var _looper = function (){
        var runDuration = duration / runs;
        console.profile('Looper');

        
        console.profileEnd('Looper');
        return sequence.reduce(Q.when, Q());
    }
    function render(progress){
      loop.progress = progress;
    }
    render(0);
    return _looper;
};



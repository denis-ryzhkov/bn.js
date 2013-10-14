/*
Lightweight profiling tool to detect performance BottleNecks in JavaScript code.

Hence the name: bn - BottleNeck.  
And you know keys B and N are very comfortable to type quickly in a row.

It was created to address the next issues of builtin MongoDB profiler:
* Just abstract ops with no reference to lines of code.
* No simple way to aggregate time spent for an op repeated N times.

However bn() is not bound to MongoDB  
and may be used in any (reasonably modern) JS environment.

See test() for usage examples - https://github.com/denis-ryzhkov/bn.js/blob/master/bn.js#L116

JS "bn" is an improved port of Python "bn" tool:  
https://github.com/denis-ryzhkov/bn

bn.js version 0.1.0  
https://github.com/denis-ryzhkov/bn.js  
Copyright (C) 2013 by Denis Ryzhkov <denisr@denisr.com>  
MIT License, see http://opensource.org/licenses/MIT
*/

//// Bn

var Bn = function(total_key) {

    //// State.

    var s, m, k; // Stats, Millis, Key.

    //// bn

    var bn = function(key) {
        var now = +new Date();
        if (k)
            s[k] = (s[k] || 0) + now - m;
        m = now;
        k = key;
    };

    //// reset

    bn.reset = function() {
        s = {};
        m = k = undefined;
    };
    bn.reset();

    //// report_json

    bn.report_json = function() {
        bn();
        var stats = [], key, millis, total = 0;
        for (key in s) {
            millis = s[key];
            stats.push({key: key, millis: millis});
            total += millis;
        };
        stats.forEach(function(stat) {
            stat.percent = 100 * stat.millis / total;
        });
        stats.sort(function(a, b) {
            return a.millis < b.millis;
        });
        stats.push({key: total_key || 'TOTAL', millis: total, percent: 100});
        return stats;
    };

    //// report_text

    bn.report_text = function() {
        var stats = bn.report_json();
        var text = ['Key\tMillis\t%'];
        stats.forEach(function(stat) {
            text.push([stat.key, stat.millis, stat.percent].join('\t'));
        });
        return text.join('\n');
    };

    return bn;
};

//// bn

var bn = Bn();

//// test

var test = function() {

    var i, j;

    //// Test 1: Incorrect usage.

    // This test shows that relatively small overhead from profiling
    // (about 0.006 milliseconds per bn() on my computer)
    // may take 99% of time given just 1M iterations,
    // compared to the same 1M iterations and nothing inside.

    bn('outside');
    for (i = 0; i < 1000000; i++);

    for (i = 0; i < 1000000; i++)
        bn('inside');

    print(bn.report_text()); // print() is defined in MongoDB, but bn() can be used in any JS env.
    /*
        Key	Millis	%
        inside	6512	99.69381506429883
        outside	20	0.3061849357011635
        TOTAL	6532	100
    */

    //// Test 2: Correct usage.

    // In this test bn() is used to compare parts of the iteration,
    // and it shows expected results.

    bn.reset();

    bn('outside');
    for (i = 0; i < 1000; i++) {
        bn('1000');
        for (j = 0; j < 1000; j++)
            new Date();
        bn('10');
        for (j = 0; j < 10; j++)
            new Date();
        bn('outside');
    };

    print(bn.report_text());
    /*
        Key	Millis	%
        1000	4312	98.67276887871853
        10	39	0.8924485125858124
        outside	19	0.43478260869565216
        TOTAL	4370	100
    */
};

//test();

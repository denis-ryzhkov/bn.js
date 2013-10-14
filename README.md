bn.js
=====

Lightweight profiling tool to detect performance BottleNecks in JavaScript code.

Hence the name: bn - BottleNeck.  
And you know keys B and N are very comfortable to type quickly in a row.

It was created to address the next issues of builtin MongoDB profiler:
* Just abstract ops with no reference to lines of code.
* No simple way to aggregate time spent for an op repeated N times.

However bn() is not bound to MongoDB  
and may be used in any (reasonably modern) JS environment.

Usage:

    See test().

JS "bn" is an improved port of Python "bn" tool:  
https://github.com/denis-ryzhkov/bn

bn.js version 0.1.0  
https://github.com/denis-ryzhkov/bn.js  
Copyright (C) 2013 by Denis Ryzhkov <denisr@denisr.com>  
MIT License, see http://opensource.org/licenses/MIT

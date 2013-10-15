#!/bin/bash

if [ ! -f /usr/local/bin/closure-compiler.jar ]
then
    mkdir /tmp/closure-compiler
    wget http://closure-compiler.googlecode.com/files/compiler-latest.zip -O /tmp/closure-compiler/compiler-latest.zip
    unzip /tmp/closure-compiler/compiler-latest.zip -d /tmp/closure-compiler
    sudo mv /tmp/closure-compiler/compiler.jar /usr/local/bin/closure-compiler.jar
    rm -rf /tmp/closure-compiler
fi

echo '// bn.js version 0.1.2. See https://github.com/denis-ryzhkov/bn.js' > bn.min.js
java -jar /usr/local/bin/closure-compiler.jar --charset UTF-8 --compilation_level SIMPLE_OPTIMIZATIONS --js bn.js | perl -pe 's/,test.*/;/' >> bn.min.js

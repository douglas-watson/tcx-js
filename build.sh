#!/bin/bash

# Build/transpile the *.ts code into .js
# Chris Joakim, 2019/07/26

echo 'removing output files...'
rm dist/*.*

echo 'compiling the merge program...'
./node_modules/.bin/tsc --build tsconfig-merge.json

echo 'executing the merge program...'
node dist/merge.js src/tcx.ts

echo 'compiling after merge...'
./node_modules/.bin/tsc

echo 'src dir:'
ls -al src/

echo 'dist dir:'
ls -al dist/

echo 'done'

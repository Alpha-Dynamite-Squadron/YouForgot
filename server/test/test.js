var should = require('should');
var depcheck = require('depcheck');


describe('Initial Test', function() { 
    it('is running', function() {
        true.should.equal(true);
    });
});

describe('Dependency Check Test', function() { 
    it('is running', function() {
        const options = {
            ignoreBinPackage: false, // ignore the packages with bin entry
            skipMissing: false, // skip calculation of missing dependencies
            ignorePatterns: [
              // files matching these patterns will be ignored
              'sandbox',
              'dist',
              'bower_components',
            ],
            ignoreMatches: [
              // ignore dependencies that matches these globs
              'grunt-*',
            ],
            parsers: {
              // the target parsers
              '*.js': depcheck.parser.es6,
              '*.jsx': depcheck.parser.jsx,
            },
            detectors: [
              // the target detectors
              depcheck.detector.requireCallExpression,
              depcheck.detector.importDeclaration,
            ],
            specials: [
              // the target special parsers
              depcheck.special.eslint,
              depcheck.special.webpack,
            ],
          };
        depcheck(process.cwd(), options, (unused) => {
           
            let isEmpty = false;
            if(JSON.stringify(unused.missing) == JSON.stringify({})){
                isEmpty = true;
            }else{
                console.log(unused.missing);
            }
            isEmpty.should.equal(true);
          });
    });
});
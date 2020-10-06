// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

//There is no typing for `__karma__` so it is declared as any
declare const __karma__: any;
declare const require: any;

//Prevent Karma from running prematurely
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
console.log('Finding Tests...');
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
console.log('Loading Modules...');
context.keys().map(context);
//Start Karma to run the tests.
console.log('Starting Karma...');
__karma__.start();

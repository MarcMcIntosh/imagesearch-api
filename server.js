"use strict";
require('dotenv').config();
const ImagesClient = require('google-images');
let client = new ImagesClient('CSE ID', process.env.CSE_ID );


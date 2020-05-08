// Unit tests for class Parser
// Chris Joakim, 2019/07/29

const fs = require('fs');
const assert = require('assert');
const chai   = require('chai');
const chaiAlmost = require('chai-almost');
const expect = chai.expect
const Parser = require('../dist/tcx.js').Parser;

//chai.use(chaiAlmost());
chai.use(chaiAlmost(0.00000001));

pkg = require('../package.json');

describe('Parser', function() {

  describe('#constructor()', function() {

    it('defines a VERSION', function() {
      chai.assert.isTrue(Parser.VERSION === '1.0.1', 'Parser.VERSION should be 1.0.1');
    });

    it('It should return the correct value for file activity_twin_cities_marathon.tcx', function() {
      var infile = 'data/activity_twin_cities_marathon.tcx'
      var parser = new Parser(infile);

      activity = parser.activity;
      author = activity.author;
      creator = activity.creator;
      trackpoints = activity.trackpoints;

      expect(activity.sport).to.equal('Running');
      expect(activity.activityId).to.equal('2014-10-05T13:07:53.000Z');

      expect(creator.name).to.equal('Garmin Forerunner 620');
      expect(creator.unit_id).to.equal('3875991210');
      expect(creator.product_id).to.equal('1623');
      expect(creator.version_major).to.equal('3');
      expect(creator.version_minor).to.equal('0');
      expect(creator.build_major).to.equal('0');
      expect(creator.build_minor).to.equal('0');

      expect(author.name).to.equal('Garmin Connect API');
      expect(author.version_major).to.equal('14');
      expect(author.version_minor).to.equal('10');
      expect(author.build_major).to.equal('0');
      expect(author.build_minor).to.equal('0');
      expect(author.lang).to.equal('en');
      expect(author.part_number).to.equal('006-D2449-00');

      expect(trackpoints.length).to.equal(2256);

      var t = trackpoints[0];
      // console.log(JSON.stringify(t, null, 2));
      // console.log(JSON.stringify(t.location));
      expect(t.seq).to.equal(1);
      expect(t.doctype).to.equal('trackpoint');
      expect(t.time).to.equal('2014-10-05T13:07:53.000Z');
      expect(t.latitude).to.be.almost(44.97431952506304);
      expect(t.longitude).to.be.almost(-93.26310088858008);
      expect(t.altitude_meters).to.be.almost(257.0);
      expect(t.altitude_feet).to.be.almost(843.1758530183727);
      expect(t.distance_meters).to.be.almost(0.0);
      expect(t.distance_km).to.be.almost(0.0);
      expect(t.distance_miles).to.be.almost(0.0);
      expect(t.distance_yds).to.be.almost(0.0);
      expect(t.heart_rate_bpm).to.be.almost(85.0);
      expect(t.cadence).to.be.almost(89.0);
      expect(t.speed).to.be.almost(0.0);
      expect(t.elapsed_sec).to.be.almost(0.0);
      expect(t.elapsed_hhmmss).to.equal('00:00:00');
      expect(t.epoch_ms).to.be.almost(1412514473000.0);
      expect(t.watts).to.equal(null);
      expect(JSON.stringify(t.location)).to.equal('{"type":"Point","coordinates":[-93.26310088858008,44.97431952506304]}');
      // {
      //   "doctype": "trackpoint",
      //   "time": "2014-10-05T13:07:53.000Z",
      //   "seq": 1,
      //   "latitude": 44.97431952506304,
      //   "longitude": -93.26310088858008,
      //   "altitude_meters": 257,
      //   "altitude_feet": 843.1758530183727,
      //   "distance_meters": 0,
      //   "distance_miles": 0,
      //   "distance_km": 0,
      //   "distance_yds": 0,
      //   "heart_rate_bpm": 85,
      //   "speed": 0,
      //   "cadence": 89,
      //   "watts": null,
      //   "location": {
      //     "type": "Point",
      //     "coordinates": [
      //       -93.26310088858008,
      //       44.97431952506304
      //     ]
      //   },
      //   "elapsed_sec": 0,
      //   "elapsed_hhmmss": "00:00:00",
      //   "epoch_ms": 1412514473000
      // }

      t = trackpoints[2255];
      // console.log(JSON.stringify(t, null, 2));
      // console.log(JSON.stringify(t.location));
      expect(t.seq).to.equal(2256);
      expect(t.doctype).to.equal('trackpoint');
      expect(t.time).to.equal('2014-10-05T17:22:17.000Z');
      expect(t.latitude).to.be.almost(44.95180849917233);
      expect(t.longitude).to.be.almost(-93.10493202880025);
      expect(t.altitude_meters).to.be.almost(260.0);
      expect(t.altitude_feet).to.be.almost(853.018372703412);
      expect(t.distance_meters).to.be.almost(42635.44921875);
      expect(t.distance_km).to.be.almost(42.63544921875);
      expect(t.distance_miles).to.be.almost(26.492439912628996);
      expect(t.distance_yds).to.be.almost(46626.69424622703);
      expect(t.heart_rate_bpm).to.be.almost(161.0);
      expect(t.cadence).to.be.almost(77.0);
      expect(t.speed).to.be.almost(3.5460000038146977);
      expect(t.elapsed_sec).to.be.almost(15264.0);
      expect(t.elapsed_hhmmss).to.equal('04:14:24');
      expect(t.epoch_ms).to.be.almost(1412529737000.0);
      expect(t.watts).to.equal(null);
      expect(JSON.stringify(t.location)).to.equal('{"type":"Point","coordinates":[-93.10493202880025,44.95180849917233]}');
      // {
      //   "doctype": "trackpoint",
      //   "time": "2014-10-05T17:22:17.000Z",
      //   "seq": 2256,
      //   "latitude": 44.95180849917233,
      //   "longitude": -93.10493202880025,
      //   "altitude_meters": 260,
      //   "altitude_feet": 853.018372703412,
      //   "distance_meters": 42635.44921875,
      //   "distance_miles": 26.492439912628996,
      //   "distance_km": 42.63544921875,
      //   "distance_yds": 46626.69424622703,
      //   "heart_rate_bpm": 161,
      //   "speed": 3.5460000038146977,
      //   "cadence": 77,
      //   "watts": null,
      //   "location": {
      //     "type": "Point",
      //     "coordinates": [
      //       -93.10493202880025,
      //       44.95180849917233
      //     ]
      //   },
      //   "elapsed_sec": 15264,
      //   "elapsed_hhmmss": "04:14:24",
      //   "epoch_ms": 1412529737000
      // }
    });

    it('It should return the correct value for file alex_bike_outside.tcx', function() {
      var infile = 'data/alex_bike_outside_pretty.tcx'
      var parser = new Parser(infile);

      activity = parser.activity;
      author = activity.author;
      creator = activity.creator;
      trackpoints = activity.trackpoints;

      expect(activity.sport).to.equal('Biking');
      expect(activity.activityId).to.equal('2018-07-29T07:34:11Z');

      expect(author.name).to.equal('FitnessSyncer.com');
      expect(author.version_major).to.equal('1');
      expect(author.version_minor).to.equal('0');
      expect(author.build_major).to.equal('0');
      expect(author.build_minor).to.equal('0');
      expect(author.lang).to.equal('en');
      expect(author.part_number).to.equal('000-00000-00');

      expect(trackpoints.length).to.equal(3916);

      var t = trackpoints[0];
      // console.log(JSON.stringify(t, null, 2));
      // console.log(JSON.stringify(t.location));
      expect(t.seq).to.equal(1);
      expect(t.doctype).to.equal('trackpoint');
      expect(t.time).to.equal('2018-07-29T07:34:11Z');
      expect(t.latitude).to.be.almost(51.789205);
      expect(t.longitude).to.be.almost(19.47338);
      expect(t.altitude_meters).to.be.almost(212.0);
      expect(t.altitude_feet).to.be.almost(695.538057742782);
      expect(t.distance_meters).to.be.almost(4.0);
      expect(t.distance_km).to.be.almost(0.004);
      expect(t.distance_miles).to.be.almost(0.0024854847689493357);
      expect(t.distance_yds).to.be.almost(4.37445319335083);
      expect(t.heart_rate_bpm).to.be.almost(105.0);
      expect(t.cadence).to.be.almost(114.0);
      expect(t.speed).to.equal(null);
      expect(t.elapsed_sec).to.be.almost(0.0);
      expect(t.elapsed_hhmmss).to.equal('00:00:00');
      expect(t.epoch_ms).to.be.almost(1532849651000.0);
      expect(t.watts).to.equal(null);
      expect(JSON.stringify(t.location)).to.equal('{"type":"Point","coordinates":[19.47338,51.789205]}');
      // {
      //   "doctype": "trackpoint",
      //   "time": "2018-07-29T07:34:11Z",
      //   "seq": 1,
      //   "latitude": 51.789205,
      //   "longitude": 19.47338,
      //   "altitude_meters": 212,
      //   "altitude_feet": 695.538057742782,
      //   "distance_meters": 4,
      //   "distance_miles": 0.0024854847689493357,
      //   "distance_km": 0.004,
      //   "distance_yds": 4.37445319335083,
      //   "heart_rate_bpm": 105,
      //   "speed": null,
      //   "cadence": 114,
      //   "watts": null,
      //   "location": {
      //     "type": "Point",
      //     "coordinates": [
      //       19.47338,
      //       51.789205
      //     ]
      //   },
      //   "elapsed_sec": 0,
      //   "elapsed_hhmmss": "00:00:00",
      //   "epoch_ms": 1532849651000
      // }
      // {"type":"Point","coordinates":[19.47338,51.789205]}

      var t = trackpoints[3915];
      // console.log(JSON.stringify(t, null, 2));
      // console.log(JSON.stringify(t.location));
      expect(t.seq).to.equal(3916);
      expect(t.doctype).to.equal('trackpoint');
      expect(t.time).to.equal('2018-07-29T09:27:47Z');
      expect(t.latitude).to.be.almost(51.791208);
      expect(t.longitude).to.be.almost(19.47392);
      expect(t.altitude_meters).to.be.almost(215.6);
      expect(t.altitude_feet).to.be.almost(707.3490813648293);
      expect(t.distance_meters).to.be.almost(15513.0);
      expect(t.distance_km).to.be.almost(15.513);
      expect(t.distance_miles).to.be.almost(9.63933130517776);
      expect(t.distance_yds).to.be.almost(16965.22309711286);
      expect(t.heart_rate_bpm).to.be.almost(124.0);
      expect(t.cadence).to.equal(null);
      expect(t.speed).to.equal(null);
      expect(t.elapsed_sec).to.be.almost(6816.0);
      expect(t.elapsed_hhmmss).to.equal('01:53:36');
      expect(t.epoch_ms).to.be.almost(1532856467000.0);
      expect(t.watts).to.equal(null);
      expect(JSON.stringify(t.location)).to.equal('{"type":"Point","coordinates":[19.47392,51.791208]}');
      // {
      //   "doctype": "trackpoint",
      //   "time": "2018-07-29T09:27:47Z",
      //   "seq": 3916,
      //   "latitude": 51.791208,
      //   "longitude": 19.47392,
      //   "altitude_meters": 215.6,
      //   "altitude_feet": 707.3490813648293,
      //   "distance_meters": 15513,
      //   "distance_miles": 9.63933130517776,
      //   "distance_km": 15.513,
      //   "distance_yds": 16965.22309711286,
      //   "heart_rate_bpm": 124,
      //   "speed": null,
      //   "cadence": null,
      //   "watts": null,
      //   "location": {
      //     "type": "Point",
      //     "coordinates": [
      //       19.47392,
      //       51.791208
      //     ]
      //   },
      //   "elapsed_sec": 6816,
      //   "elapsed_hhmmss": "01:53:36",
      //   "epoch_ms": 1532856467000
      // }
      // {"type":"Point","coordinates":[19.47392,51.791208]}

      // Check Watts, not every trackpoint has this data
      var firstWatt = -1;
      var hightestWatts = -1;
      var lastWatts = -1;
      for (var i = 0; i < trackpoints.length; i++) {
        var tkpt = trackpoints[i];
        if (tkpt.watts !== null) {
          if (firstWatt < 0) {
            firstWatt = tkpt.watts;
          }
          if (tkpt.watts > hightestWatts) {
            hightestWatts = tkpt.watts;
          }
          lastWatts = tkpt.watts;
        }
      }
      //console.log('' + firstWatt + ',' + hightestWatts + ',' + lastWatts);  // 17,957,16
      expect(firstWatt).to.be.almost(17.0);
      expect(hightestWatts).to.be.almost(957.0);
      expect(lastWatts).to.be.almost(16.0);
    });

    it('It should return the correct values when given text contents of alex_bike_outside.tcx', function() {
      var infile = 'data/alex_bike_outside_pretty.tcx';
      let tcx_xml_data = fs.readFileSync(infile, 'utf8');

      var parser = new Parser('fakename.tcx', tcx_xml_data);

      activity = parser.activity;
      author = activity.author;
      creator = activity.creator;
      trackpoints = activity.trackpoints;

      expect(activity.sport).to.equal('Biking');
      expect(activity.activityId).to.equal('2018-07-29T07:34:11Z');

      expect(author.name).to.equal('FitnessSyncer.com');
    });
    

  });

});


// mocha --require mocha-junit-reporter --reporter mocha-junit-reporter --reporter-options configFile=mocha.opts
// nyc --reporter=cobertura --reporter=html ./node_modules/.bin/mocha tests/**/*.js --reporter mocha-junit-reporter --reporter-options mochaFile=./TEST-RESULTS.xml"


// mocha --opts mocha.opts --reporter mocha-junit-reporter --reporter-options configFile=mocha.opts

// npx mocha --reporter mocha-multi-reporters --reporter-options mochaFile=./test-results.xml

// mocha --reporter mocha-multi-reporters --reporter-options configFile=config.json

import * as fs from "fs";
import * as xml2js from "xml2js";

// tcx-js npm library, by Chris Joakim, 2019/07/29


// Instances of this class represent a Timestamp from a string value
// like "2014-10-05T17:10:36.000Z" from a Garmin device.

export class Timestamp {

    public time_str: string;
    public date: Date = new Date();
    public epochMilliseconds : number = 0;

    public constructor(time_str: string) {
        //  time_str is a value like "2014-10-05T17:10:36.000Z" from the Garmin device
        this.time_str = time_str;

        try {
            this.date = new Date(time_str);
            this.epochMilliseconds = this.date.getTime();
        }
        catch(e) {
            console.log(e);
        }
    }

    public isValid() {
        return this.epochMilliseconds > 0;
    }

    public toString() : string {
        return "Timestamp: " + this.isValid() + ", " + this.time_str + ", " + this.date + ", " + this.epochMilliseconds;
    }

}


// This class is used to create a human-readable HH:MM:SS elapsed time string
// from an elapsed time value in milliseconds.

export class ElapsedTime {

    public static get MILLISECONDS_PER_SECOND(): number  { return 1000.0; }
    public static get SECONDS_PER_HOUR():   number  { return 3600.0; }
    public static get SECONDS_PER_MINUTE(): number  { return 60.0; }

    public elapsedMs: number;
    public secs: number = 0;
    public hh: number = 0;
    public mm: number = 0;
    public ss: number = 0;

    public constructor(elapsedMs: number) {
        this.elapsedMs = Math.abs(elapsedMs);
        this.secs = Math.round(this.elapsedMs / ElapsedTime.MILLISECONDS_PER_SECOND);

        this.hh = Math.floor(this.secs / ElapsedTime.SECONDS_PER_HOUR);
        let rem = this.secs - (this.hh * ElapsedTime.SECONDS_PER_HOUR);
        this.mm = Math.floor(rem / 60.0);
        this.ss = rem - (this.mm * 60.0)

        if (this.mm > 59) {
            console.log("ElapsedTime mm normalized to 59 - " + this.mm);
            this.mm = 59;
        }
        if (this.ss > 59) {
            console.log("ElapsedTime ss normalized to 59 - " + this.ss);
            this.ss = 59;
        }
    }

    public asHHMMSS() : string {
        return this.zeroPad(this.hh) + ":" + this.zeroPad(this.mm) + ":" + this.zeroPad(this.ss);
    }

    private zeroPad(i : number) : string {
        if (i < 10) {
            return "0" + i;
        }
        else {
            return "" + i;
        }
    }

}


export class GeoJsonLocation {

    public type:         string = 'Point';
    public coordinates:  number[];

    public constructor(latitude: number, longitude: number) {
        this.coordinates = [longitude, latitude];
    }

}


// Instances of this class represent one of the many Trackpoints in a Garmin TCX Activity.

export class Trackpoint {

    public static get DEFAULT_EPOCH_TIMESTAMP_STRING(): string  { return "1970-01-01T00:00:00.000Z"; }
    public static get MILES_PER_KILOMETER(): number  { return 0.621371192237334; }
    public static get YARDS_PER_MILE():   number  { return 1760.0; }
    public static get FEET_PER_METER(): number  { return 3.280839895013123; }

    public doctype:         string = 'trackpoint';
    public time:            string | null = null;
    public seq:             number | null = null;
    public latitude:        number | null = 0; 
    public longitude:       number | null = 0;
    public altitude_meters: number | null = null;
    public altitude_feet:   number | null = null;
    public distance_meters: number | null = 0;
    public distance_miles:  number | null = null;
    public distance_km:     number | null = null;
    public distance_yds:    number | null = null;
    public heart_rate_bpm:  number | null = null;
    public speed:           number | null = null;
    public cadence:         number | null = null;  // either running or cycling
    public watts:           number | null = null; 
    public location:        GeoJsonLocation | null = null;
    public elapsed_sec:     number | null = null;
    public elapsed_hhmmss:  string | null = null;
    public epoch_ms: number = -1;

    public constructor(raw_obj : JsonObject, sequence : number) {
        this.seq = sequence;
        this.epoch_ms = -1;
        let keys : string[] = Object.keys(raw_obj);

        if (keys.includes("Time")) {
            this.time = <string> raw_obj["Time"];
        }
        else {
            this.time = Trackpoint.DEFAULT_EPOCH_TIMESTAMP_STRING;
        }

        try {
            let ts = new Timestamp(this.time);
            this.epoch_ms = ts.epochMilliseconds;
        }
        catch(e) {
            console.log(e);
        }

        if (keys.includes("Position")) {
            try {
                let position : JsonObject = <JsonObject> raw_obj["Position"];
                this.latitude  = Number(position["LatitudeDegrees"]);
                this.longitude = Number(position["LongitudeDegrees"]);
            }
            catch(e) {
                console.log(e);
            }
        }
        if (keys.includes("AltitudeMeters")) {
            this.altitude_meters = Number(raw_obj["AltitudeMeters"]);
        }
        if (keys.includes("DistanceMeters")) {
            this.distance_meters = Number(raw_obj["DistanceMeters"]);
        }
        if (keys.includes("HeartRateBpm")) {
            try {
                let hr : JsonObject = <JsonObject> raw_obj["HeartRateBpm"];
                this.heart_rate_bpm = Number(hr["Value"]);
            }
            catch(e) {
                console.log(e);
            }
        }
        if (keys.includes("Cadence")) {
            this.cadence = Number(raw_obj["Cadence"]);
        }
        if (keys.includes("Extensions")) {
            try {
                let ext : JsonObject = <JsonObject> raw_obj["Extensions"];
                let ext_keys : string[] = Object.keys(ext);
                if (ext_keys.includes("TPX")) {
                    let tpx = <JsonObject> ext["TPX"];
                    let tpx_keys : string[] = Object.keys(tpx);
                    if (tpx_keys.includes("Speed")) {
                        this.speed = Number(tpx["Speed"]);
                    }
                    if (tpx_keys.includes("RunCadence")) {
                        this.cadence = Number(tpx["RunCadence"]);
                    }
                    if (tpx_keys.includes("Watts")) {
                        this.watts = Number(tpx["Watts"]);
                    }
                }
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    public addAltitudeFeet() : void {
        if (this.altitude_meters) {
            try {
                this.altitude_meters = Number(this.altitude_meters);
                this.altitude_feet = this.altitude_meters * Trackpoint.FEET_PER_METER;
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    public addDistances() : void {
        if (this.distance_meters !== null) {
            try {
                this.distance_km    = this.distance_meters / 1000.0;
                this.distance_miles = this.distance_km * Trackpoint.MILES_PER_KILOMETER;
                this.distance_yds   = this.distance_miles * Trackpoint.YARDS_PER_MILE;
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    public calculateElapsed(startingEpoch: number) : void {
        let elapsedMs = this.epoch_ms - startingEpoch;
        let et : ElapsedTime = new ElapsedTime(elapsedMs);
        this.elapsed_sec = et.secs;
        this.elapsed_hhmmss = et.asHHMMSS();
    }

    public addGeoJson() : void {
        try {
            let lat = <number> this.latitude;
            let lng = <number> this.longitude;
            this.location = new GeoJsonLocation(lat, lng);
        }
        catch(e) {
            console.log(e);
        }
    }

    public cleanup() : void {

    }
}


export class Author {

    public type:          string = 'Author';
    public name:          string = '';
    public part_number:   string = '';
    public lang:          string = '';
    public build_major:   string = '';
    public build_minor:   string = '';
    public version_major: string = '';
    public version_minor: string = '';

    public constructor(raw_obj: JsonObject | null) {

        if (raw_obj !== null) {
            this.name = <string> raw_obj["Name"];
            this.lang = <string> raw_obj["LangID"];
            this.part_number = <string> raw_obj["PartNumber"];
    
            let build : JsonObject = <JsonObject> raw_obj["Build"];
            let vers  : JsonObject = <JsonObject> build["Version"];
            this.version_major = <string> vers["VersionMajor"];
            this.version_minor = <string> vers["VersionMinor"];
            this.build_major   = <string> vers["BuildMajor"];
            this.build_minor   = <string> vers["BuildMinor"];
        }
    }
}


export class Creator {

    public type:          string = 'Creator';
    public name:          string = '';
    public product_id:    string = '';
    public unit_id:       string = '';
    public build_major:   string = '';
    public build_minor:   string = '';
    public version_major: string = '';
    public version_minor: string = '';

    public constructor(raw_obj: JsonObject | null) {

        if (raw_obj !== null) {
            this.name    = <string> raw_obj["Name"];
            this.unit_id = <string> raw_obj["UnitId"];
            this.product_id = <string> raw_obj["ProductID"];
    
            let vers : JsonObject = <JsonObject> raw_obj["Version"];
            this.version_major = <string> vers["VersionMajor"];
            this.version_minor = <string> vers["VersionMinor"];
            this.build_major   = <string> vers["BuildMajor"];
            this.build_minor   = <string> vers["BuildMinor"];
        }
    }

}


// Instances of this class represent the aggregated data from one TCX file,
// and its Activity XML tag.

export class Activity {

    public tcx_filename : string = "";
    public activityId: string = "";
    public sport: string = "";
    public author: Author;
    public creator: Creator;
    public trackpoints: Trackpoint[] = new Array<Trackpoint>();
    public firstTrackpoint : Trackpoint | null = new Trackpoint({}, 0);
    public startingEpoch : number = 0;
    public parsedDate : string = new Date().toISOString();

    public constructor() {
        this.sport   = "";
        this.author  = new Author(null);
        this.creator = new Creator(null);
    }

    public addTrackpoint(tkpt: Trackpoint) {
        this.trackpoints.push(tkpt);
        if (this.trackpoints.length === 1) {
            this.firstTrackpoint = tkpt;
            this.startingEpoch = tkpt.epoch_ms;
        }
    }

}


// This is the primary object in tcx-js, class Parser.

export interface Options {
    [key: string]: any
}

export type JsonValue = boolean | number | string | JsonObject | JsonArray;

export interface JsonArray extends Array<JsonValue> {}

export interface JsonObject {
    [k: string]: JsonValue
}

export const json: JsonObject = {}

export class Parser {

    public static get VERSION(): string  { return "1.0.1"; }

    public activity : Activity = new Activity();
    public tcx_filename: string = '';

    public constructor(infile: string, tcx_xml_str?: string) {
        this.tcx_filename = infile;
        this.activity.tcx_filename = infile;
        if ( !tcx_xml_str ) {
            tcx_xml_str = fs.readFileSync(infile).toString();
        }
        let root_obj : JsonObject = <JsonObject> this.convertXmlToJson(tcx_xml_str);
        let tcdb : JsonObject = <JsonObject> root_obj["TrainingCenterDatabase"];
        let tcdb_file = this.tcx_filename + ".json";

        // console.log(JSON.stringify(root_obj));
        // var epoch = new Date().getTime();
        // fs.writeFileSync('tmp/' + epoch + '.json', JSON.stringify(root_obj, null, 2))

        let activities : JsonObject = <JsonObject> tcdb["Activities"];
        let activity : JsonObject   = <JsonObject> activities["Activity"];
        this.activity.activityId = <string> activity["Id"];

        try {
            let activityDollar : JsonObject = <JsonObject> activity["$"];
            this.activity.sport = <string> activityDollar["Sport"];
        }
        catch(e) {
            console.log(e);
        }

        try {
            let author_data : JsonObject = <JsonObject> tcdb["Author"];
            this.activity.author = new Author(author_data);
        }
        catch(e) {
            //console.log(e);
        }

        try {
            let creator_data : JsonObject = <JsonObject> activity["Creator"];
            this.activity.creator = new Creator(creator_data);
        }
        catch(e) {
            //console.log(e);
        }

        let lapObj : JsonValue  = <JsonValue> activity["Lap"];  // could be an Array, or not
        let tkpt_seq = 0;

        if (Array.isArray(lapObj)) {
            let laps : JsonArray  = <JsonArray> activity["Lap"];
            let lap_count : number  = laps.length;
            for (var i = 0; i < lap_count; i++) {
                let curr_lap   : JsonObject = <JsonObject> laps[i];
                let curr_track : JsonObject = <JsonObject> curr_lap["Track"];
                let curr_tkpts : JsonArray  = <JsonArray> curr_track["Trackpoint"];
                let curr_tkpt_length = curr_tkpts.length;
                for (var t = 0; t < curr_tkpt_length; t++) {
                    tkpt_seq++;
                    let tkpt_data : JsonObject = <JsonObject> curr_tkpts[t];
                    this.activity.addTrackpoint(new Trackpoint(tkpt_data, tkpt_seq));
                }
            }
        }
        else {
            let curr_lap   : JsonObject = <JsonObject> lapObj;
            let curr_track : JsonObject = <JsonObject> curr_lap["Track"];
            let curr_tkpts : JsonArray  = <JsonArray> curr_track["Trackpoint"];
            let curr_tkpt_length = curr_tkpts.length;
            for (var t = 0; t < curr_tkpt_length; t++) {
                tkpt_seq++;
                let tkpt_data : JsonObject = <JsonObject> curr_tkpts[t];
                this.activity.addTrackpoint(new Trackpoint(tkpt_data, tkpt_seq));
            }
        }

        let startingEpoch : number = this.activity.startingEpoch;

        for (var i = 0; i < this.activity.trackpoints.length; i++) {
            this.activity.trackpoints[i].addAltitudeFeet();
            this.activity.trackpoints[i].addDistances();
            this.activity.trackpoints[i].calculateElapsed(startingEpoch);
            this.activity.trackpoints[i].addGeoJson();
            this.activity.trackpoints[i].cleanup();
        }

        this.activity.firstTrackpoint = null;  
    }

    public convertXmlToJson(data: string): Object {
        let res : Object = {};
        xml2js.parseString(data, { explicitArray: false }, (error:any, result:any) => {
            if (error) {
                throw new Error(error);
            }
            else {
                res = result;
            }
        });
        return res;
    }

    public finish() : void {
        // iterate and augment trackpoints
    }

}

// Import npm libraries
import * as fs from "fs";
import * as xml2js from "xml2js";

// Import modules from this project
import { Activity }   from "./activity";
import { Author }     from "./author";
import { Creator }    from "./creator";
import { Trackpoint } from "./trackpoint";

// https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
// https://stackoverflow.com/questions/46922993/creating-a-json-interface-in-typescript-without-any

//=

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

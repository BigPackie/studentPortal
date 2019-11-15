export interface TimedItem { 
    /**
     * Mongodb ObjectId, just readonly in student portal.
     * 
     * Inserting through admin portal does not require a manual input for id (created automatically by mongodb)
     * */
    id: any, 

    validFrom: Date,

    validTo: Date,

    overviewImageBase64: Buffer; //image encoded in base 64 or maybe just binary, base64 needs 30% more data

    detailImage: any; //this should be mongodb ObjectId again, we will load the image only when user wants to see the details

    detailText: any; //maybe not needed
}
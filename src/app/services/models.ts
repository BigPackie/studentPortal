export interface TimedItem { 
    /**
     * Mongodb ObjectId, just readonly in student portal.
     * 
     * Inserting through admin portal does not require a manual input for id (created automatically by mongodb)
     * */
    _id: any, 

    validFrom: Date,

    validTo: Date,
}

export interface NewsItem extends TimedItem {
    overviewImageBase64: Buffer; //image encoded in base 64 string, only option for transfering in JSON. At mongo db, it can be stored as binary using binData type

    detailImageId: any; //this should be mongodb ObjectId again, we will load the image only when user wants to see the details

    detailText: any; //maybe not needed
}
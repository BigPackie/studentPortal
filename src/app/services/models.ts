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
    overviewImageBase64: string; //image encoded in base 64 string, only option for transfering in JSON. At mongo db, it can be stored as binary using binData type
}

export interface NewsItemDetail {
    _id: string,
    description: string,
    imageBase64: string
}
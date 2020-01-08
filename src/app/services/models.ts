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
    deleted: boolean;
    name: string;
}

export interface NewsItemDetail {
    _id: string,
    description: string,
    imageBase64: string
}

export interface Promotion extends TimedItem {
    overviewImageBase64: string; 
    deleted: boolean;
    name: string;
}

export interface PromotionDetail {
    _id: string,
    description: string,
    imageBase64: string
}

export class LoginData {
    username: string;
    password: string
}

export interface UserData {
    username: string,
    displayname: string,
    firstname_en: string,
    lastname_en: string,
    pid: string,
    email: string,
    birthdate: string,
    account_type: string,
}

export interface Reward {
    id? : number,
    redemptionCode? : string;
    name: string,
    point: number,
    img: string,
    desc: string,
    status: RewardStatus;
}

/**
 * Represents the life cycle of a reward (milestone, reward) on the client side.
 * 
 */
export enum RewardStatus {
    LOCKED,

    /**
     * In this state user is able to call WS to get the exchange token
     */
    UNLOCKED,

    /**
     * Getting the exchange token from backend
     */
    REDEEMING,

    /**
     * Echange token received from backend
     */
    REDEEMED
}

export interface RewardHistory extends Reward {
    date:  string
}
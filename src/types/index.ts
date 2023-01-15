

export interface TellerHandler {
    open: () => void;
    exit: (force?: boolean) => void;
    destroy: () => void;
}


export type TellerOnExit = (error: null | TellerConnectError) => void;
export type TellerOnSuccess = (data: TellerOnSuccessMetadata) => void;
export type TellerOnInit = () => void;
export type TellerOnFailure = (error : TellerOnFailureData) => void;

export interface TellerConnectCommonOptions {
    onSuccess: TellerOnSuccess;
    onExit?: TellerOnExit;
    onInit?: TellerOnInit;
    onFailure?: TellerOnFailure;
}

export type TellerUser = {
    id: null | string;
}

export interface TellerOnSuccessMetadata {
    accessToken: null | string;
    user: TellerUser | null;
    enrollment: TellerEnrollment | null;
    signature: Array<string> | [];
}

export enum TellerErrorTypes {
    PAYEE= "payee",
    PAYMENT = "payment"
}

export enum TellerErrorCodes {
    TIMEOUT = "timeout",
    ERROR = "error",
}

export enum HTTPStatusCodes {
    Ok = "200",
    BadRequest = "400",
    Unauthorized = "401",
    Forbidden = "403",
    NotFound = "404",
    Gone = "410",
    UnprocessableEntity = "422",
    BadGateway = "502"
}

export interface TellerOnFailureData {
    type: TellerErrorTypes,
    code: TellerErrorCodes,
    message: string;
}


export interface TellerConnectError {
    error_code: string;
    error_message: string;
}

export type TellerInstitution = {
    name: string;
}

export type TellerEnrollment = {
    id: string | null;
    institution: TellerInstitution | null;
}


export enum Environment {
    sandbox = "sandbox",
    development = "development",
    production = "production"

}


export enum SelectAccount {
    //automatically connect all the supported financial accounts associated with this user's account at the institution (default)
    disabled = "disabled",
    //the user will see a list of supported financial accounts and will need to select one to connect
    single = "single",
    //the user will see a list of supported financial accounts and will need to select one or more to connect
    multiple = "multiple"
}

export type TellerConnectOptions  = TellerConnectCommonOptions & {
    // The environment to use for enrolling the user's accounts. Valid values are "sandbox", "development" and "production". The "sandbox" enviroment never communicates with a real institution, it is used to create sandbox enrollments, accounts and tokens. The "development" environment is the same as "production" but is not billed and has a hard limit of 100 connected accounts.
    environment?: null | Environment;
    // A string representing your Application ID, which can be found inside the Teller Dashboard. Simply pass the value here, then we'll know who you are
    applicationId: string;
    //An optional string representing the institution id. If set, Teller Connect will skip the institution picker and and load the first step for the corresponding institution.
    institution?: null | string;
    // An optional string which can be set to one of:
    //
    // disabled - automatically connect all the supported financial accounts associated with this user's account at the institution (default)
    // single - the user will see a list of supported financial accounts and will need to select one to connect
    // multiple - the user will see a list of supported financial accounts and will need to select one or more to connect

    selectAccount?: null |SelectAccount;
    //An optional string representing the Enrollment ID of the Teller enrollment you want to update if it has become disconnected.
    enrollmentId?: null | string;
    //An optional string representing the User ID of the Teller user you want to add more enrollments to.
    userId?: null | string;
    //An optional string representing the Connect Token returned by one of Teller API's endpoints and used to initialize Teller Connect to perform a particular task (e.g. as completing a payment requiring multi-factor authentication).
    connectToken?: null | string;
    // An optional string to be used when signing the enrollment tokens. If set, Teller Connect will include a signature in the success payload which you can verify to prevent token reuse attacks. This value must be randomly generated and unique to the current session.
    nonce?: null | string;

}

export interface Teller extends TellerHandler {
    setup: (config: TellerConnectOptions) => TellerHandler;
}

declare global {
    interface Window {
        TellerConnect: Teller;
    }
}
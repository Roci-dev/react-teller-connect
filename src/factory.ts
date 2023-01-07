import {TellerConnectOptions, TellerHandler} from "./types";

interface FactoryInternalState {
    teller: TellerHandler | null;
    open: boolean;
    onExitCallback: Function | null;
}


export interface TellerFactory {
    open: Function;
    exit: Function;
    destroy: Function;
}


const createTellerHandler = (
    config: TellerConnectOptions,
    creator: (config: TellerConnectOptions) => TellerHandler
) => {
    const state: FactoryInternalState = {
        teller: null,
        open: false,
        onExitCallback: null,
    };

    if (typeof window === 'undefined' || !window.TellerConnect) {
        throw new Error('Teller not initialized');
    }



    state.teller = creator({
        ...config,
        onExit: (error: any) => {
            state.open = false;
            config.onExit && config.onExit(error);
            state.onExitCallback && state.onExitCallback();
        },
    });

    const open = () => {
        if (!state.teller) {
            return;
        }
        state.open = true;
        state.onExitCallback = null;
        state.teller.open();
    };

    const exit = (exitOptions: any, callback: Function) => {
        if (!state.open || !state.teller) {
            callback && callback();
            return;
        }
        state.onExitCallback = callback;
        state.teller.exit(exitOptions);
        if (exitOptions && exitOptions.force) {
            state.open = false;
        }
    };

    const destroy = () => {
        if (!state.teller) {
            return;
        }

        state.teller.destroy();
        state.teller = null;
    };

    return {
        open,
        exit,
        destroy,
    };
};

export const createTeller = (
    options: TellerConnectOptions,
    creator: (options: TellerConnectOptions) => TellerHandler
) =>  createTellerHandler(options, creator);
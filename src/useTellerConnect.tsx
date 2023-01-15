import {useEffect, useState} from 'react';
import {useScript} from 'use-script';
import {createTeller, TellerFactory} from "./factory";
import {TellerConnectOptions} from "./types";

const TELLER_URL =
    'https://cdn.teller.io/connect/connect.js';

const noop = () => {};


export const useTellerConnect = (options : TellerConnectOptions) => {
    const {loading, error} = useScript({
        src: TELLER_URL,
        checkForExisting: true,
    });
    const [teller, setTeller] = useState<TellerFactory | null>(null);

    useEffect(() => {
        // If the connect.js script is still loading, return prematurely
        if (loading) {
            return;
        }

        // If the applicationId and publicKey is undefined, return prematurely
        if (
            !options.applicationId
        ) {
            return;
        }


        if (error || !window.TellerConnect) {
            // eslint-disable-next-line no-console
            console.error('Error loading Teller', error);
            return;
        }

        // if (teller != null) {
        //     teller.exit({ force: true }, () => teller.destroy());
        // }


        const tellerClient = createTeller(
            {
                ...options,
            },

            window.TellerConnect.setup
        );

        setTeller(tellerClient);

        return () => tellerClient.exit({ force: true }, () => tellerClient.destroy());
    }, [
        loading,
        options.applicationId,
        error,
    ]);

    const ready = teller != null && (!loading);


    const openNoOp = () => {
        if (!options.applicationId) {
            console.warn(
                'react-teller-connect: You cannot call open() without a valid applicationId.'
            );
        }
    };

    return {
        error,
        ready,
        exit: teller ? teller.exit : noop,
        open: teller ? teller.open : openNoOp,
    }

}



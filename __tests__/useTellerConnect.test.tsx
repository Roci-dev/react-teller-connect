import * as React from 'react';
import { render, screen } from "@testing-library/react";
import {useTellerConnect, TellerConnectOptions, TellerHandler} from '../src'


import {useScript} from 'use-script';
jest.mock('use-script');
const mockUseScript = useScript as jest.Mock;

const useScriptLoadingState = {
    SCRIPT_LOADING: [true, null],
    SCRIPT_LOADED: [false, null],
    SCRIPT_ERROR: [true, "THE SCRIPT HAS ENCOUNTERED AN ERROR"],
}


const TellerHook: React.FC<{ config: TellerConnectOptions }> = ({ config }) => {
    const { open, ready, error } = useTellerConnect(config);
    return (
        <div>
            <button onClick={() => open()}>Open</button>
            <div>{ready ? useScriptLoadingState.SCRIPT_LOADED : useScriptLoadingState.SCRIPT_LOADING}</div>
            <div>{error ? useScriptLoadingState.SCRIPT_ERROR : useScriptLoadingState.SCRIPT_LOADED}</div>
        </div>
    );
};


describe('useTellerConnect', () => {
    const configuration: TellerConnectOptions = {
        applicationId: 'applicationId',
        onSuccess: jest.fn()
    };

    beforeEach(() => {
        mockUseScript.mockImplementation(() => useScriptLoadingState.SCRIPT_LOADED);
        window.TellerConnect = {
            setup(config: TellerConnectOptions): TellerHandler {
                return {
                    open: jest.fn(),
                    exit: jest.fn(),
                    destroy: jest.fn()
                }
            },
            open: jest.fn(),
            exit: jest.fn(),
            destroy: jest.fn()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render with provided applicationId', async () => {
        render(<TellerHook config={configuration}/>);
        expect(screen.getByRole('button'));
    });


})
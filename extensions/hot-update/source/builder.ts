import { BuildPlugin } from "@cocos/creator-types/editor/packages/builder/@types/public";
// @ts-ignore
import packageJSON from "../package.json"
const PACKAGE_NAME = packageJSON.name;

export const load: BuildPlugin.load = function() {
    console.debug(`${PACKAGE_NAME} load`);
}

export const unload: BuildPlugin.Unload = function() {
    console.debug(`${PACKAGE_NAME} unload`);
}

export const configs:BuildPlugin.Configs = {
    "android": {
        hooks: "./hooks",
        options: {
            address: {
                label: `i18n:${PACKAGE_NAME}.address`,
                default: 'http://your-cdn.com/',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'Enter remote address...',
                    }
                },
                verifyRules: ['required'],
            },
            version: {
                label: `i18n:${PACKAGE_NAME}.version`,
                default: '1.0.0',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'Enter package version...',
                    }
                },
                verifyRules: ['required'],
            }
        }
    }
}
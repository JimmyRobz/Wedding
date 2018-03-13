/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
    id: string;
}

declare const $: any;

interface ISnackbar {
    show(value: object)
}

declare const Snackbar: ISnackbar;

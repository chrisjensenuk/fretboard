interface EnvConfig {
    spaUrl: string;
    functionAppUrl: string;
    functionAppScope: string;
    authority: string;
    clientId: string
}

var Config = (window as any).__env as EnvConfig;

export {Config}





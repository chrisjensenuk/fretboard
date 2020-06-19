import * as Msal from 'msal'
import {Config} from '@/common/config'

let msalLogin = new Msal.UserAgentApplication({
    auth:{
        clientId: Config.clientId,
        redirectUri: Config.spaUrl,
        postLogoutRedirectUri: Config.spaUrl,
        authority: Config.authority
    }
});

export default class Authentication
{
    static login(){

        var authParams: Msal.AuthenticationParameters =
        {
            scopes: ["User.ReadWrite"],
            prompt: "select_account",
            loginHint: ""
        };

        return msalLogin.loginPopup(authParams);
    }

    static logout(){
        msalLogin.logout();
    }

    static async getAccessToken(){
        let accessToken = "" as string;

        var authParams: Msal.AuthenticationParameters =
        {
            scopes: [Config.functionAppScope]
        }
    
        await msalLogin.acquireTokenSilent(authParams)
            .then(function(accessTokenResponse){
                accessToken = accessTokenResponse.accessToken;
            })
            .catch(async function (error) {
                if (error.errorMessage.indexOf("interaction_required") !== -1) {
                    msalLogin.acquireTokenPopup(authParams).then(function(accessTokenResponse) {
                        accessToken = accessTokenResponse.accessToken;
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
                console.log(error);
            });
        return accessToken;
    }
}
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import * as Msal from 'msal'
import axios from 'axios'; 

const spaUrl = "https://stfretboard3.z33.web.core.windows.net/";
const functionAppUrl = "https://fn-fretboard3.azurewebsites.net/";
const functionAppScope = "https://fn-fretboard3.azurewebsites.net/user_impersonation";

let msalLogin = new Msal.UserAgentApplication({
    auth:{
        clientId: "269a365c-52ba-4ad1-a745-5016f53e7d07",
        redirectUri: spaUrl,
        postLogoutRedirectUri: spaUrl,
        authority: "https://login.microsoftonline.com/a061aca6-27f7-48ab-81c8-172f7bc9f4e9"
    }
});

@Module
export default class storeBackend extends VuexModule{

    isAuthenticated = false;
    loginError = "";
    loginName = "";
    response = "";

    get getLoginName(){
        return this.loginName;
    }

    get getLoginError(){
        return this.loginError;
    }

    get getResponse(){
        return this.response;
    }

    @Mutation
    LOGIN_ERROR(error: any ){
        this.loginError = error;
    }

    @Mutation
    LOGIN_NAME(name: string){
        this.loginName = name;
    }

    @Mutation
    SET_AUTHENTICATED(isAuthenticated : boolean){
        this.isAuthenticated = isAuthenticated;
    }

    @Mutation
    SET_RESPONSE(response: string){
        this.response = response;
    }

    @Action
    async login(){
        var self = this;
          
        await msalLogin.loginPopup({
        scopes: ["User.ReadWrite", functionAppScope],
        prompt: "select_account",
        loginHint: ""
        })
        .then(function(loginResponse){            
            self.context.commit('LOGIN_ERROR', "");
            self.context.commit('LOGIN_NAME', loginResponse.account.name);
            self.context.commit('SET_AUTHENTICATED', true);
        }).catch(function (error) {
            console.log(`login error: ${error.errorCode} msg:${error.message}`);
            self.context.commit('LOGIN_ERROR', "There was an error logging in. Please try again.");
            self.context.commit('LOGIN_NAME', "");
            self.context.commit('SET_AUTHENTICATED', false);
        });
    }

    @Action
    async saveGuess(){

        let self = this;
        
        var accessToken = await getToken(self.context.dispatch("login"));
        
        axios.get(`${functionAppUrl}api/test`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(function(response){
            self.context.commit('SET_RESPONSE', response.data)
        })
        .catch(function(error){
            debugger;
        })
    }
}

async function getToken(funcLogin : any) : Promise<string>{
    let accessToken = "" as string;

    await msalLogin.acquireTokenSilent({
        scopes: [functionAppScope]
        })
        .then(function(accessTokenResponse){
            accessToken = accessTokenResponse.accessToken;
        })
        .catch(async function (error) {
            //Acquire token silent failure, and send an interactive request
            if (error.errorMessage.indexOf("interaction_required") !== -1) {
                
                await funcLogin();
                
                await msalLogin.acquireTokenSilent({
                    scopes: [functionAppScope]
                    })
                    .then(function(accessTokenResponse){
                        accessToken = accessTokenResponse.accessToken;
                    })
            }
            console.log(error);
        });

    return accessToken;
}
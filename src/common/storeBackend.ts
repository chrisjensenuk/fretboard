import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import * as Msal from 'msal'
import axios from 'axios'; 

let msalLogin = new Msal.UserAgentApplication({
    auth:{
        clientId: "95f851f6-de0f-4dae-9d39-4b0fc90dc6b1",
        redirectUri: "https://localhost:8080/",
        postLogoutRedirectUri: "https://localhost:8080/",
        authority: "https://login.microsoftonline.com/a061aca6-27f7-48ab-81c8-172f7bc9f4e9"
    }
});

@Module
export default class storeBackend extends VuexModule{

    isAuthenticated = false;
    loginError = "";
    loginName = "";

    get getLoginName(){
        return this.loginName;
    }

    get getLoginError(){
        return this.loginError;
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

    @Action
    async login(){
        var self = this;
          
        await msalLogin.loginPopup({
        scopes: ["User.ReadWrite", "https://fn-fretboard2.azurewebsites.net/user_impersonation"]
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
        
        alert(accessToken);

        axios.get("https://fn-fretboard2.azurewebsites.net/api/HttpTrigger1", {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(function(response){
            debugger;
        })
        .catch(function(error){
            debugger;
        })
    }
}

async function getToken(funcLogin : any) : Promise<string>{
    let accessToken = "" as string;

    await msalLogin.acquireTokenSilent({
        scopes: ["https://fn-fretboard2.azurewebsites.net/user_impersonation"]
        })
        .then(function(accessTokenResponse){
            debugger;
            accessToken = accessTokenResponse.accessToken;
        })
        .catch(async function (error) {
            //Acquire token silent failure, and send an interactive request
            if (error.errorMessage.indexOf("interaction_required") !== -1) {
                
                await funcLogin();
                
                await msalLogin.acquireTokenSilent({
                    scopes: ["https://fn-fretboard2.azurewebsites.net/user_impersonation"]
                    })
                    .then(function(accessTokenResponse){
                        accessToken = accessTokenResponse.accessToken;
                    })
            }
            console.log(error);
        });

    return accessToken;
}
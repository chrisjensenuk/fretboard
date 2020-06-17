import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import * as Msal from 'msal'
import axios from 'axios'; 
import {Config} from '@/common/config'

let msalLogin = new Msal.UserAgentApplication({
    auth:{
        clientId: Config.clientId,
        redirectUri: Config.spaUrl,
        postLogoutRedirectUri: Config.spaUrl,
        authority: Config.authority
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
        scopes: ["User.ReadWrite", Config.functionAppScope],
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
        
        axios.get(`${Config.functionAppUrl}api/test`, {
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
        scopes: [Config.functionAppScope]
        })
        .then(function(accessTokenResponse){
            accessToken = accessTokenResponse.accessToken;
        })
        .catch(async function (error) {
            //Acquire token silent failure, and send an interactive request
            if (error.errorMessage.indexOf("interaction_required") !== -1) {
                
                await funcLogin();
                
                await msalLogin.acquireTokenSilent({
                    scopes: [Config.functionAppScope]
                    })
                    .then(function(accessTokenResponse){
                        accessToken = accessTokenResponse.accessToken;
                    })
            }
            console.log(error);
        });

    return accessToken;
}
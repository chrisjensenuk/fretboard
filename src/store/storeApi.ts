import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import axios from 'axios'; 
import {Config} from '@/common/config'
import auth from '@/api/authentication'
import { LoginData } from '@/common/models';

@Module
export default class storeBackend extends VuexModule{

    isAuthenticated = false;
    loginData: LoginData = {isAuthenticated: false};
    loginName = "";
    response = "";

    get getLoginData(){
        return this.loginData;
    }

    get getResponse(){
        return this.response;
    }

    @Mutation
    SET_LOGIN_DATA(loginData: LoginData ){
        this.loginData = loginData;
    }

    @Mutation
    SET_RESPONSE(response: string){
        this.response = response;
    }

    @Action
    async login(){
        var self = this;
          
        await auth.login()
        .then(function(loginResponse){     
            let loginData : LoginData = {
                isAuthenticated: true,
                displayName: loginResponse.account.name
            };
            self.context.commit('SET_LOGIN_DATA', loginData);
            self.context.commit('SET_RESPONSE', "logged in");
        }).catch(function (error) {
            console.log(`login error: ${error.errorCode} msg:${error.message}`);
            
            let loginData : LoginData = {
                isAuthenticated: false,
                error: "There was an error logging in. Please try again"
            };
            self.context.commit('SET_LOGIN_DATA', loginData);
            self.context.commit('SET_RESPONSE', "login error");
        });
    }

    @Action
    logout(){
        debugger;
        let loginData : LoginData = {
            isAuthenticated: false,
        };
        this.context.commit('SET_LOGIN_DATA', loginData);
        this.context.commit('SET_RESPONSE', "logged out");

        auth.logout();
    }

    @Action
    async saveGuess(){

        let self = this;
        
        var accessToken = await auth.getAccessToken();
        
        axios.get(`${Config.functionAppUrl}api/test`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(function(response){
            self.context.commit('SET_RESPONSE', response.data)
        })
        .catch(function(error){
            console.log(error);
        })
    }
}
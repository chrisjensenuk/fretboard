<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';

@Component({
  methods: {
    ...mapActions(['login', 'logout'])
    },
  computed: {
    ...mapGetters(['getLoginData', 'getResponse'])
    }})
export default class LoginBar extends Vue{}
</script>

<template>
  <section>
    <div v-if="getLoginData.isAuthenticated">
        <h2>Hi {{ getLoginData.displayName }}!</h2>
        <button @click="logout">Log out</button>
    </div>
    <div v-else>
        <button @click="login">Login</button>
        <div v-if="getLoginData.Error" style="color:red">{{ getLoginData.Error }}</div>
    </div>

    <div v-if="getResponse" style="border:1px solid green">{{ getResponse }}</div>
  </section>
</template>
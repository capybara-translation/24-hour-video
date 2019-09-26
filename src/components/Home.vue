<template>
  <div>
    <p>HOME</p>
    <ul>
      <li v-if="!$store.getters.isLoggedIn"><a :href="signinUri">Sign in</a></li>
      <li v-if="$store.getters.isLoggedIn"><a href="#" @click.prevent="signout">Sign out</a></li>

    </ul>

      <template v-if="$store.getters.isLoggedIn">
        <button @click="callTestApi">Test API</button>
        <br>
        <textarea v-model="testApiResp" cols="30" rows="10"></textarea>
        <br>

        <button @click="getVideoList">Get Video List</button>
        <br>

        <div id="video-list">
          <div class="video-card" v-for="(video, index) of videoList" :key="'video-' + index">
            <video width="100%" height="100%" controls>
              <source type="video/mp4" :src="video.src">
            </video>
          </div>
        </div>

      </template>

  </div>
</template>


<script>
import axios from 'axios'
import appConfig from '../config/app-config.json'
import cognitoUtils from '../lib/cognitoUtils'
export default {
  name: 'app',
  data () {
    return {
      /**
       * Signin/Signup URI for AWS Cognito
       */
      signinUri: `${appConfig.userPoolBaseUri}/login?response_type=token&client_id=${appConfig.clientId}&redirect_uri=${appConfig.callbackUri}`,
      testApiResp: '',
      videoList: []
    }
  },
  methods: {
    signout () {
      cognitoUtils.signOutCognitoSession()
    },

    /**
     * API Gateway GET endpoint.
     * We assume that this endpoint is configured to use Cognito User Pool authorizor.
     */
    async callTestApi () {
      const url = `${appConfig.apiBaseUri}/test-cognito`
      const authHeader = `Bearer ${this.$store.getters.session.credentials.idToken}`
      const response = await axios.get(url, {
        headers: {
          Authorization: authHeader
        }
      }).catch(err => {
        console.log(err)
      })
      if (response) {
        this.testApiResp = JSON.stringify(response.data, null, 4)
      }
    },

    /**
     * API Gateway GET endpoint.
     * We assume that this endpoint is configured to use Cognito User Pool authorizor.
     * The endpoint calls a Lambda function that returns a list of mp4 files stored on S3.
     */
    async getVideoList () {
      this.videoList.length = 0
      const url = `${appConfig.apiBaseUri}/videos`
      const authHeader = `Bearer ${this.$store.getters.session.credentials.idToken}`
      const response = await axios.get(url, {
        headers: {
          Authorization: authHeader
        }
      }).catch(err => {
        console.log(err)
      })
      if (response) {
        const domain = response.data.domain
        const bucket = response.data.bucket
        const files = response.data.files
        this.videoList.push(...files.map(x => {
          return {
            filename: x.filename,
            src: `${domain}/${bucket}/${x.filename}`
          }
        }))
      }
    }

  }
}
</script>
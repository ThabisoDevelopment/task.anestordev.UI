import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from '@kyvg/vue3-notification'

// importing Bootstrap Style
import "bootstrap"
import "./assets/sass/main.scss"

import axios from 'axios'
axios.defaults.baseURL = "http://localhost:3000/api"
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')  

createApp(App)
.use(store)
.use(router)
.use(Notifications)
.mount('#app')
import { createStore } from 'vuex'

export default createStore({
	state: {
		user: {
			name: localStorage.getItem('username'),
			image: localStorage.getItem('user_img')
		},
	},
	mutations: {

	},
	actions: {
		
	},
	getters: {
		authenticated: ()=> {
			if (localStorage.getItem('token')) return true
			return false
		},
		user: state => state.user
	},
	modules: {
	}
})

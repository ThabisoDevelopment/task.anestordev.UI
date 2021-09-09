import { createStore } from 'vuex'

export default createStore({
	state: {
		authenticated: false,
		user: {
			name: 'Thabiso',
			image: ''
		},
	},
	mutations: {
		SET_USER: (state, payload) => {
			state.authenticated = true
			state.user.name = payload.name
			state.user.image = payload.image
		}
	},
	actions: {
		authenticate: ({commit}, payload) => {
			if (!payload.name) {
				console.log('Something went wrong assining user')
			}
			commit('SET_USER', payload)
		}
	},
	getters: {
		authenticated: state => state.authenticated,
		user: state => state.user
	},
	modules: {
	}
})

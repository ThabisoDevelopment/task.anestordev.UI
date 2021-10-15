<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <span class="">TASK</span>
                <small class="text-sm px-1">by anestordev</small>
            </router-link>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarToggler">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item mx-2" v-if="authenticated">
                        <router-link to="/" class="nav-link">Tasks</router-link>
                    </li>
                    <li class="nav-item mx-2" v-if="authenticated">
                        <router-link to="/" class="nav-link">Todos</router-link>
                    </li>
                    <li class="nav-item dropdown mx-2" v-if="authenticated">
                        <router-link to="#" class="nav-link dropdown-toggle" id="navbarDropdownMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {{ user.name }}
                        </router-link>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenu">
                            <li><button class="dropdown-item" @click="logout">logout</button></li>
                        </ul>
                    </li>
                    <li class="nav-item mx-2" v-if="!authenticated">
                        <router-link :to="{ name: 'Login' }" class="nav-link">Login</router-link>
                    </li>
                    <li class="nav-item mx-2" v-if="!authenticated">
                        <router-link :to="{ name: 'Register' }" class="nav-link">Register</router-link>
                    </li>
                </ul>
            </div>

        </div>
    </nav>
</template>
<script>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex';
export default {
    name: "Navigation",
    setup() {
        const store = useStore()
        
        const user = computed(()=> store.getters.user)
        const authenticated = computed(()=> store.getters.authenticated)

        const logout = ()=> {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('user_img')
            window.location.href = '/login'
        }

        return { user, authenticated, logout }
    }
}
</script>
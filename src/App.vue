<template>
	<Navigation />
	<router-view/>
	<notifications position="top right" />
</template>
<script>
import Navigation from "./components/Navigation"
export default {
	components: { Navigation },
	setup() {

	}
}
</script>
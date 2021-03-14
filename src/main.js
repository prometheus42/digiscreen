import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import VueI18n from 'vue-i18n'
import messages from '@/lang'

Vue.use(VueKonva)
Vue.use(VueI18n)

export const i18n = new VueI18n({
	locale: 'fr',
	fallbackLocale: 'fr',
	messages
})

Vue.config.productionTip = false

Vue.prototype.$convertirRem = function (valeur) {
	const taille = window.getComputedStyle(document.querySelector('html'), null).getPropertyValue('font-size')
	return 'undefined' != typeof valeur && valeur > 0 ? parseFloat(taille) * valeur : parseFloat(taille)
}

Vue.prototype.$verifierURL = function (url) {
	const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g)
	return (res !== null)
}

Vue.prototype.$melanger = function (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return array
}

Vue.prototype.$lireAudio = function (audio) {
	audio.pause()
	audio.currentTime = 0
	audio.play()
}

Vue.prototype.$lancerConfettis = function () {
	// eslint-disable-next-line
	confetti({ angle: 300, spread: 55, particleCount: 200, origin: { x: 0, y: -0.2 }, zIndex: 10000 })
	// eslint-disable-next-line
	confetti({ angle: 240, spread: 55, particleCount: 200, origin: { x: 1, y: -0.2 }, zIndex: 10000 })
	// eslint-disable-next-line
	confetti({ angle: 270, spread: 70, particleCount: 200, origin: { x: 0.5, y: -0.2 }, zIndex: 10000 })
}

new Vue({
	i18n,
	render: h => h(App),
}).$mount('#app')

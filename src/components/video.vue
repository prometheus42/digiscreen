<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'max': statut === 'max', 'min': statut === 'min'}" :isDraggable="true" :isResizable="redimensionnement" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="['tl', 'bl', 'br']" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}">{{ titre }}</div>
				<div class="actions-panneau inactif">
					<span class="editer" role="button" @click="editer" v-if="mode === 'lecture'"><i class="material-icons">arrow_back</i></span>
					<span class="afficher" role="button" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
					<span class="afficher" role="button" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
					<span class="afficher" role="button" @click="maximiser" v-if="mode === 'lecture' && statut === ''"><i class="material-icons">fullscreen</i></span>
					<span class="afficher" role="button" @click="normaliser" v-else-if="mode === 'lecture' && statut === 'max'"><i class="material-icons">fullscreen_exit</i></span>
					<span class="fermer" role="button" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
				</div>
			</header>
			<div class="conteneur actif panneau-video">
				<div class="contenu inactif" v-if="mode === 'edition'">
					<label>{{ $t('lienVideo') }}</label>
					<input type="search" :value="video" @input="video = $event.target.value" @keydown.enter="valider">
					<span class="bouton" role="button" @click="valider">{{ $t('valider') }}</span>
				</div>
				<div class="contenu inactif" v-else-if="mode === 'decoupage'">
					<div class="video">
						<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-if="debut === 0 && fin === 0" />
						<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0 && fin > 0" />
						<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0" />
						<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else />
					</div>
					<div class="temps">
						<div class="debut">
							<label>{{ $t('debut') }}</label>
							<div class="minutes-secondes">
								<div class="minutes">
									<label>{{ $t('min') }}</label>
									<input type="number" :value="debutMinutes" :min="0" @input="debutMinutes = $event.target.value">
								</div>
								<div class="secondes">
									<label>{{ $t('sec') }}</label>
									<input type="number" :value="debutSecondes" :min="0" :max="59" @input="debutSecondes = $event.target.value">
								</div>
							</div>
						</div>
						<div class="fin">
							<label>{{ $t('fin') }}</label>
							<div class="minutes-secondes">
								<div class="minutes">
									<label>{{ $t('min') }}</label>
									<input type="number" :value="finMinutes" :min="0" @input="finMinutes = $event.target.value">
								</div>
								<div class="secondes">
									<label>{{ $t('min') }}</label>
									<input type="number" :value="finSecondes" :min="0" :max="59" @input="finSecondes = $event.target.value">
								</div>
							</div>
						</div>
					</div>
					<div class="actions">
						<span class="bouton" role="button" @click="decouper">{{ $t('apercu') }}</span>
						<span class="bouton" role="button" @click="generer">{{ $t('valider') }}</span>
					</div>
				</div>
				<template v-else>
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-if="debut === 0 && fin === 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0 && fin > 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else />
				</template>
			</div>
		</vue-drag-resize>
	</transition>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import Panneau from '@/panneau'

export default {
	name: 'PVideo',
	components: {
		VueDragResize
	},
	props: {
		panneau: Object,
		largeurPage: Number,
		hauteurPage: Number,
		finRedimensionnement: Boolean,
		zIndex: Number,
		export: Boolean
	},
	extends: Panneau,
	data () {
		return {
			chargement: true,
			mode: 'edition',
			deplacement: false,
			redimensionnement: false,
			id: '',
			w: 0,
			h: 0,
			ws: 0,
			hs: 0,
			x: 0,
			y: 0,
			z: 0,
			minw: 25,
			minh: 20,
			statut: '',
			dimensions: {},
			donnees: { w: 0, h: 0 },
			video: '',
			googleAPIKey: process.env.VUE_APP_GOOGLE_API_KEY,
			videoId: '',
			debutMinutes: '',
			debutSecondes: '',
			finMinutes: '',
			finSecondes: '',
			debut: 0,
			fin: 0
		}
	},
	computed: {
		titre () {
			return this.$t('videoYoutube')
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: { video: this.video, videoId: this.videoId, debutMinutes: this.debutMinutes, debutSecondes: this.debutSecondes, finMinutes: this.finMinutes, finSecondes: this.finSecondes }, w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
			}
		},
		finRedimensionnement: function () {
			this.positionner()
		}
	},
	created () {
		this.id = this.panneau.id
		this.w = this.panneau.w
		this.h = this.panneau.h
		this.x = this.panneau.x
		this.y = this.panneau.y
		this.z = this.panneau.z
		this.statut = this.panneau.statut
		this.dimensions = this.panneau.dimensions
		if (this.panneau.mode !== '') {
			this.mode = this.panneau.mode
		}
		if (this.panneau.statut === 'max') {
			this.maximiser()
		} else if (this.panneau.statut === 'min') {
			this.minimiser()
		}
		if (this.panneau.contenu !== '') {
			this.video = this.panneau.contenu.video
			this.videoId = this.panneau.contenu.videoId
			this.debutMinutes = this.panneau.contenu.debutMinutes
			this.debutSecondes = this.panneau.contenu.debutSecondes
			this.finMinutes = this.panneau.contenu.finMinutes
			this.finSecondes = this.panneau.contenu.finSecondes
		}
		if (this.mode === 'lecture') {
			this.definirTemps()
			this.redimensionnement = true
		} else if (this.mode === 'decoupage') {
			this.editer()
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		}
	},
	methods: {
		valider () {
			if (this.$verifierURL(this.video) === true) {
				const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
				if (this.video.match(regExp)) {
					this.videoId = this.video.match(regExp)[2]
					const xhr = new XMLHttpRequest()
					xhr.onload = function () {
						if (xhr.readyState === xhr.DONE && xhr.status === 200) {
							if (xhr.response && Object.keys(xhr.response).length > 0) {
								const duree = xhr.response.items[0].contentDetails.duration
								const temps = this.convertirTemps(duree)
								let h = 0
								if (temps.h > 0) {
									h = temps.h * 60
								}
								this.debutMinutes = 0
								this.debutSecondes = 0
								this.finMinutes = temps.m + h
								this.finSecondes = temps.s
							}
						}
					}.bind(this)
					xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=' + this.googleAPIKey + '&id=' + this.videoId, true)
					xhr.responseType = 'json'
					xhr.send()
				} else {
					return false
				}
				this.mode = 'decoupage'
				this.w = 40
				this.h = 40
				this.positionner()
			}
		},
		decouper () {
			this.definirTemps()
		},
		generer () {
			this.mode = 'lecture'
			this.redimensionnement = true
			if (this.donnees.w > 0 && this.donnees.h > 0) {
				this.w = this.donnees.w
				this.h = this.donnees.h
			} else {
				this.w = 48
				this.h = 30
			}
			if (this.donnees.x > 0 && this.donnees.y > 0) {
				this.x = this.donnees.x
				this.y = this.donnees.y
			}
			this.positionner()
		},
		editer () {
			this.mode = 'decoupage'
			this.redimensionnement = false
			if (this.statut !== '') {
				this.normaliser()
			}
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 40
			this.h = 40
			this.positionner()
		},
		definirTemps () {
			let debut = 0
			let fin = 0
			if ((this.debutMinutes !== '' || this.debutSecondes !== '') && (this.finMinutes === '' && this.finSecondes === '')) {
				if (this.debutMinutes !== '') {
					debut += parseInt(this.debutMinutes) * 60
				}
				if (this.debutSecondes !== '') {
					debut += parseInt(this.debutSecondes)
				}
			} else if ((this.debutMinutes === '' && this.debutSecondes === '') && (this.finMinutes !== '' || this.finSecondes !== '')) {
				if (this.finMinutes !== '') {
					fin += parseInt(this.finMinutes) * 60
				}
				if (this.finSecondes !== '') {
					fin += parseInt(this.finSecondes)
				}
			} else if ((this.debutMinutes !== '' || this.debutSecondes !== '') && (this.finMinutes !== '' || this.finSecondes !== '')) {
				if (this.debutMinutes !== '') {
					debut += parseInt(this.debutMinutes) * 60
				}
				if (this.debutSecondes !== '') {
					debut += parseInt(this.debutSecondes)
				}
				if (this.finMinutes !== '') {
					fin += parseInt(this.finMinutes) * 60
				}
				if (this.finSecondes !== '') {
					fin += parseInt(this.finSecondes)
				}
			}
			this.debut = debut
			this.fin = fin
		},
		convertirTemps (duree) {
			duree = duree.search(/PT/i) > -1 ? duree.slice(2) : duree
			let h, m, s
			let hIndex = duree.search(/h/i), mIndex = duree.search(/m/i), sIndex = duree.search(/s/i)
			let dContainsH = hIndex > -1, dContainsM = mIndex > -1, dContainsS = sIndex > -1
			h = dContainsH ? duree.slice(0, hIndex) : ''
			m = dContainsM ? duree.slice(dContainsH ? hIndex + 1 : 0, mIndex) : dContainsH ? '0' : '0'
			s = dContainsS ? duree.slice(dContainsM ? mIndex + 1 : hIndex + 1, sIndex) : '0'
			let total = 0
			if (h > 0) {
				total = total + (h * 60 * 60)
			}
			if (m > 0) {
				total = total + (m * 60)
			}
			if (s > 0) {
				total = total + s
			}
			return { h: parseInt(h), m: parseInt(m), s: parseInt(s), total: total }
		}
	}
}
</script>

<style>
.panneau .conteneur .temps {
	margin-top: 2rem;
}

.panneau .conteneur .debut,
.panneau .conteneur .fin {
    display: inline-flex;
	justify-content: center;
	width: 50%;
	flex-wrap: wrap;
}

.panneau .conteneur .temps .minutes-secondes {
    display: flex;
}

.panneau .conteneur .temps .minutes {
    margin-right: 1rem;
}
</style>

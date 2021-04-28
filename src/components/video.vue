<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'max': statut === 'max', 'min': statut === 'min'}" :isDraggable="true" :isResizable="redimensionnement" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="['tl', 'bl', 'br']" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}" @dblclick="renommer(titre)">{{ titre }}</div>
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
				<div class="contenu inactif" v-if="mode === 'edition' && !chargementVideo">
					<label>{{ $t('lienVideo') }}</label>
					<div class="valider">
						<input type="search" :value="video" @input="video = $event.target.value" @keydown.enter="valider">
						<span role="button" tabindex="0" :title="$t('valider')" class="bouton-secondaire" @click="valider"><i class="material-icons">search</i></span>
					</div>
					<div class="separateur"><span>{{ $t('ou') }}</span></div>
					<label>{{ $t('fichierAppareil') }}</label>
					<label class="bouton" role="button" tabindex="0" for="selectionner-video">{{ $t('selectionnerVideo') }}</label>
					<input id="selectionner-video" type="file" @change="televerserVideo" style="display: none" accept=".mp4, .m4v">
				</div>
				<div class="contenu inactif" v-else-if="mode === 'edition' && chargementVideo">
					<div class="conteneur-chargement">
						<div class="chargement" />
					</div>
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
						<span class="bouton" role="button" tabindex="0" @click="decouper">{{ $t('apercu') }}</span>
						<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
					</div>
				</div>
				<template v-else-if="mode === 'lecture' && videoId !== ''">
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-if="debut === 0 && fin === 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0 && fin > 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else />
				</template>
				<video controls :src="video" v-else></video>
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
			titre: '',
			id: '',
			w: 0,
			h: 0,
			ws: 0,
			hs: 0,
			x: 0,
			y: 0,
			z: 0,
			minw: 40,
			minh: 20,
			statut: '',
			dimensions: {},
			donnees: { w: 0, h: 0 },
			video: '',
			dataURL: '',
			googleAPIKey: '',
			videoId: '',
			debutMinutes: '',
			debutSecondes: '',
			finMinutes: '',
			finSecondes: '',
			debut: 0,
			fin: 0,
			chargementVideo: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: { video: this.video, videoId: this.videoId, dataURL: this.dataURL, debutMinutes: this.debutMinutes, debutSecondes: this.debutSecondes, finMinutes: this.finMinutes, finSecondes: this.finSecondes }, w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
			}
		},
		finRedimensionnement: function () {
			this.positionner()
		}
	},
	created () {
		if (process.env.VUE_APP_GOOGLE_API_KEY) {
			this.googleAPIKey = process.env.VUE_APP_GOOGLE_API_KEY
		}
		this.titre = this.$t('video')
		this.id = this.panneau.id
		this.w = this.panneau.w
		this.h = this.panneau.h
		this.x = this.panneau.x
		this.y = this.panneau.y
		this.z = this.panneau.z
		this.statut = this.panneau.statut
		this.dimensions = this.panneau.dimensions
		if (this.panneau.titre) {
			this.titre = this.panneau.titre
		}
		if (this.panneau.mode !== '') {
			this.mode = this.panneau.mode
		}
		if (this.panneau.statut === 'max') {
			this.maximiser()
		} else if (this.panneau.statut === 'min') {
			this.minimiser()
		}
		if (this.panneau.contenu !== '') {
			if (this.panneau.contenu.dataURL) {
				this.dataURL = this.panneau.contenu.dataURL
			}
			if (this.dataURL !== '') {
				const blob = this.convertirDataURL(this.dataURL)
				this.video = window.URL.createObjectURL(blob)
			} else {
				this.video = this.panneau.contenu.video
			}
			this.videoId = this.panneau.contenu.videoId
			this.debutMinutes = this.panneau.contenu.debutMinutes
			this.debutSecondes = this.panneau.contenu.debutSecondes
			this.finMinutes = this.panneau.contenu.finMinutes
			this.finSecondes = this.panneau.contenu.finSecondes
		}
		if (this.mode === 'lecture') {
			if (this.videoId !== '') {
				this.definirTemps()
			}
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
					if (this.googleAPIKey !== '') {
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
						this.debutMinutes = 0
						this.debutSecondes = 0
						this.finMinutes = 0
						this.finSecondes = 0
					}
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
			if (this.videoId !== '') {
				this.definirTemps()
			}
			this.positionner()
		},
		editer () {
			if (this.videoId !== '') {
				this.mode = 'decoupage'
			} else {
				this.video = ''
				this.dataURL = ''
				this.mode = 'edition'
			}
			this.redimensionnement = false
			if (this.statut !== '') {
				this.normaliser()
			}
			if (this.videoId !== '') {
				this.donnees.w = this.w
				this.donnees.h = this.h
				this.donnees.x = this.x
				this.donnees.y = this.y
				this.w = 40
				this.h = 40
			} else {
				this.w = 40
				this.h = 27
			}
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
		},
		televerserVideo (event) {
			const fichier = event.target.files[0]
			if (fichier) {
				this.chargementVideo = true
				const reader = new FileReader()
				reader.readAsDataURL(fichier)
				reader.onloadend = function (e) {
					this.chargementVideo = false
					this.dataURL = e.target.result
					this.video = window.URL.createObjectURL(fichier)
					this.generer()
				}.bind(this)
			}
		},
		convertirDataURL (dataurl) {
			let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new Blob([u8arr], { type:mime })
		}
	}
}
</script>

<style>
.panneau .panneau-video .temps {
	margin-top: 2rem;
}

.panneau .panneau-video .debut,
.panneau .panneau-video .fin {
    display: inline-flex;
	justify-content: center;
	width: 50%;
	flex-wrap: wrap;
}

.panneau .panneau-video .temps .minutes-secondes {
    display: flex;
}

.panneau .panneau-video .temps .minutes {
    margin-right: 1rem;
}

.panneau .panneau-video .valider {
	display: flex;
}

.panneau .panneau-video .valider .bouton-secondaire {
    width: auto!important;
    margin-left: 0.5rem;
    height: 4rem!important;
}

.panneau .panneau-video .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-video .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-video .chargement {
	display: inline-block;
	border: 7px solid #ddd;
	border-top: 7px solid #00ced1;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	animation: rotation 0.7s linear infinite;
}
  
@keyframes rotation {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.panneau .panneau-video .separateur {
    position: relative;
    margin: 2rem 25% 2rem;
    text-align: center;
    width: 50%;
}

.panneau .panneau-video .separateur::before {
    position: absolute;
    top: 50%;
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: #ddd;
}

.panneau .panneau-video .separateur span {
    position: relative;
    margin: 0;
    font-size: 1.5rem;
    z-index: 2;
    display: inline-block;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    vertical-align: middle;
    background-color: #fff;
}

.panneau .panneau-video label.bouton {
	width: auto!important;
    display: inline-block!important;
	margin-top: 0;
	margin-bottom: 0!important;
}

.panneau .panneau-video video {
	max-width: 100%;
	height: auto;
}
</style>

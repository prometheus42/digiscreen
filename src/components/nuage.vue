<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'max': statut === 'max', 'min': statut === 'min'}" :isDraggable="true" :isResizable="redimensionnement" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="['tl', 'bl', 'br']" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre actif" :class="{'visible': statut === 'min'}" @dblclick="renommer(titre)">{{ titre }}</div>
				<div class="actions-panneau inactif">
					<span class="zoomer" role="button" tabindex="0" @click="zoomer" v-if="mode === 'lecture' && statut !== 'min'"><i class="material-icons">add</i></span>
					<span class="dezoomer" role="button" tabindex="0" @click="dezoomer" v-if="mode === 'lecture' && statut !== 'min'"><i class="material-icons">remove</i></span>
					<span class="recadrer" role="button" tabindex="0" @click="recadrer" v-if="mode === 'lecture' && statut !== 'min'"><i class="material-icons">center_focus_strong</i></span>
				</div>
				<div class="actions-panneau inactif">
					<span class="editer" role="button" tabindex="0" @click="editer" v-if="mode === 'lecture'"><i class="material-icons">arrow_back</i></span>
					<span class="afficher" role="button" tabindex="0" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
					<span class="afficher" role="button" tabindex="0" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
					<span class="afficher" role="button" tabindex="0" @click="maximiser" v-if="mode === 'lecture' && statut === ''"><i class="material-icons">fullscreen</i></span>
					<span class="afficher" role="button" tabindex="0" @click="normaliser" v-else-if="mode === 'lecture' && statut === 'max'"><i class="material-icons">fullscreen_exit</i></span>
					<span class="fermer" role="button" tabindex="0" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
				</div>
			</header>
			<div class="conteneur actif panneau-nuage">
				<div class="contenu inactif" v-if="mode === 'edition'">
					<div class="colonne gauche">
						<label class="mot">{{ $t('mots') }}</label>
						<label class="taille">{{ $t('taille') }}</label>
						<div class="mots">
							<div class="mot" v-for="(mot, index) in mots" :key="'mot_' + index">
								<input type="search" :value="mot[0]" @input="mots[index][0] = $event.target.value" :maxlength="30">
								<input type="number" :value="mot[1]" @input="mots[index][1] = $event.target.value" :min="10" :max="100">
							</div>
						</div>
						<span class="bouton-secondaire" role="button" tabindex="0" :title="$t('ajouterMot')" @click="ajouterMot"><i class="material-icons">add_circle_outline</i></span>
						<span class="bouton-secondaire" role="button" tabindex="0" :title="$t('ajouterListe')" @click="afficherListe"><i class="material-icons">list_alt</i></span>
					</div>
					<div class="colonne droite">
						<label>{{ $t('apercu') }}</label>
						<div class="nuage">
							<canvas :id="'canvas_' + id" class="canvas" />
						</div>
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="visualiser">{{ $t('apercu') }}</span>
							<span class="bouton" role="button" tabindex="0" :class="{'inactif': !apercu}" @click="generer">{{ $t('valider') }}</span>
						</div>
					</div>
					<transition name="fondu">
						<div class="liste" v-if="modale">
							<span class="consigne">{{ $t('consigneListeMots') }}</span>
							<textarea @input="liste = $event.target.value" :placeholder="$t('exempleListe')"></textarea>
							<div class="actions">
								<span class="bouton" role="button" tabindex="0" @click="fermerListe">{{ $t('annuler') }}</span>
								<span class="bouton" role="button" tabindex="0" @click="ajouterMots">{{ $t('ajouter') }}</span>
							</div>
						</div>
					</transition>
				</div>
				<img :src="nuage" alt="Nuage" v-else />
			</div>
		</vue-drag-resize>
	</transition>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import WordCloud from 'wordcloud'
import Panzoom from '@panzoom/panzoom'
import Panneau from '@/panneau'

export default {
	name: 'PNuage',
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
			x: 0,
			y: 0,
			z: 0,
			minw: 25,
			minh: 15,
			statut: '',
			dimensions: {},
			donnees: { w: 0, h: 0, x: 0, y: 0, zoom: 0 },
			mots: [['', 15], ['', 15], ['', 15], ['', 15], ['', 15], ['', 15], ['', 15], ['', 15], ['', 15], ['', 15]],
			nuage: '',
			modale: false,
			liste: '',
			apercu: false,
			panzoom: '',
			zoom: 1
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: { mots: this.mots, nuage: this.nuage, coordonnees: this.panzoom.getPan(), zoom: this.zoom }, w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
			}
		},
		zoom: function (zoom) {
			if (this.panzoom !== '' && zoom === 1) {
				this.panzoom.reset()
			} if (this.panzoom !== '' && zoom !== 1) {
				this.panzoom.zoom(zoom, { animated: true })
			}
		},
		finRedimensionnement: function (valeur) {
			if (valeur === true && this.mode === 'edition') {
				this.$nextTick(function () {
					const canvas = document.querySelector('#canvas_' + this.id)
					const rect = document.querySelector('#' + this.id + ' .nuage').getBoundingClientRect()
					canvas.width = (rect.width * 2) - 4
					canvas.height = (rect.height * 2) - 4
				}.bind(this))
			}
			this.positionner()
		}
	},
	created () {
		this.titre = this.$t('nuageMots')
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
			this.mots = this.panneau.contenu.mots
			this.nuage = this.panneau.contenu.nuage
			this.zoom = this.panneau.contenu.zoom
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
		if (this.mode === 'edition') {
			this.$nextTick(function () {
				if (this.statut !== 'min') {
					document.querySelector('#' + this.id + ' input').focus()
				}
				const canvas = document.querySelector('#canvas_' + this.id)
				const rect = document.querySelector('#' + this.id + ' .nuage').getBoundingClientRect()
				canvas.width = (rect.width * 2) - 4
				canvas.height = (rect.height * 2) - 4
				canvas.style.transform = 'scale(0.5)'
				canvas.style.transformOrigin = 'top left'
			}.bind(this))
		} else if (this.mode === 'lecture') {
			this.redimensionnement = true
			this.$nextTick(function () {
				const element = document.querySelector('#' + this.id + ' .conteneur img')
				this.panzoom = Panzoom(element, {
					maxScale: 15,
					minScale: 0.5,
					panOnlyWhenZoomed: true
				})
				if (this.panneau.contenu.coordonnees) {
					const coordonnees = this.panneau.contenu.coordonnees
					this.panzoom.zoom(this.zoom)
					setTimeout(function () { this.panzoom.pan(coordonnees.x, coordonnees.y) }.bind(this))
				}
				element.parentElement.addEventListener('wheel', this.panzoom.zoomWithWheel)
				element.addEventListener('panzoomchange', this.modifierZoom)
			}.bind(this))
		}
	},
	methods: {
		generer () {
			if (this.apercu) {
				this.mode = 'lecture'
				this.redimensionnement = true
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 40
					this.h = 30
				}
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				if (this.donnees.zoom > 0) {
					this.zoom = this.donnees.zoom
				} else {
					this.zoom = 1.5
				}
				this.positionner()
				const canvas = document.querySelector('#canvas_' + this.id)
				this.nuage = canvas.toDataURL('image/png')
				this.$nextTick(function () {
					const element = document.querySelector('#' + this.id + ' .conteneur img')
					this.panzoom = Panzoom(element, {
						maxScale: 15,
						minScale: 0.5,
						panOnlyWhenZoomed: true
					})
					this.panzoom.zoom(this.zoom)
					element.parentElement.addEventListener('wheel', this.panzoom.zoomWithWheel)
					element.addEventListener('panzoomchange', this.modifierZoom)
				}.bind(this))
			}
		},
		visualiser () {
			const mots = this.mots.filter(function (item) {
				return item[0] !== ''
			})
			const fonts = ['Abril Fatface', 'Baloo Bhaijaan']
			const font = fonts[Math.floor(Math.random() * fonts.length)]
			if (mots.length > 0) {
				WordCloud(document.querySelector('#canvas_' + this.id), {
					list: mots,
					gridSize: 30,
					weightFactor: 4,
					fontFamily: font,
					color: function () {
						const couleurs = ['#00c3c6', '#dd083b', '#1abc9c', '#9b59b6', '#3498db', '#f1c40f', '#e67e22', '#30336b', '#40739e', '#20bf6b', '#485460', '#ea8685', '#17c0eb', '#fda7df']
						return couleurs[Math.floor(Math.random() * couleurs.length)]
					},
					backgroundColor: '#ffffff',
					drawOutOfBound: false,
					shrinkToFit: true
				})
				this.apercu = true
			} else {
				this.apercu = false
			}
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			const element = document.querySelector('#' + this.id + ' .conteneur img')
			element.parentElement.removeEventListener('wheel', this.panzoom.zoomWithWheel)
			element.removeEventListener('panzoomchange', this.modifierZoom)
			this.panzoom.destroy()
			this.panzoom = ''
			this.donnees.zoom = this.zoom
			this.zoom = 1
			if (this.statut !== '') {
				this.normaliser()
			}
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 80
			this.h = 59.5
			this.positionner()
			this.$nextTick(function () {
				const canvas = document.querySelector('#canvas_' + this.id)
				const rect = document.querySelector('#' + this.id + ' .nuage').getBoundingClientRect()
				canvas.width = (rect.width * 2) - 4
				canvas.height = (rect.height * 2) - 4
				canvas.style.transform = 'scale(0.5)'
				canvas.style.transformOrigin = 'top left'
				this.visualiser()
			}.bind(this))
		},
		ajouterMot () {
			this.mots.push(['', 15])
			this.$nextTick(function () {
				const element = document.querySelector('#' + this.id + ' .mots')
				element.scrollTop = element.scrollHeight
				element.lastChild.querySelector('input').focus()
			})
		},
		ajouterMots () {
			const liste = this.liste.split(',')
			if (liste.length > 0) {
				liste.forEach(function (mot) {
					if (mot.trim() !== '') {
						const mots = this.mots.filter(function (item) {
							return item[0] !== ''
						})
						mots.push([mot, 15])
						this.mots = mots
						if (this.mots.length < 11) {
							const total = 10 - this.mots.length
							for (let i = 0; i < total; i++) {
								this.mots.push(['', 15])
							}
						}
						this.$nextTick(function () {
							const element = document.querySelector('#' + this.id + ' .mots')
							element.scrollTop = element.scrollHeight
						}.bind(this))
					}
				}.bind(this))
				this.liste = ''
				this.modale = false
			}
		},
		afficherListe () {
			this.modale = true
		},
		fermerListe () {
			this.modale = false
		},
		zoomer () {
			if (this.zoom < 15) {
				this.zoom = this.zoom + 0.1
			}
		},
		dezoomer () {
			if (this.zoom > 0.5) {
				this.zoom = this.zoom - 0.1
			}
		},
		recadrer () {
			this.zoom = 1
		},
		modifierZoom (event) {
			this.zoom = event.detail.scale
		}
	}
}
</script>

<style>
.panneau .panneau-nuage {
	overflow: hidden!important;
	border-bottom-left-radius: 1rem;
	border-bottom-right-radius: 1rem;
}

.panneau .conteneur .colonne.gauche {
	width: 25%;
    display: inline-flex;
    flex-wrap: wrap;
}

.panneau .conteneur .colonne.droite {
	width: 75%;
    display: inline-flex;
    flex-wrap: wrap;
}

.panneau .conteneur div.mot {
    display: flex;
	margin-bottom: 0.5rem;
}

.panneau .conteneur div.mot:last-child {
	margin-bottom: 0;
}

.panneau .conteneur .mot input[type="search"] {
	padding: 0.7rem;
}

.panneau .conteneur .mot input[type="number"] {
    width: 6rem;
    margin-left: 0.5rem;
	padding: 0.7rem;
}

.panneau .conteneur .colonne.gauche label.mot,
.panneau .conteneur .colonne.gauche label.taille {
	display: inline-block;
	width: auto;
}

.panneau .conteneur .colonne.gauche label.mot {
	width: calc(100% - 7rem);
}

.panneau .conteneur .colonne.gauche label.taille {
	width: 7rem;
}

.panneau .conteneur .colonne.gauche .mots {
	height: 44.5rem;
	overflow: auto;
}

.panneau .conteneur .colonne.gauche .bouton-secondaire {
	width: 50%;
	text-align: center;
	margin-top: 1rem;
}

.panneau .conteneur .canvas {
    display: block;
    position: relative;
    overflow: hidden;
}

.panneau .conteneur .colonne.droite .nuage {
	width: calc(100% - 1rem);
	margin-left: 1rem;
    height: 44.5rem;
	border: 1px solid #ddd;
}

.panneau .conteneur .liste .actions,
.panneau .conteneur .colonne.droite .actions {
	width: 100%;
}

.panneau .conteneur .colonne.droite .bouton.inactif:hover,
.panneau .conteneur .colonne.droite .bouton.inactif {
	background: #ccc;
	cursor: default;
}

.panneau .liste {
	position: absolute;
	display: flex;
	flex-wrap: wrap;
	left: 2rem;
    bottom: 3rem;
    background: #eee;
    width: 40rem;
    padding: 2rem;
    border-radius: 1rem;
	box-shadow: 0 1.4rem 2.8rem rgba(0, 0, 0, 0.25), 0 1rem 1rem rgba(0, 0, 0, 0.22);
}

.panneau .liste textarea {
	max-height: 18rem;
	height: 18rem;
}

.panneau .panneau-nuage img {
    max-width: 100%;
    max-height: 100%;
    align-self: center;
}
</style>

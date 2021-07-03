<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'min': statut === 'min'}" :isDraggable="true" :isResizable="false" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="[]" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}" @dblclick="renommer(titre)">{{ titre }}</div>
				<div class="actions-panneau inactif">
					<span class="afficher" role="button" tabindex="0" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
					<span class="afficher" role="button" tabindex="0" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
					<span class="fermer" role="button" tabindex="0" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
				</div>
			</header>
			<div class="conteneur actif panneau-chrono">
				<div class="contenu inactif">
					<div class="chrono">
						<span class="minutes">{{ texteMinutes }}</span>
						<span class="separateur">:</span>
						<span class="secondes">{{ texteSecondes }}</span>
						<span class="separateur">:</span>
						<span class="millisecondes">{{ texteMillisecondes }}</span>
					</div>
					<div class="actions">
						<span class="bouton" role="button" tabindex="0" @click="demarrer" v-if="mode === 'stop'">{{ $t('demarrer') }}</span>
						<span class="bouton" role="button" tabindex="0" @click="demarrer" v-else-if="mode === 'pause'"><i class="material-icons">play_arrow</i></span>
						<span class="bouton" role="button" tabindex="0" @click="pause" v-else-if="mode === 'lecture'"><i class="material-icons">pause</i></span>
						<span class="bouton" role="button" tabindex="0" @click="stop" v-if="mode !== 'stop'"><i class="material-icons">autorenew</i></span>
					</div>
				</div>
			</div>
		</vue-drag-resize>
	</transition>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import Panneau from '@/panneau'

export default {
	name: 'PChrono',
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
			mode: 'stop',
			deplacement: false,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			z: 0,
			minw: 48,
			minh: 22,
			statut: '',
			dimensions: {},
			chrono: '',
			millisecondesPause: 0,
			millisecondesEcoulees: 0,
			minutes: 0,
			secondes: 0,
			millisecondes: 0,
			texteMinutes: '00',
			texteSecondes: '00',
			texteMillisecondes: '000'
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, statut: this.statut, dimensions: this.dimensions, contenu: '', w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
			}
		},
		finRedimensionnement: function () {
			this.positionner()
		},
		hauteurPage: function () {
			this.positionner()
		}
	},
	created () {
		this.titre = this.$t('chronometre')
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
		if (this.panneau.statut === 'min') {
			this.minimiser()
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
	},
	methods: {
		demarrer () {
			this.chrono = this.arreterTempsMillisecondes(this.chrono)
			const ms = this.demarrerTempsMillisecondes(this.millisecondesPause)
			this.millisecondesPause = 0
			this.chrono = setInterval(function () {
				this.millisecondesEcoulees = this.recupererTempsMillisecondes(ms)
				if (this.millisecondes < 10) {
					this.texteMillisecondes = '00' + this.millisecondes
				} else if (this.millisecondes < 100) {
					this.texteMillisecondes = '0' + this.millisecondes
				} else {
					this.texteMillisecondes = this.millisecondes
				}
				if (this.secondes < 10) {
					this.texteSecondes = '0' + this.secondes
				} else {
					this.texteSecondes = this.secondes
				}
				if (this.minutes < 10) {
					this.texteMinutes = '0' + this.minutes
				} else {
					this.texteMinutes = this.minutes
				}
				if (this.minutes >= 59 && this.secondes >=59 && this.millisecondes > 900) {
					this.chrono = this.arreterTempsMillisecondes(this.chrono)
				}
				this.millisecondes = this.millisecondesEcoulees
				if (this.secondes > 59) {
					this.secondes = 0
					this.minutes++
				}
				if (this.millisecondes > 999) {
					this.millisecondes = 0
					this.secondes++
					this.demarrer()
				}
			}.bind(this), 10)
			if (this.mode !== 'lecture') {
				this.mode = 'lecture'
			}
		},
		pause () {
			this.millisecondesPause = this.millisecondesEcoulees
			this.chrono = this.arreterTempsMillisecondes(this.chrono)
			this.mode = 'pause'
		},
		stop () {
			this.chrono = this.arreterTempsMillisecondes(this.chrono)
			this.minutes = 0
			this.secondes = 0
			this.millisecondes = 0
			this.texteMinutes = '00'
			this.texteSecondes = '00'
			this.texteMillisecondes = '000'
			this.mode = 'stop'
		},
		arreterTempsMillisecondes (chrono) {
			if (chrono) { 
				clearInterval(chrono)
			}
			return chrono
		},
		demarrerTempsMillisecondes (ms) {
			const date = new Date()
			return date.getTime() - ms
		},
		recupererTempsMillisecondes (ms) {
			if (ms > 0) {
				const date = new Date()
				return date.getTime() - ms
			} else {
				return 0
			}
		}
	}
}
</script>

<style>
.chrono {
	font-family: 'Orbitron', sans-serif;
	font-size: 5rem;
	letter-spacing: 0.5rem;
	display: flex;
	padding: 2rem;
	border: 2px solid #ddd;
	border-radius: 1em;
	justify-content: center;
	text-align: center;
	user-select: none;
}

.chrono span {
	display: inline-block;
	text-indent: 0.5rem;
}

.chrono .minutes,
.chrono .secondes {
	width: 11rem;
}

.chrono .millisecondes {
	width: 16.5rem;
	text-indent: 0.5rem;
}
</style>

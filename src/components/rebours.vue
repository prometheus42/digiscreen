<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'min': statut === 'min'}" :isDraggable="true" :isResizable="false" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="[]" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}">{{ titre }}</div>
				<div class="actions-panneau inactif">
					<span class="editer" role="button" @click="editer" v-if="mode !== 'edition'"><i class="material-icons">arrow_back</i></span>
					<span class="afficher" role="button" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
					<span class="afficher" role="button" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
					<span class="fermer" role="button" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
				</div>
			</header>
			<div class="conteneur actif panneau-rebours">
				<div class="contenu inactif" v-if="mode === 'edition'">
					<div class="rebours">
						<div class="minutes">
							<label>{{ $t('minutes') }}</label>
							<input type="number" :value="minutes" :min="0" @input="minutes = $event.target.value">
						</div>
						<div class="secondes">
							<label>{{ $t('secondes') }}</label>
							<input type="number" :value="secondes" :min="0" :max="59" @input="secondes = $event.target.value">
						</div>
					</div>
					<div class="actions">
						<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
					</div>
				</div>
				<div class="contenu inactif" v-else>
					<div class="rebours">
						<div class="decompte">
							<span class="minutes">{{ texteMinutes }}</span>
							<span class="separateur">:</span>
							<span class="secondes">{{ texteSecondes }}</span>
						</div>
					</div>
					<div class="actions">
						<span class="bouton danger" v-if="tempsEcoule">{{ $t('tempsEcoule') }}</span>
						<span class="bouton" role="button" tabindex="0" @click="demarrer(0)" v-else-if="mode === 'lecture'">{{ $t('demarrer') }}</span>
						<span class="bouton" role="button" @click="pause" v-else-if="mode === 'decompte'"><i class="material-icons">pause</i></span>
						<span class="bouton" role="button" @click="continuer" v-else-if="mode === 'pause'"><i class="material-icons">play_arrow</i></span>
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
	name: 'PRebours',
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
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			z: 0,
			minw: 40,
			minh: 22.2,
			statut: '',
			dimensions: {},
			minutes: 0,
			secondes: 0,
			texteMinutes: '',
			texteSecondes: '',
			duree: '',
			decompte: '',
			tempsRestant: '',
			tempsEcoule: false
		}
	},
	computed: {
		titre () {
			return this.$t('compteRebours')
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: { minutes: this.minutes, secondes: this.secondes }, w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
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
		if (this.panneau.statut === 'min') {
			this.minimiser()
		}
		if (this.panneau.contenu !== '') {
			this.minutes = this.panneau.contenu.minutes
			this.secondes = this.panneau.contenu.secondes
		}
		if (this.mode === 'lecture') {
			this.generer()
		}
	},
	mounted () {
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' .minutes input').focus()
			}.bind(this))
		}
	},
	methods: {
		generer () {
			if (this.minutes >= 1 || this.secondes >= 1) {
				this.mode = 'lecture'
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
			}
		},
		editer () {
			this.mode = 'edition'
			this.texteMinutes = ''
			this.texteSecondes = ''
			this.duree = ''
			this.tempsRestant = ''
			this.tempsEcoule = false
			if (this.statut !== '') {
				this.normaliser()
			}
			if (this.decompte !== '') {
				clearInterval(this.decompte)
				this.decompte = ''
			}
		},
		demarrer (laps) {
			if (laps === 0) {
				const maintenant = Date.parse(new Date())
				this.duree = new Date(maintenant + (((parseInt(this.texteMinutes) * 60) + (parseInt(this.texteSecondes) - 1)) * 1000));
			} else {
				this.duree = laps
			}
			this.decompter()
			this.decompte = setInterval(this.decompter, 1000)
			this.mode = 'decompte'
		},
		decompter () {
			const temps = this.calculerTempsRestant(this.duree)
			if (temps.secondes < 10) {
				this.texteSecondes = '0' + temps.secondes
			} else {
				this.texteSecondes = temps.secondes
			}
			if (temps.minutes < 10) {
				this.texteMinutes = '0' + temps.minutes
			} else {
				this.texteMinutes = temps.minutes
			}
			if (temps.total <= 0) {
				clearInterval(this.decompte)
				this.tempsEcoule = true
			}
		},
		pause () {
			clearInterval(this.decompte)
			this.tempsRestant = this.calculerTempsRestant(this.duree).total
			this.mode = 'pause'
		},
		continuer () {
			this.duree = new Date(Date.parse(new Date()) + this.tempsRestant)
			this.demarrer(this.duree)
			this.mode = 'decompte'
		},
		calculerTempsRestant (d) {
			const temps = Date.parse(d) - Date.parse(new Date())
			const secondes = Math.floor((temps / 1000) % 60 )
			const minutes = Math.floor((temps / 1000 / 60) % 60 )
			return { 'total': temps, 'minutes': minutes, 'secondes': secondes }
		}
	}
}
</script>

<style>
.rebours .minutes,
.rebours .secondes {
	display: inline-block;
}

.rebours .minutes {
	margin-right: 2rem;
}

.rebours .decompte {
	font-family: 'Orbitron', sans-serif;
	font-size: 5rem;
	letter-spacing: 0.5rem;
    padding: 2rem;
	border: 2px solid #ddd;
	border-radius: 1em;
	display: flex;
	justify-content: center;
	text-align: center;
	user-select: none;
}

.rebours .decompte span {
	display: inline-block;
	text-indent: 0.5rem;
}

.rebours .decompte .minutes,
.rebours .decompte .secondes {
	width: 11rem;
	margin: 0;
}

.rebours + .actions .bouton {
	margin-right: 0!important;
}

.actions .bouton.danger:hover,
.actions .bouton.danger {
	background: #ff7575!important;
	cursor: default;
}
</style>

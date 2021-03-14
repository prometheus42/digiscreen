<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'min': statut === 'min'}" :isDraggable="true" :isResizable="redimensionnement" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="['tl', 'bl', 'br']" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}">{{ titre }}</div>
				<div class="actions-panneau inactif">
					<span class="editer" role="button" @click="editer" v-if="mode === 'lecture'"><i class="material-icons">arrow_back</i></span>
					<span class="afficher" role="button" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
					<span class="afficher" role="button" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
					<span class="fermer" role="button" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
				</div>
			</header>
			<div class="conteneur actif">
				<div class="contenu inactif panneau-texte">
					<div class="texte" v-if="mode === 'lecture'" v-html="texte" />
					<div class="editeur" v-if="mode === 'edition'" />
					<span class="bouton" role="button" @click="generer" v-if="mode === 'edition'">{{ $t('valider') }}</span>
				</div>
			</div>
		</vue-drag-resize>
	</transition>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import pell from 'pell'
import Panneau from '@/panneau'

export default {
	name: 'PTexte',
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
			x: 0,
			y: 0,
			z: 0,
			minw: 20,
			minh: 8,
			statut: '',
			dimensions: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			editeur: '',
			texte: ''
		}
	},
	computed: {
		titre () {
			return this.$t('texte')
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: this.texte, w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
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
			this.texte = this.panneau.contenu
		}
		if (this.mode === 'lecture') {
			this.redimensionnement = true
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
		if (this.mode === 'edition') {
			this.$nextTick(function () {
				this.creer()
				document.getElementsByClassName('pell-content')[0].focus()
			}.bind(this))
		}
	},
	methods: {
		generer () {
			if (this.texte !== '') {
				this.mode = 'lecture'
				this.redimensionnement = true
				this.editeur = ''
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 30
					this.h = 20
				}
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				this.positionner()
			}
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.$nextTick(function () {
				this.creer()
				if (this.statut !== '') {
					this.normaliser()
				}
				this.donnees.w = this.w
				this.donnees.h = this.h
				this.donnees.x = this.x
				this.donnees.y = this.y
				this.w = 53
				this.h = 46
				this.positionner()
			}.bind(this))
		},
		creer () {
			const that = this
			this.editeur = pell.init({
				element: document.querySelector('#' + this.id + ' .editeur'),
				onChange: function (texte) {
					this.texte = texte
				}.bind(this),
				actions: [
					{ name: 'gras', title: that.$t('gras'), icon: '<i class="material-icons">format_bold</i>', result: () => pell.exec('bold') },
					{ name: 'italique', title: that.$t('italique'), icon: '<i class="material-icons">format_italic</i>', result: () => pell.exec('italic') },
					{ name: 'souligne', title: that.$t('souligne'), icon: '<i class="material-icons">format_underlined</i>', result: () => pell.exec('underline') },
					{ name: 'barre', title: that.$t('barre'), icon: '<i class="material-icons">format_strikethrough</i>', result: () => pell.exec('strikethrough') },
					{ name: 'listedecimale', title: that.$t('listeDecimale'), icon: '<i class="material-icons">format_list_numbered</i>', result: () => pell.exec('insertOrderedList') },
					{ name: 'liste', title: that.$t('liste'), icon: '<i class="material-icons">format_list_bulleted</i>', result: () => pell.exec('insertUnorderedList') },
					{ name: 'aligner-gauche', title: that.$t('alignerGauche'), icon: '<i class="material-icons">format_align_left</i>', result: () => pell.exec('JustifyLeft') },
					{ name: 'centrer', title: that.$t('centrer'), icon: '<i class="material-icons">format_align_center</i>', result: () => pell.exec('JustifyCenter') },
					{ name: 'noir', title: that.$t('noir'), icon: '<i class="material-icons" style="color: black;">fiber_manual_record</i>', result: () => pell.exec('foreColor', 'black') },
					{ name: 'rouge', title: that.$t('rouge'), icon: '<i class="material-icons" style="color: #ea6051;">fiber_manual_record</i>', result: () => pell.exec('foreColor', '#ea6051') },
					{ name: 'jaune', title: that.$t('jaune'), icon: '<i class="material-icons" style="color: #f1c40f;">fiber_manual_record</i>', result: () => pell.exec('foreColor', '#f1c40f') },
					{ name: 'vert', title: that.$t('vert'), icon: '<i class="material-icons" style="color: #2ecc71;">fiber_manual_record</i>', result: () => pell.exec('foreColor', '#2ecc71') },
					{ name: 'bleu', title: that.$t('bleu'), icon: '<i class="material-icons" style="color: #3498db;">fiber_manual_record</i>', result: () => pell.exec('foreColor', '#3498db') },
					{ name: 'violet', title: that.$t('violet'), icon: '<i class="material-icons" style="color: #9b59b6;">fiber_manual_record</i>', result: () => pell.exec('foreColor', '#9b59b6') }
				]
			})
			this.editeur.onpaste = function (event) {
				event.preventDefault()
				event.stopPropagation()
				const texte = event.clipboardData.getData('text/plain')
				pell.exec('insertText', texte)
			}
			this.editeur.content.innerHTML = this.texte
		}
	}
}
</script>

<style>
.panneau .conteneur .texte {
	font-weight: 400;
	font-size: 3.2rem;
	line-height: 1.4;
	user-select: none;
}

.editeur {
	border-bottom: 1px solid #ddd;
}

.editeur,
.pell-content {
    box-sizing: border-box;
}

.pell-content {
	font-size: 2.4rem;
    height: 30rem;
	outline: 0;
	line-height: 1.5;
	padding: 2rem 1rem;
	position: sticky;
	text-align: left;
	overflow: auto;
	top: 0;
	cursor: text;
}

.pell-actionbar {
    background-color: #fff;
	border-bottom: 1px solid #ddd;
	position: sticky;
	z-index: 1;
	top: 0;
}

.pell-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    height: 3.4rem;
    outline: 0;
    width: 3.4rem;
	vertical-align: bottom;
	font-size: 2.4rem;
}

.pell-button-selected {
    background-color: #f0f0f0;
}
</style>

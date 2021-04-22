<template>
	<div class="conteneur-menu">
		<div class="menu" :class="{'ouvert': ouvert}">
			<header>
				<span class="titre">{{ $t('options') }}</span>
				<span class="fermer" role="button" @click="$parent.fermerMenu"><i class="material-icons">close</i></span>
			</header>
			<div class="conteneur">
				<div class="contenu">
					<label>{{ $t('langue') }}</label>
					<div class="langue">
						<span :class="{'selectionne': $parent.langue === 'fr'}" @click="modifierLangue('fr')">FR</span>
						<span :class="{'selectionne': $parent.langue === 'es'}" @click="modifierLangue('es')">ES</span>
						<span :class="{'selectionne': $parent.langue === 'it'}" @click="modifierLangue('it')">IT</span>
						<span :class="{'selectionne': $parent.langue === 'en'}" @click="modifierLangue('en')">EN</span>
					</div>
					<label>{{ $t('imageFondPage') }}</label>
					<div class="fond">
						<span @click="modifierFond('./static/img/digitale.jpg')">
							<img src="@/assets/img/miniatures/digitale.jpg" alt="Digitale">
						</span>
						<span @click="modifierFond('./static/img/lavande.jpg')">
							<img src="@/assets/img/miniatures/lavande.jpg" alt="Lavande">
						</span>
						<span @click="modifierFond('./static/img/plage.jpg')">
							<img src="@/assets/img/miniatures/plage.jpg" alt="Plage">
						</span>
						<span @click="modifierFond('./static/img/lac.jpg')">
							<img src="@/assets/img/miniatures/lac.jpg" alt="Lac">
						</span>
						<span @click="modifierFond('./static/img/feuilles.jpg')">
							<img src="@/assets/img/miniatures/feuilles.jpg" alt="Feuilles">
						</span>
						<span @click="modifierFond('./static/img/arbre.jpg')">
							<img src="@/assets/img/miniatures/arbre.jpg" alt="Arbre">
						</span>
						<span @click="modifierFond('./static/img/aurore.jpg')">
							<img src="@/assets/img/miniatures/aurore.jpg" alt="Aurore">
						</span>
					</div>
					<div class="recherche" v-if="pixabayAPIKey !== ''">
						<div class="rechercher">
							<input type="text" :value="requete" @input="requete = $event.target.value" @keyup="verifierRequete" @keydown.enter="valider" :placeholder="$t('lienImageRecherche')">
							<span role="button" :title="$t('rechercher')" class="bouton-secondaire" @click="valider"><i class="material-icons">search</i></span>
						</div>
						<div class="resultats" v-if="Object.keys(resultats).length > 0">
							<div class="item" :data-w="image.previewWidth" :data-h="image.previewHeight" v-for="(image, index) in resultats.hits" @click="modifierFond(image.largeImageURL)" :key="'image_' + index">
								<img :src="image.previewURL">
							</div>
						</div>
						<div class="navigation" v-if="Object.keys(resultats).length > 0 && (page > 1 || page < (resultats.total / 15))">
							<span :class="{'invisible': page < 2}" @click="modifierPage('precedente')">{{ $t('pagePrecedente') }}</span>
							<span :class="{'invisible': page >= (resultats.total / 15)}" @click="modifierPage('suivante')">{{ $t('pageSuivante') }}</span>
						</div>
					</div>
					<label>{{ $t('pages') }}</label>
					<div class="pages">
						<span :class="{'selectionne': $parent.page === index}" @click="afficherPage(index)" v-for="index in $parent.pages.length" :key="'page_' + index">{{ index }}</span>
						<span role="button" :title="$t('ajouterPage')" class="bouton-secondaire" @click="ajouterPage" v-if="this.$parent.pages.length < 7"><i class="material-icons">add_circle_outline</i></span>
					</div>
					<label>{{ $t('exporter') }}</label>
					<span role="button" class="bouton" tabindex="0" @click="exporter">{{ $t('exporterEcran') }}</span>
					<label>{{ $t('importer') }}</label>
					<label for="televerser" class="bouton">{{ $t('importerEcran') }}</label>
					<input type="file" id="televerser" name="televerser" style="display: none;" accept=".dgb, .dgs" @change="importer">
					<label>{{ $t('modules') }}</label>
					<div class="modules">
						<div class="module">
							<span>{{ $t('codeqr') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="codeqr" :checked="$parent.modules.includes('codeqr')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('texte') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="texte" :checked="$parent.modules.includes('texte')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('image') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="image" :checked="$parent.modules.includes('image')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('dessin') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="dessin" :checked="$parent.modules.includes('dessin')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('document') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="document" :checked="$parent.modules.includes('document')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('audio') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="audio" :checked="$parent.modules.includes('audio')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('syntheseVocale') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="synthese" :checked="$parent.modules.includes('synthese')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('videoYoutube') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="video" :checked="$parent.modules.includes('video')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('contenuIntegre') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="iframe" :checked="$parent.modules.includes('iframe')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('nuageMots') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="nuage" :checked="$parent.modules.includes('nuage')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('remiseOrdre') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="ordre" :checked="$parent.modules.includes('ordre')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('texteATrous') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="trous" :checked="$parent.modules.includes('trous')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('tirageSort') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="tirage" :checked="$parent.modules.includes('tirage')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('des') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="des" :checked="$parent.modules.includes('des')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('groupes') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="groupes" :checked="$parent.modules.includes('groupes')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('chronometre') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="chrono" :checked="$parent.modules.includes('chrono')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('compteRebours') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="rebours" :checked="$parent.modules.includes('rebours')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('confettis') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="bravo" :checked="$parent.modules.includes('bravo')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('grille') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="grille" :checked="$parent.modules.includes('grille')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MParametres',
	data () {
		return {
			ouvert: false,
			image: '',
			pixabayAPIKey: '',
			requete: '',
			resultats: {},
			page: 1
		}
	},
	watch: {
		page: function (page) {
			this.rechercher(page)
		}
	},
	created () {
		if (process.env.VUE_APP_PIXABAY_API_KEY) {
			this.pixabayAPIKey = process.env.VUE_APP_PIXABAY_API_KEY
		}
	},
	mounted () {
		setTimeout(function () {
			this.ouvert = true
		}.bind(this), 10)
	},
	methods: {
		modifierLangue (langue) {
			this.$root.$i18n.locale = langue
			this.$parent.langue = langue
		},
		modifierFond (fond) {
			const index = this.$parent.page - 1
			this.$parent.pages[index].fond = fond
		},
		valider () {
			if (this.requete !== '' && this.$verifierURL(this.requete) === true) {
				this.modifierFond(this.requete)
			} else if (this.requete !== '') {
				this.rechercher(1)
			}
		},
		rechercher (page) {
			if (this.requete !== '') {
				const requete = this.requete.replace(/\s+/g, '+')
				const xhr = new XMLHttpRequest()
				xhr.onload = function () {
					if (xhr.readyState === xhr.DONE && xhr.status === 200) {
						const donnees = JSON.parse(xhr.responseText)
						if (donnees && donnees.total > 0) {
							this.resultats = donnees
							this.$nextTick(function () {
								// eslint-disable-next-line
								new flexImages({ selector: '.resultats', rowHeight: this.$convertirRem(6.5) })
							})
						}
					}
				}.bind(this)
				if (page === 1) {
					this.page = page
				}
				xhr.open('GET', 'https://pixabay.com/api/?key=' + this.pixabayAPIKey + '&q=' + requete + '&image_type=photo&lang=fr&orientation=horizontal&safesearch=true&per_page=15&page=' + page, true)
				xhr.send()
			}
		},
		modifierPage (type) {
			if (type === 'suivante' && this.page < (this.resultats.total / 15)) {
				this.page++
			} else if (type === 'precedente' && this.page > 1) {
				this.page--
			}
		},
		verifierRequete () {
			if (this.requete === '') {
				this.resultats = {}
				this.page = 1
			}
		},
		ajouterPage () {
			let index = this.$parent.pages.length
			if (index < 7) {
				index++
				let fond = ''
				switch (index) {
				case 2:
					fond = './static/img/lavande.jpg'
					break
				case 3:
					fond = './static/img/plage.jpg'
					break
				case 4:
					fond = './static/img/lac.jpg'
					break
				case 5:
					fond = './static/img/feuilles.jpg'
					break
				case 6:
					fond = './static/img/arbre.jpg'
					break
				case 7:
					fond = './static/img/aurore.jpg'
					break
				}
				this.$parent.pages.push({ fond: fond, grille: {}, annotations: {} })
			}
		},
		afficherPage (page) {
			this.$parent.page = page
		},
		importer (event) {
			this.$parent.importer(event)
			this.$parent.fermerMenu()
		},
		exporter () {
			const date = new Date()
			const annee = date.getFullYear()
			let mois = date.getMonth() + 1
			if (mois < 10) {
				mois = '0' + mois
			}
			let jour = date.getDate()
			if (jour < 10) {
				jour = '0' + jour
			}
			let heures = date.getHours()
			if (heures < 10) {
				heures = '0' + heures
			}
			let minutes = date.getMinutes()
			if (minutes < 10) {
				minutes = '0' + minutes
			}
			const fichier = 'ecran_' + jour + '-' + mois + '-' + annee + '_' + heures + '-' + minutes
			this.$parent.exporter(fichier)
			this.$parent.fermerMenu()
		},
		modifierModule (event) {
			this.$parent.modifierModule(event)
		}
	}
}
</script>

<style>
.menu .pages,
.menu .langue,
.menu .fond,
.menu .recherche {
	margin-bottom: 2rem;
}

.menu .pages span:not(.bouton-secondaire),
.menu .langue span {
	display: inline-flex;
	width: 4.8rem;
	height: 4.8rem;
	justify-content: center;
	align-items: center;
	line-height: 1;
	font-size: 2rem;
	border-radius: 50%;
	margin-right: 1rem;
	border: 1px solid #ddd;
	cursor: pointer;
	user-select: none;
}

.menu .pages span.selectionne,
.menu .langue span.selectionne {
	background: #444;
	color: #fff;
	border: 1px solid #222;
}

.menu .fond span {
	display: inline-block;
	margin-right: 1rem;
	cursor: pointer;
}

.menu .fond span img {
	width: 4.8rem;
	height: 4.8rem;
	font-size: 0;
	line-height: 1;
	border-radius: 50%;
	user-select: none;
}

.menu .pages span:last-child,
.menu .fond span:last-child,
.menu .langue span:last-child {
	margin-right: 0;
}

.menu .conteneur .bouton {
	margin-top: 0;
	margin-bottom: 2rem;
	width: auto;
	display: inline-block;
}

.menu .modules {
	width: 100%;
}

.menu .modules .module {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.menu .modules .module:last-child {
	margin-bottom: 0;
}

.menu .modules .module .interrupteur {
	position: relative;
	display: inline-block;
	width: 6rem;
	height: 3.4rem;
}

.menu .modules .module .interrupteur input {
	display: none;
}

.menu .modules .module .interrupteur .curseur {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ddd;
	transition: 0.3s;
}

.menu .modules .module .interrupteur .curseur::before {
	position: absolute;
	content: '';
	height: 2.6rem;
	width: 2.6rem;
	left: 0.4rem;
	bottom: 0.4rem;
	background-color: #fff;
	transition: 0.3s;
}

.menu .modules .module .interrupteur input:checked + .curseur {
	background-color: #00ced1;
}

.menu .modules .module .interrupteur input:focus + .curseur {
	box-shadow: 0 0 1px #00ced1;
}

.menu .modules .module .interrupteur input:checked + .curseur::before {
	transform: translateX(2.6rem);
}
</style>

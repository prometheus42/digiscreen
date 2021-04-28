<template>
	<main :style="definirFond()">
		<div id="alerte" v-if="alerte">
			<div class="conteneur">
				<span class="marque">Digiscreen by La Digitale</span>
				<span class="message">{{ $t('alerte') }}</span>
			</div>
		</div>
		<div id="chargement" v-if="chargement">Digiscreen by La Digitale</div>
		<div id="import" :class="{'termine': importTermine}" v-if="importDonnees">
			<div class="chargement"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
		</div>
		<annotation :panneaux="panneaux" :annotations="annotations" :largeur="largeur" :hauteur="hauteur" @fermer="arreterAnnoter" v-if="annotation" />
		<div id="grille" :class="grille.couleur + ' grille-' + grille.colonnes" v-if="Object.keys(grille).length > 0">
			<span v-for="element in (grille.colonnes * grille.lignes)" :key="'element_' + element" />
		</div>
		<nav v-if="!alerte" :data-html2canvas-ignore="true">
			<div @click="creerPanneau('codeqr')" v-if="modules.includes('codeqr')" :title="$t('codeqr')">
				<span class="icone"><i class="material-icons">qr_code</i></span>
				<span class="titre">{{ $t('codeqr') }}</span>
			</div>
			<div @click="creerPanneau('texte')" v-if="modules.includes('texte')" :title="$t('texte')">
				<span class="icone"><i class="material-icons">title</i></span>
				<span class="titre">{{ $t('texte') }}</span>
			</div>
			<div @click="creerPanneau('image')" v-if="modules.includes('image')" :title="$t('image')">
				<span class="icone"><i class="material-icons">insert_photo</i></span>
				<span class="titre">{{ $t('image') }}</span>
			</div>
			<div @click="creerPanneau('dessin')" v-if="modules.includes('dessin')" :title="$t('dessin')">
				<span class="icone"><i class="material-icons">gesture</i></span>
				<span class="titre">{{ $t('dessin') }}</span>
			</div>
			<div @click="creerPanneau('document')" v-if="modules.includes('document')" :title="$t('document')">
				<span class="icone"><i class="material-icons">description</i></span>
				<span class="titre">{{ $t('doc') }}</span>
			</div>
			<div @click="creerPanneau('audio')" v-if="modules.includes('audio')" :title="$t('audio')">
				<span class="icone"><i class="material-icons">volume_up</i></span>
				<span class="titre">{{ $t('audio') }}</span>
			</div>
			<div @click="creerPanneau('synthese')" v-if="modules.includes('synthese')" :title="$t('syntheseVocale')">
				<span class="icone"><i class="material-icons">record_voice_over</i></span>
				<span class="titre">{{ $t('synthese') }}</span>
			</div>
			<div @click="creerPanneau('video')" v-if="modules.includes('video')" :title="$t('video')">
				<span class="icone"><i class="material-icons">movie_creation</i></span>
				<span class="titre">{{ $t('video') }}</span>
			</div>
			<div @click="creerPanneau('iframe')" v-if="modules.includes('iframe')" :title="$t('contenuIntegre')">
				<span class="icone"><i class="material-icons">code</i></span>
				<span class="titre">{{ $t('iframe') }}</span>
			</div>
			<div @click="creerPanneau('nuage')" v-if="modules.includes('nuage')" :title="$t('nuageMots')">
				<span class="icone"><i class="material-icons">cloud</i></span>
				<span class="titre">{{ $t('nuage') }}</span>
			</div>
			<div @click="creerPanneau('ordre')" v-if="modules.includes('ordre')" :title="$t('remiseOrdre')">
				<span class="icone"><i class="material-icons">sort_by_alpha</i></span>
				<span class="titre">{{ $t('ordre') }}</span>
			</div>
			<div @click="creerPanneau('trous')" v-if="modules.includes('trous')" :title="$t('texteATrous')">
				<span class="icone"><i class="material-icons">wysiwyg</i></span>
				<span class="titre">{{ $t('trous') }}</span>
			</div>
			<div @click="creerPanneau('tirage')" v-if="modules.includes('tirage')" :title="$t('tirageSort')">
				<span class="icone"><i class="material-icons">shuffle</i></span>
				<span class="titre">{{ $t('tirage') }}</span>
			</div>
			<div @click="creerPanneau('des')" v-if="modules.includes('des')" :title="$t('des')">
				<span class="icone"><i class="material-icons">casino</i></span>
				<span class="titre">{{ $t('des') }}</span>
			</div>
			<div @click="creerPanneau('groupes')" v-if="modules.includes('groupes')" :title="$t('groupes')">
				<span class="icone"><i class="material-icons">group</i></span>
				<span class="titre">{{ $t('groupes') }}</span>
			</div>
			<div @click="creerPanneau('chrono')" v-if="modules.includes('chrono')" :title="$t('chronometre')">
				<span class="icone"><i class="material-icons">timer</i></span>
				<span class="titre">{{ $t('chrono') }}</span>
			</div>
			<div @click="creerPanneau('rebours')" v-if="modules.includes('rebours')" :title="$t('compteRebours')">
				<span class="icone"><i class="material-icons">hourglass_empty</i></span>
				<span class="titre">{{ $t('rebours') }}</span>
			</div>
			<div @click="creerPanneau('horloge')" v-if="modules.includes('horloge')" :title="$t('horloge')">
				<span class="icone"><i class="material-icons">query_builder</i></span>
				<span class="titre">{{ $t('horloge') }}</span>
			</div>
			<div @click="creerPanneau('calendrier')" v-if="modules.includes('calendrier')" :title="$t('calendrier')">
				<span class="icone"><i class="material-icons">today</i></span>
				<span class="titre">{{ $t('calendrier') }}</span>
			</div>
			<div @click="creerPanneau('sonometre')" v-if="modules.includes('sonometre')" :title="$t('sonometre')">
				<span class="icone"><i class="material-icons">hearing</i></span>
				<span class="titre">{{ $t('volume') }}</span>
			</div>
			<div @click="$lancerConfettis()" v-if="modules.includes('bravo')" :title="$t('confettis')">
				<span class="icone"><i class="material-icons">thumb_up</i></span>
				<span class="titre">{{ $t('bravo') }}</span>
			</div>
			<div @click="ouvrirModale('grille')" v-if="modules.includes('grille') && Object.keys(grille).length === 0" :title="$t('grille')">
				<span class="icone"><i class="material-icons">view_module</i></span>
				<span class="titre">{{ $t('grille') }}</span>
			</div>
			<div @click="reinitialiserGrille" class="actif" v-else-if="modules.includes('grille') && Object.keys(grille).length > 0" :title="$t('grille')">
				<span class="icone"><i class="material-icons">view_module</i></span>
				<span class="titre">{{ $t('grille') }}</span>
			</div>
			<div class="separateur">
				<span>·</span>
			</div>
			<div @click="capturer" :title="$t('capture')">
				<span class="icone"><i class="material-icons">camera</i></span>
				<span class="titre">{{ $t('capture') }}</span>
			</div>
			<div @click="annoter" v-if="!annotation" :title="$t('annoter')">
				<span class="icone"><i class="material-icons">rate_review</i></span>
				<span class="titre">{{ $t('annoter') }}</span>
			</div>
			<div @click="arreterAnnoter" class="actif" v-else :title="$t('annoter')">
				<span class="icone"><i class="material-icons">rate_review</i></span>
				<span class="titre">{{ $t('annoter') }}</span>
			</div>
			<div @click="entrerPleinEcran" v-if="!pleinEcran" :title="$t('ecran')">
				<span class="icone"><i class="material-icons">open_in_full</i></span>
				<span class="titre">{{ $t('ecran') }}</span>
			</div>
			<div @click="sortirPleinEcran" v-else :title="$t('ecran')">
				<span class="icone"><i class="material-icons">close_fullscreen</i></span>
				<span class="titre">{{ $t('ecran') }}</span>
			</div>
			<div @click="ouvrirMenu" :title="$t('options')">
				<span class="icone"><i class="material-icons">settings</i></span>
				<span class="titre">{{ $t('options') }}</span>
			</div>
			<div @click="ouvrirModale('info')" :title="$t('aPropos')">
				<span class="icone"><i class="material-icons">info</i></span>
				<span class="titre">{{ $t('aPropos') }}</span>
			</div>
		</nav>
		<template v-for="panneau in panneauxPage">
			<PCodeqr :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-if="panneau.type === 'codeqr'" :key="panneau.id" />
			<PTexte :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'texte'" :key="panneau.id" />
			<PImage :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'image'" :key="panneau.id" />
			<PDessin :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'dessin'" :key="panneau.id" />
			<PDocument :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'document'" :key="panneau.id" />
			<PAudio :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'audio'" :key="panneau.id" />
			<PSynthese :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" :listeVoix="listeVoix" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'synthese'" :key="panneau.id" />
			<PVideo :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'video'" :key="panneau.id" />
			<PIframe :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'iframe'" :key="panneau.id" />
			<PNuage :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'nuage'" :key="panneau.id" />
			<POrdre :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'ordre'" :key="panneau.id" />
			<PTrous :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'trous'" :key="panneau.id" />
			<PTirage :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'tirage'" :key="panneau.id" />
			<PDes :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'des'" :key="panneau.id" />
			<PGroupes :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'groupes'" :key="panneau.id" />
			<PChrono :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'chrono'" :key="panneau.id" />
			<PRebours :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'rebours'" :key="panneau.id" />
			<PHorloge :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'horloge'" :key="panneau.id" />
			<PCalendrier :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'calendrier'" :key="panneau.id" />
			<PSonometre :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'sonometre'" :key="panneau.id" />
		</template>
		<MGrille v-if="modale === 'grille'" />
		<MInfo v-else-if="modale === 'info'" />
		<MParametres v-if="menu" />
		<div id="pages" :class="{'noir': Object.keys(pages[page - 1].grille).length > 0 && (pages[page - 1].grille.couleur === 'blanc' || pages[page - 1].grille.couleur === 'gris')}" v-if="pages.length > 1">
			<div>
				<span :class="{'selectionne': page === index}" @click="afficherPage(index)" v-for="index in pages.length" :key="'page_' + index" />
			</div>
		</div>
	</main>
</template>

<script>
import PCodeqr from '@/components/codeqr.vue'
import PTexte from '@/components/texte.vue'
import PImage from '@/components/image.vue'
import PDessin from '@/components/dessin.vue'
import PDocument from '@/components/document.vue'
import PAudio from '@/components/audio.vue'
import PSynthese from '@/components/synthese.vue'
import PVideo from '@/components/video.vue'
import PIframe from '@/components/iframe.vue'
import PNuage from '@/components/nuage.vue'
import POrdre from '@/components/ordre.vue'
import PTrous from '@/components/trous.vue'
import PTirage from '@/components/tirage.vue'
import PDes from '@/components/des.vue'
import PGroupes from '@/components/groupes.vue'
import PChrono from '@/components/chrono.vue'
import PRebours from '@/components/rebours.vue'
import PHorloge from '@/components/horloge.vue'
import PCalendrier from '@/components/calendrier.vue'
import PSonometre from '@/components/sonometre.vue'
import MGrille from '@/components/grille.vue'
import MInfo from '@/components/info.vue'
import MParametres from '@/components/parametres.vue'
import Annotation from '@/components/annotation.vue'
import html2canvas from 'html2canvas'
import fscreen from 'fscreen'
import { saveAs } from 'file-saver'

export default {
	name: 'App',
	components: {
		PCodeqr,
		PTexte,
		PImage,
		PDessin,
		PDocument,
		PAudio,
		PSynthese,
		PVideo,
		PIframe,
		PNuage,
		POrdre,
		PTrous,
		PTirage,
		PDes,
		PGroupes,
		PChrono,
		PRebours,
		PHorloge,
		PCalendrier,
		PSonometre,
		MGrille,
		MInfo,
		MParametres,
		Annotation
	},
	data () {
		return {
			chargement: true,
			alerte: false,
			largeur: 0,
			hauteur: 0,
			pages: [{ fond: './static/img/digitale.jpg', grille: {}, annotations: {} }],
			page: 1,
			modules: ['codeqr', 'texte', 'image', 'dessin', 'document', 'audio', 'video', 'iframe', 'nuage', 'ordre', 'trous', 'tirage', 'des', 'groupes', 'chrono', 'rebours', 'horloge', 'calendrier', 'bravo', 'grille'],
			panneaux: [],
			panneauxPage: [],
			langue: 'fr',
			pleinEcran: false,
			listeVoix: [],
			zIndex: 100,
			modale: '',
			menu: false,
			exportDonnees: false,
			importDonnees: false,
			importTermine: false,
			annotation: false,
			horloge: '',
			finRedimensionnement: false
		}
	},
	computed: {
		fond () {
			return this.pages[this.page - 1].fond
		},
		grille () {
			return this.pages[this.page - 1].grille
		},
		annotations () {
			return this.pages[this.page - 1].annotations
		}
	},
	watch: {
		page: function (page) {
			this.annotation = false
			this.exportDonnees = true
			this.$nextTick(function () {
				const panneaux = this.panneaux.filter(function (element) {
					return element.page === page
				})
				this.panneauxPage = panneaux
				this.exportDonnees = false
				if (Object.keys(this.annotations).length > 0) {
					this.annotation = true
				} else {
					this.annotation = false
				}
			}.bind(this))
		},
		panneaux: function () {
			const panneaux = this.panneaux.filter(function (element) {
				return element.page === this.page
			}.bind(this))
			this.panneauxPage = panneaux
		}
	},
	mounted () {
		this.verifierDimensions()
		document.querySelector('#chargement').addEventListener('animationend', function () {
			this.chargement = false
		}.bind(this))
		this.recupererVoix()
		if (window.speechSynthesis.onvoiceschanged !== undefined) {
			window.speechSynthesis.onvoiceschanged = this.recupererVoix
		}
		window.addEventListener('resize', this.verifierDimensions)
		fscreen.addEventListener('fullscreenchange', function () {
			if (fscreen.fullscreenElement === null) {
				this.pleinEcran = false
			} else {
				this.pleinEcran = true
			}
		}.bind(this))
	},
	methods: {
		definirFond () {
			if (this.fond.substring(0, 1) === '#') {
				return { 'background-color': this.fond }
			} else {
				return { 'background-image': 'url(' + this.fond + ')' }
			}
		},
		creerPanneau (type) {
			const id = 'panneau_' + (new Date()).getTime()
			const largeur = document.body.clientWidth / 2
			const hauteur = (document.body.clientHeight - this.$convertirRem(7.5)) / 2
			this.zIndex++
			const z = this.zIndex
			switch (type) {
			case 'codeqr':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 36, h: 46, x: largeur - this.$convertirRem(18), y: hauteur - this.$convertirRem(23), z: z })
				break
			case 'texte':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 53, h: 46, x: largeur - this.$convertirRem(26.5), y: hauteur - this.$convertirRem(23), z: z })
				break
			case 'image':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 27, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(13.5), z: z })
				break
			case 'dessin':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 48, h: 35, x: largeur - this.$convertirRem(24), y: hauteur - this.$convertirRem(17.5), z: z })
				break
			case 'document':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 16, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(8), z: z })
				break
			case 'audio':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 27, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(13.5), z: z })
				break
			case 'synthese':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 41, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(20.5), z: z })
				break
			case 'video':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 27, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(13.5), z: z })
				break
			case 'iframe':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 22, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(11), z: z })
				break
			case 'nuage':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 80, h: 59.5, x: largeur - this.$convertirRem(40), y: hauteur - this.$convertirRem(29.75), z: z })
				break
			case 'ordre':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 50.4, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(25.2), z: z })
				break
			case 'trous':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 48, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(24), z: z })
				break
			case 'tirage':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 40, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(20), z: z })
				break
			case 'des':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 22, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(11), z: z })
				break
			case 'groupes':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 42, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(21), z: z })
				break
			case 'chrono':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 48, h: 22.2, x: largeur - this.$convertirRem(24), y: hauteur - this.$convertirRem(11.1), z: z })
				break
			case 'rebours':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 22.2, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(11.1), z: z })
				break
			case 'horloge':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 38, h: 42, x: largeur - this.$convertirRem(19), y: hauteur - this.$convertirRem(21), z: z })
				break
			case 'calendrier':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 34, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(17), z: z })
				break
			case 'sonometre':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 24, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(12), z: z })
				break
			}
		},
		modifierPanneau (donnees) {
			this.panneaux.forEach(function (panneau, index) {
				if (panneau.id === donnees.id) {
					this.panneaux[index].titre = donnees.titre
					this.panneaux[index].mode = donnees.mode
					this.panneaux[index].statut = donnees.statut
					this.panneaux[index].dimensions = donnees.dimensions
					this.panneaux[index].contenu = donnees.contenu
					this.panneaux[index].w = donnees.w
					this.panneaux[index].h = donnees.h
					this.panneaux[index].x = donnees.x
					this.panneaux[index].y = donnees.y
					this.panneaux[index].z = donnees.z
				}
			}.bind(this))
		},
		fermerPanneau (id) {
			this.panneaux.forEach(function (panneau, index) {
				if (panneau.id === id) {
					this.panneaux.splice(index, 1)
				}
			}.bind(this))
		},
		ouvrirModale (modale) {
			this.modale = modale
		},
		fermerModale () {
			this.modale = ''
		},
		ouvrirMenu () {
			this.menu = true
		},
		fermerMenu () {
			this.menu = false
		},
		reinitialiserGrille () {
			this.pages[this.page - 1].grille = {}
		},
		capturer () {
			html2canvas(document.body, { useCORS: true }).then(function (canvas) {
				saveAs(canvas.toDataURL('image/jpeg', 0.95).replace('image/jpeg', 'image/octet-stream'), 'capture_' + (new Date()).getTime() + '.jpg')
			})
		},
		annoter () {
			this.annotation = true
		},
		arreterAnnoter () {
			this.annotation = false
			this.pages[this.page - 1].annotations = {}
		},
		entrerPleinEcran () {
			fscreen.requestFullscreen(document.body)
		},
		sortirPleinEcran () {
			fscreen.exitFullscreen()
		},
		afficherPage (page) {
			this.page = page
		},
		importer (event) {
			const fichier = event.target.files[0]
			if (fichier == null || fichier.length == 0) {
				document.querySelector('#televerser').value = ''
				return false
			} else {
				this.importDonnees = true
				const reader = new FileReader()
				reader.onload = function (e) {
					const donnees = JSON.parse(e.target.result)
					this.pages = donnees.pages
					this.page = donnees.page
					this.modules = donnees.modules
					this.panneaux = donnees.panneaux
					this.langue = donnees.langue
					this.$root.$i18n.locale = donnees.langue
					this.zIndex = donnees.zIndex
					this.importTermine = true
					if (Object.keys(this.pages[0].annotations).length > 0) {
						this.annotation = true
					} else {
						this.annotation = false
					}
				}.bind(this)
				reader.readAsText(fichier)
				document.querySelector('#televerser').value = ''
				this.$nextTick(function () {
					document.querySelector('#import').addEventListener('animationend', function () {
						this.importDonnees = false
						this.importTermine = false
					}.bind(this))
				}.bind(this))
			}
		},
		exporter (fichier) {
			this.exportDonnees = true
			this.$nextTick(function () {
				let donnees = {}
				donnees.pages = this.pages
				donnees.page = this.page
				donnees.modules = this.modules
				donnees.panneaux = this.panneaux
				donnees.langue = this.langue
				donnees.zIndex = this.zIndex
				donnees = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(donnees))
				saveAs(donnees, fichier + '.dgs')
				this.exportDonnees = false
				this.fermerModale()
			}.bind(this))
		},
		modifierModule (event) {
			const module = event.target.value
			if (event.target.checked === true) {
				this.modules.push(module)
			} else {
				const index = this.modules.indexOf(module)
				this.modules.splice(index, 1)
			}
		},
		recupererVoix () {
			this.listeVoix = window.speechSynthesis.getVoices().sort(function (a, b) {
				const nomA = a.name.toUpperCase()
				const nomB = b.name.toUpperCase()
				if (nomA < nomB) return -1
				else if (nomA == nomB) return 0
				else return +1
			})
		},
		verifierDimensions () {
			this.finRedimensionnement = false
			const largeur = window.innerWidth
			this.$nextTick(function () {
				this.largeur = document.body.clientWidth
				this.hauteur = document.body.clientHeight - this.$convertirRem(7.5)
			}.bind(this))
			if (largeur < 1024) {
				this.alerte = true
			} else if (this.alerte) {
				this.alerte = false
				this.chargement = true
				this.$nextTick(function () {
					document.querySelector('#chargement').addEventListener('animationend', function () {
						this.chargement = false
					}.bind(this))
				}.bind(this))
			}
			clearTimeout(this.horloge)
			this.horloge = setTimeout(function () {
				this.finRedimensionnement = true
			}.bind(this), 250)
		}
	}
}
</script>

<style src="destyle.css/destyle.css"></style>
<style src="@/assets/css/style.css"></style>

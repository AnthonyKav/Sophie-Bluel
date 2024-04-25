// Définit l'adresse où fetch les données
const baseUrl = 'http://localhost:5678/api';
const gallery = document.querySelector(".gallery");
const filters = document.querySelector('.filters');
const modal = document.querySelector(".modal "); 
const modal1 = document.querySelector(".modal1"); 
const modal2 = document.querySelector(".modal2"); 
const modalContent = document.querySelector(".modal_content");
const galleryModal = document.querySelector(".galleryModal");
const openBtn = document.getElementById("modal_open");
const closeBtn = document.getElementsByClassName("closeBtn")[0];
const logOutBtn = document.getElementById("logOut");
const previewContainer = document.getElementById('previewImageContainer');
const addProjectInput = document.querySelector('#addProjectInput');
const nameError = document.getElementById('nameError'); 
const categoriesError = document.getElementById('categoriesError'); 
const uploadImgContainer = document.getElementById('UploadImageContainer');
const addProjectLogo = document.querySelector('addProjectLogo');
const addProjectLabel = document.querySelector('addProjectLabel');
const sectionGallery = document.querySelector('.gallery');
const validateBtn = document.getElementById('validateBtn');
const formUpload = document.querySelector('.form_upload'); 
const projectName = document.getElementById("projectName")
const projectCategory = document.getElementById("projectCategories")
const token = window.localStorage.token 


// Récupération des projets et des catégories dans l'API
async function fetchData() {
  try {
    // Effectue deux requêtes fetch en parallèle, une pour les œuvres et une pour les catégories
    const [worksResponse, categoriesResponse] = await Promise.all([
      fetch(`${baseUrl}/works`),
      fetch(`${baseUrl}/categories`)
    ]);

    // Vérifie si les réponses sont OK 
    if (!worksResponse.ok || !categoriesResponse.ok) {
      throw new Error('Network response was not ok');
    }

    // Convertit les réponses en objets JSON
    const works = await worksResponse.json();
    const categories = await categoriesResponse.json();

    // Renvoie un objet contenant les œuvres et les catégories
    return { works, categories };
  } catch (error) {
    // Gère les erreurs de requête
    console.error('Error fetching data:', error);
    // Renvoie des tableaux vides en cas d'erreur
    return { works: [], categories: [] };
  }
}

async function displayButtonsCategorys(categories) {
  // Parcourt chaque catégorie
  categories.forEach(category => {
    // Crée un bouton pour la catégorie
    const btn = document.createElement("button");
    // Définit le texte du bouton (première lettre en majuscule, le reste en minuscule)
    btn.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase();
    // Définit l'ID du bouton avec l'ID de la catégorie
    btn.id = category.id;
    // Ajoute le bouton à la div "filters"
    filters.appendChild(btn);
  });
}

// Filtrage au clic sur le bouton par catégories
async function filterCategory(works) {
  // Sélectionne tous les boutons dans la div "filters"
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach(button => {
    // Ajoute un gestionnaire d'événement "click" à chaque bouton
    button.addEventListener("click", (e) => {
      // Récupère l'ID du bouton cliqué
      const btnId = e.target.id;
      if (btnId !== "0") {
        // Si un bouton de catégorie est cliqué (ID différent de 0)
        // Filtre les œuvres correspondant à la catégorie
        const filteredWorks = works.filter(work => work.categoryId == btnId);
        // Affiche les œuvres filtrées
        affichageWorks(filteredWorks);
      } else {
        // Si le bouton "Tous" est cliqué (ID 0)
        // Affiche toutes les œuvres
        affichageWorks(works);
      }
      console.log("le bouton filtre " + btnId + " a été cliqué");
    });
  });
}

// Affichage des projets (works) dans le DOM
async function affichageWorks(worksArray) {
  // Vide la galerie avant d'ajouter les œuvres
  gallery.innerHTML = "";
  // Parcourt chaque œuvre
  worksArray.forEach((work) => {
    // Crée un élément figure pour l'œuvre
    const figure = document.createElement("figure");
    // Crée un élément img pour l'image de l'œuvre
    const img = document.createElement("img");
    // Crée un élément figcaption pour le titre de l'œuvre
    const figCaption = document.createElement("figcaption");
    // Définit la source de l'image
    img.src = work.imageUrl;
    // Définit le titre de l'œuvre
    figCaption.textContent = work.title;
    // Ajoute l'image et le titre à la figure
    figure.appendChild(img);
    figure.appendChild(figCaption);
    // Ajoute la figure à la galerie
    gallery.appendChild(figure);
  });
}

// Appeler les fonctions pour lancer les works
async function init() {
  // Récupère les œuvres et les catégories
  const { works, categories } = await fetchData();
  // Affiche toutes les œuvres par défaut
  await affichageWorks(works);
  // Affiche les boutons de catégories
  await displayButtonsCategorys(categories);
  // Ajoute le filtrage par catégorie
  await filterCategory(works);
  await displayProjectsModal()
}

// Initialise l'application
init();


/////////////////////////////////////////// ADMIN ////////////////////////////////////////////////


//////Fonction pour se deconnecter 



function logOut() {
    // verifie si  un token d'authentification est présent dans le local storage . si il est présent 
    // le bouton Login se transoforme en Logout ( InnerHtml)
    const logOutBtn = document.getElementById("logOut");
  
    if (window.localStorage.getItem("token")) {
      logOutBtn.innerHTML = "logout";
     // Lorsque l'element est cliqué , le jeton est supprimé et l'utilsateur de ce fait déconnecté . 
      logOutBtn.addEventListener("click", () => {
        logOutBtn.href = window.location.href;
        window.localStorage.removeItem("token");
      });
    }}
  
  logOut();
  
  
  //// Fonction pour afficher la vue admin si l'utilisateur est connecté
  function displayAdminView() {
  const adminView = document.querySelectorAll(".adminView");
  const sectionFilters = document.querySelector(".filters"); // Sélection de l'élément .filters
  //si l utilisateur est connecté
  if (window.localStorage.getItem("token")) {
    //enleve les filtres
  sectionFilters.style.display = "none";
  } else {
    // Si l'utilisateur n'est pas connecté
    adminView.forEach((adminView) => {
      adminView.style.display = "none";
    });
    }}
  
  displayAdminView();

  // ******************************************************************************
// ***************************** FONCTION MODALE ******************************
// ******************************************************************************

function main(){
  getGalleryProjects();
  displayProjectsModal();
  deleteProject();
  deleteFigureFromAPI();
  switchModal();
  switchModal2();
  getCategories();
  uploadProject();
  checkInputs();
}


/////////////////////// OUVRIR ET FERMER LA MODALE /////////////////////////////

// Se déclanche lorsque l'élement OpenBtn est cliqué 
openBtn.onclick = function() { 
// Cette ligne définit que l'élément avec l'ID "modal" aura un style d'affichage de "block", ce qui le rendra visible.
  modal.style.display = "block"; 
  // Cette ligne définit que l'élément avec l'ID "modal1" aura un style d'affichage de "flex", ce qui le rendra visible.
  modal1.style.display = "flex";//au clic il n'y a toujours que la modal1 qui s'ouvre
  // Cette ligne définit que l'élément avec l'ID "modal2" aura un style d'affichage de "none", ce qui le rendra invisible.
  modal2.style.display = "none";  
}

// au clic sur la croix, la modale se ferme
closeBtn.onclick = function() {
modal.style.display = "none";

}

// au clic en dehors de la modale, la modale se ferme
window.onclick = function(event) { 
  if (event.target == modal) {
   modal.style.display = "none";
 
  }
}



////////////// RECUPERER LES PROJETS DEPUIS L'API ////////////////

async function getGalleryProjects() {
  const response = await fetch ("http://localhost:5678/api/works");
return await response.json();
}



//////////////// AFFICHER LES PROJETS DANS LA MODALE ///////////////////////////


async function displayProjectsModal(){
  //Attend la récupération des projets de la galerie depuis la fonction async appelée "getGalleryProjects()".
  const modalProjects = await getGalleryProjects();
  // Cette boucle parcourt chaque projet récupéré dans "modalProjects"
  for (let i = 0; i < modalProjects.length; i++) {
  
    // Création de Figure
    const figure = modalProjects[i];
    const projectFigure = document.createElement("figure");
    //  ajoute un attribut "data-id" à la figure, avec une valeur unique pour chaque projet.
    projectFigure.dataset.id = "Figure"+ i;
    // Ajoute la classe CSS ProjectFigureModal à la nouvelle Figure 
    projectFigure.classList.add("projectFigureModal");
  
    //Création de l'icône de suppression
        // crée un nouvel élément HTML "div" pour contenir l'icône de suppression.
    const containerDelete = document.createElement('div');
    //  ajoute une classe CSS "containerDelete" au conteneur de l'icône.
    containerDelete.classList.add("containerDelete");
     // crée un nouvel élément HTML "img" pour représenter l'icône de suppression
    const deleteIcon = document.createElement('img');
    // définit la source de l'image de l'icône de suppression.
    deleteIcon.src="./assets/icons/trash-can-solid.svg";
    //ajoute une classe CSS "deleteIcon" à l'icône de suppression.
    deleteIcon.classList.add("deleteIcon");
     //attribue un ID unique à chaque icône de suppression, en utilisant l'indice de la boucle.
    deleteIcon.id = `deleteIcon-${i}`;
    deleteIcon.alt = "icone suppression";

    // Supprimer un projet de la galerie depuis la modale en cliquant sur l'icône de suppression
    deleteIcon.addEventListener('click', async (event) => {
    // Supprime la figure de l'API
    await deleteFigureFromAPI(figure.id);
    // Supprime la figure du DOM
    projectFigure.remove();

});
  
    // Image
    const imageFigure = document.createElement("img");
    imageFigure.src = figure.imageUrl;
    imageFigure.classList.add("imgFigureModal");
  
    //parents/enfants
    projectFigure.appendChild(containerDelete);
    galleryModal.appendChild(projectFigure);
    projectFigure.appendChild(imageFigure);
    containerDelete.appendChild(deleteIcon);
  }
}



////////////////// SUPPRIMER UN PROJET DEPUIS L'API //////////////////////
// prend en pâramètre l'id de la figure à suprimer 
const deleteFigureFromAPI = async (id) => {
  //récupère l'élément HTML avec l'ID "deleteSuccess", qui sera utilisé pour afficher un message de succès.
const deleteSuccess = document.getElementById('deleteSuccess');
 // récupère le token stocké dans le localStorage du navigateur.
  const token = window.localStorage.getItem("token")//.replace(/['"]+/g, '');
  //effectue une requête HTTP DELETE asynchrone vers l'API, en utilisant l'ID de la figure à supprimer.
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
     // Le header de la requête inclue le type de contenu (application/json) et le token
    // Le body de la requête est vide, car il s'agit d'une suppression.
      method: "DELETE",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      
      body: ''
    });

  if (!response.ok) {
    throw new Error('Request failed');
  }
  else { 
    console.log('Photo supprimée avec succès');
    deleteSuccess.innerHTML = "Photo supprimée avec succès";
    sectionGallery.innerHTML = "";
    const { works, categories } = await fetchData();
         // Affiche toutes les œuvres par défaut
         await affichageWorks(works);
    
  }
}

/////////////////////// AJOUTER UN PROJET ///////////////////////////////////////

//Si je clique sur le bouton "ajouter un projet", la modal2 s'affiche et la modal1 disparait
const addProjectBtn = document.getElementById('addProjectBtn') //
    addProjectBtn.addEventListener ("click", switchModal)
function switchModal() {

    if (modal1.style.display === 'flex') {
        modal1.style.display = 'none'
        modal2.style.display = 'flex'
        
    } else {
        modal1.style.display = 'flex'
        modal2.style.display = 'none'
    }
}


// récupère l'element HTML avec l'ID Arrowback 
const arrowBack = document.getElementById('arrowBack')                       
// Lorsque l'utilisateur clique sur cet élément, la fonction "switchModal2()" sera appelée.
arrowBack.addEventListener ("click", switchModal2)
function switchModal2() {
    const modal1 = document.querySelector('.modal1')
    const modal2 = document.querySelector('.modal2')
  // Cette condition vérifie si la modale 2 est actuellement affichée 
    if (modal2.style.display === 'flex') {
      // Si c'est le cas, cette ligne cache la modale 2 en définissant son style d'affichage à 'none'
        modal2.style.display = 'none'
         // affiche la modale 1 en définissant son style d'affichage à 'flex'.
        modal1.style.display = 'flex'
        //efface le contenu de l'élément HTML avec l'ID "nameError".
           nameError.innerHTML = "";
           categoriesError.innerHTML = "";
           deleteSuccess.innerHTML = "";
        formUpload.reset();
    } else {
      // affiche la modale 2 en définissant son style d'affichage à 'flex'
        modal2.style.display = 'flex'
      // cache la modale 1 en définissant son style d'affichage à 'none'
        modal1.style.display = 'none'
}
}

//recuperer les categories depuis l'API pour le menu deroulant
 
async function getCategories(){
  const projectsCategories = await fetch ("http://localhost:5678/api/categories");
  return await projectsCategories.json();
}
const select = document.getElementById('projectCategories');
const categories = getCategories();
categories.then((data) => {

  // Créer une option vide pour le menu déroulant
  const emptyOption = document.createElement('option');
  emptyOption.value = "";
  emptyOption.innerText = "";
  select.appendChild(emptyOption);

  // Ajouter les autres catégories
  data.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.innerText = category.name;
    select.appendChild(option);
  });
});


//////////upload et preview de l'image 
 
/////// Preview image

 // ajoute un eventListener "change" à l'élément HTML avec l'ID "addProjectInput".
  addProjectInput.addEventListener('change', function (event) {
    // récupère le premier fichier sélectionné par l'utilisateur dans l'élément "addProjectInput".
    const selectedFile = event.target.files[0];
    // Cette condition vérifie si un fichier a bien été sélectionné.
    if (selectedFile) {
       // crée un nouvel objet "FileReader" qui permet de lire le contenu du fichier sélectionné.
      const reader = new FileReader();
      // ajoute un écouteur d'événement "load" à l'objet "reader".Lorsque le fichier a fini d'être lu, la fonction suivante est exécutée.
      reader.addEventListener('load', function () {
        //crée un nouvel element img pour afficher le preview 
        const imgPreview = document.createElement('img');
        // définit la source de l'image à l'URL du fichier lu.
        imgPreview.src = this.result;
        //vide le contenu de l'élément HTML avec la classe "previewContainer".
        previewContainer.innerHTML = '';
        //ajoute l'élément "imgPreview" en tant qu'enfant de l'élément "previewContainer"
        previewContainer.appendChild(imgPreview);
        //ajoute la classe CSS "previewImage" à l'élément "imgPreview".
        imgPreview.classList.add("previewImage");
      });
      // lit le contenu du fichier sélectionné et le convertit en une URL de données.
      reader.readAsDataURL(selectedFile);
      
    }
  });
   // Cette fonction est définie pour afficher le contenu par défaut du conteneur d'aperçu.
  function displayPreviewContainer() {
    previewContainer.innerHTML =  `     <span><img src="assets/icons/addProject_Img.svg"  class="addProjectLogo" alt="modalLogo"></span>
    <label for="addProjectInput" class="addProjectLabel">+ Ajouter une photo</label>
    <input type="file" name="addProjectInput" id="addProjectInput" class="hidden">
    <span>jpg, png : 4mo max</span>`;
  }

  

///////// UPLOAD PROJECT

  async function uploadProject(event){
    //empêche le comportement par défaut du formulaire (rechargement de la page)
   event.preventDefault();
    // ces lignes récupèrent les valeurs des différents champs
    const projectName = document.getElementById("projectName").value;
    const projectCategory = document.getElementById("projectCategories").value;
    const selectedFile = addProjectInput.files[0];

  // Verifie si tous les champs sont remplis
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", projectName);
      formData.append("category", projectCategory);
    
      if (!projectName) { // Vérifie si un nom de projet est renseigné
        nameError.innerHTML = "Veuillez ajouter un titre";
        return;
      }

      if (!selectedFile) { // Vérifie si un fichier est sélectionné
        nameError.innerHTML = "Veuillez ajouter un fichier";
        return;
      }
     if (!projectCategory) { // Vérifie si une catégorie est sélectionnée
        categoriesError.innerHTML = "Veuillez ajouter une catégorie";
       return;
      }

  //fetch POST request
      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
      
         console.log("it works! Bravo !");
         nameError.innerHTML = "Image ajoutée avec succès";

         // apres Upload d une image le formulaire est vide
         categoriesError.innerHTML = "";
         // reset image ici 
         formUpload.reset();
         sectionGallery.innerHTML = "";
         const { works, categories } = await fetchData();
         // Affiche toutes les œuvres par défaut
         await affichageWorks(works);
         

         // apres Upload d une image le previewContainer est vidé et remplacé par le logo
        displayPreviewContainer();

     // apres Upload d une image l'Image est dans la galerie de la modal1
          galleryModal.innerHTML = "";
          displayProjectsModal();
        }
       
      } catch (error) {
        console.log("Nope", error);
      } 
    }}

  //upload form
 
 if (formUpload) {
  formUpload.addEventListener("submit", uploadProject);
 sectionGallery.innerHTML = "";


// displayProjects();
} else {
  console.error("Nope");
}
;

///tant que le formulaire n'est pas rempli, le bouton de validation est desactive///


// Fonction pour vérifier si tous les champs sont remplis

function enabledOrDisabledSubmit() {
  const selectedFile = addProjectInput.files[0];

  if (!selectedFile || projectName.value.trim() === "" || projectCategory.value === "") {
    validateBtn.disabled = true;
    validateBtn.style.cursor = "not-allowed";
    validateBtn.style.backgroundColor = "#d3d3d3";
  } else {
    validateBtn.disabled = false;
    validateBtn.style.cursor = "pointer";
    validateBtn.style.backgroundColor = "#1d6154";
  }
}

// Ajouter des écouteurs d'événements pour les champs d'entrée et de sélection
addProjectInput.addEventListener("change", enabledOrDisabledSubmit);
projectName.addEventListener("input", enabledOrDisabledSubmit);
projectCategory.addEventListener("input", enabledOrDisabledSubmit);

// Appeler enabledOrDisabledSubmit une première fois pour initialiser l'état du bouton
enabledOrDisabledSubmit();
// Définit l'adresse où fetch les données
const baseUrl = 'http://localhost:5678/api';

// Sélection de la div gallery
const gallery = document.querySelector(".gallery");
// Sélection de la div "filters" pour les boutons filtre
const filters = document.querySelector('.filters');

// Récupération des projets et des catégories dans l'API
async function fetchData() {
  try {
    // Effectue deux requêtes fetch en parallèle, une pour les œuvres et une pour les catégories
    const [worksResponse, categoriesResponse] = await Promise.all([
      fetch(`${baseUrl}/works`),
      fetch(`${baseUrl}/categories`)
    ]);

    // Vérifie si les réponses sont OK (code de statut 200-299)
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
}

// Initialise l'application
init();


/////////////////////////////////////////// ADMIN ////////////////////////////////////////////////


//////Fonction pour se deconnecter 

// Cette variable récupère la valeur du jeton d'authentification stocké dans le localStorage 
const token = window.localStorage.token 

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


//Variables globales

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

openBtn.onclick = function() { 
modal.style.display = "block"; 
modal1.style.display = "flex";//au clic il n'y a toujours que la modal1 qui s'ouvre
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
getGalleryProjects();


//////////////// AFFICHER LES PROJETS DANS LA MODALE ///////////////////////////

async function displayProjectsModal(){

  const modalProjects = await getGalleryProjects();
  
  for (let i = 0; i < modalProjects.length; i++) {
  
    // Création de Figure
    const figure = modalProjects[i];
    const projectFigure = document.createElement("figure");
    projectFigure.dataset.id = "Figure"+ i;
    projectFigure.classList.add("projectFigureModal");
  
    //Création de l'icône de suppression
    const containerDelete = document.createElement('div');
    containerDelete.classList.add("containerDelete");
    const deleteIcon = document.createElement('img');
    deleteIcon.src="./assets/icons/trash-can-solid.svg";
    deleteIcon.classList.add("deleteIcon");

    //Ajout d'un id unique à chaque icone de suppression
    deleteIcon.id = `deleteIcon-${i}`;
    deleteIcon.alt = "icone suppression";

/**
   //Remarque: si j'upload plusieurs fois la meme image, en cliquant sur l'icone de suppression d'une de ces images
   //c'est la derniere image qui est supprimee
**/
    
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

displayProjectsModal();

////////////////// SUPPRIMER UN PROJET DEPUIS L'API //////////////////////

deleteFigureFromAPI = async (id) => {
const deleteSuccess = document.getElementById('deleteSuccess');
  const token = window.localStorage.getItem("token")//.replace(/['"]+/g, '');
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
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
    await displayProjects();

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

switchModal();

//fleche retour pour revenir à la modal1

const arrowBack = document.getElementById('arrowBack')                       

arrowBack.addEventListener ("click", switchModal2)
function switchModal2() {
    const modal1 = document.querySelector('.modal1')
    const modal2 = document.querySelector('.modal2')
  
    if (modal2.style.display === 'flex') {
        modal2.style.display = 'none'
        modal1.style.display = 'flex'
           nameError.innerHTML = "";
           categoriesError.innerHTML = "";
           deleteSuccess.innerHTML = "";
        formUpload.reset();
    } else {
        modal2.style.display = 'flex'
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

document.addEventListener("DOMContentLoaded", function () {
 
/////// Preview image

  addProjectInput.addEventListener('change', function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        const imgPreview = document.createElement('img');
        imgPreview.src = this.result;
        previewContainer.innerHTML = '';
        previewContainer.appendChild(imgPreview);
        imgPreview.classList.add("previewImage");
      });
      reader.readAsDataURL(selectedFile);
      
    }
  });
  
  function displayPreviewContainer() {
    previewContainer.innerHTML =  `     <span><img src="assets/icons/addProject_Img.svg"  class="addProjectLogo" alt="modalLogo"></span>
    <label for="addProjectInput" class="addProjectLabel">+ Ajouter une photo</label>
    <input type="file" name="addProjectInput" id="addProjectInput" class="hidden">
    <span>jpg, png : 4mo max</span>`;
  }

  

///////// UPLOAD PROJECT

  async function uploadProject(event){
   event.preventDefault();

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
      
         console.log("it works! youhouuuu");
         nameError.innerHTML = "Image ajoutée avec succès";

         // apres Upload d une image le formulaire est vide
         categoriesError.innerHTML = "";
         formUpload.reset();
         sectionGallery.innerHTML = "";
         await displayProjects();

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
 const formUpload = document.querySelector(".form_upload");
 if (formUpload) {
  formUpload.addEventListener("submit", uploadProject);///// Le displayProjects doit se faire sur l'ID du projet
 sectionGallery.innerHTML = "";


// displayProjects();
} else {
  console.error("Nope");
}}
);

///tant que le formulaire n'est pas rempli, le bouton de validation est desactive///

const validateBtn = document.getElementById('validateBtn');
const formUpload = document.querySelector('.form_upload'); 
const projectName = document.getElementById("projectName")
const projectCategory = document.getElementById("projectCategories")

// Fonction pour vérifier si tous les champs sont remplis
function checkInputs() {

  // Si tous les champs sont ok validateBtn est activé
  if (projectName.value && projectCategory.value) {           
    validateBtn.classList.remove('button__off');
    validateBtn.classList.add('validateBtn');  

  } else {
    // Sinon,valideBtn est désactivé
    validateBtn.classList.remove('validateBtn');
    validateBtn.classList.add('button__off');
  }
}
projectName.addEventListener('input', checkInputs);
projectCategory.addEventListener('input', checkInputs);
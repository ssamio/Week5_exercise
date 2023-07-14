//Document elements defined to constants
const recipeName = document.getElementById("recipe-name");
const instructions = document.getElementById("instructions-list");
const ingredients = document.getElementById("ingredients-list");
const inputName = document.getElementById("name-text");
const inputIngredient = document.getElementById("ingredients-text");
const addIngredient = document.getElementById("add-ingredient");
const inputInstruction = document.getElementById("instructions-text");
const addInstruction = document.getElementById("add-instruction");
const imageInput = document.getElementById("image-input");
const submitRecipe = document.getElementById("submit");
const searchBar = document.getElementById("search-bar");
const specialCategories = document.getElementById("special-list");

let recipeInstruction = [];
let recipeIngredients = [];
let foodCategories = [];

//Fetch categories on load
window.addEventListener("load", function() {
    fetch("http://localhost:3000/category", {
        method: "get"
        })
        .then(response => response.text())
        .then(text => {
            foodCategories = JSON.parse(text);
            for(let i = 0; i < foodCategories.length; i++){
                createCheckbox(foodCategories[i].name, foodCategories[i]._id);
            }
        });
});


//Custom simplified event listener because forms suck
window.onkeyup = keyup;
//Function for searching recipes and inserting content to page
function keyup(e){
    if(e.key == "Enter" && searchBar.value != ""){
        fetch("http://localhost:3000/recipe/" + searchBar.value, {
        method: "get"
        })
        .then(response => response.text())
        .then(text => {
            if(text == "Recipe not found"){
                searchBar.value = "";
                alert(text);
            }
            else{
            const targetObject = JSON.parse(text);
            recipeName.innerText = targetObject.name;
            //console.log(targetObject.images);
            //Get them images
            getThemImages(targetObject.images);
            let categorieName = [];
            for (let i = 0; i < targetObject.categories.length; i++){
                for(let j = 0; j < foodCategories.length; j++){
                    if(targetObject.categories[i] == foodCategories[j]._id){
                        categorieName.push(foodCategories[j].name);
                    }
                }                    
            }
            populateList(specialCategories, categorieName);
            populateList(instructions, targetObject.instructions);
            populateList(ingredients, targetObject.ingredients);
            searchBar.value = "";
            }
            
        });
    }
}

//Add ingredient
addIngredient.addEventListener("click", function() {
    recipeIngredients.push(inputIngredient.value);
    inputIngredient.value = "";
});

//Add instruction
addInstruction.addEventListener("click", function() {
    recipeInstruction.push(inputInstruction.value);
    inputInstruction.value = "";
});


//Recipe submit
submitRecipe.addEventListener("click", function() {
    let recipeCategories = [];
    for(let i = 0; i < foodCategories.length; i++){
        const target = document.getElementById(foodCategories[i]._id);
        if(target.checked){
            recipeCategories.push(target.id);
            target.checked = false;
        }
    }

    fetch("http://localhost:3000/recipe/", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: '{ "name":"' + inputName.value + '", "instructions":"' + recipeInstruction + '", "ingredients":"' + recipeIngredients + '", "categories":"' + recipeCategories +'"}'
    })
    .then(response => {
        response.text()
        recipeInstruction = [];
        recipeIngredients = [];
        inputName.value = "";
    })
    .catch(err => console.log(err))

    if(imageInput.value != ''){

        for(let i = 0; i < imageInput.files.length; i++){
            const formData = new FormData();
            formData.append('images', imageInput.files[i]);
            formData.append('recipe', inputName.value);
        fetch("http://localhost:3000/images", {
            method: "post",
            body: formData    
        })
        .then(response => response.text())
        .then(text => {
            console.log(text);
            imageInput.value = "";
        })
        .catch(error => console.log(error));
        }    
    }
});

//Function to populate lists, target is the list that is being populated with content "data"
function populateList(target, data){
    let content = "";
    for (let i = 0; i < data.length; i++){
        content = content + "<li>" + data[i] + "</li>";
    }
    target.innerHTML = content;
}
//Makes 'em checkboxes tick
function createCheckbox(name, id){
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = name;
    checkbox.id = id;

    const br = document.createElement("br");

    let label = document.createElement("label");
    label.appendChild(checkbox);

    let span = document.createElement("span");
    span.innerText = name;

    label.appendChild(span);

    document.getElementById("category-container").appendChild(label);
    document.getElementById("category-container").appendChild(br);
}
//Put them images to page 
function getThemImages(target){
    for(let i = 0; i < target.length; i++){
      let image = document.createElement("img");
      image.src = "http://localhost:3000/images/" + target[i];
      image.width = 500;
      image.height = 600;
      const br = document.createElement("br"); 

      document.getElementById("images").appendChild(image);
      document.getElementById("images").appendChild(br);
    }
}

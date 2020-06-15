const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingContainer = document.getElementsByClassName("ing-container")[0]
const ingList = document.getElementsByClassName("ing-list")[0]
const recipeUl = document.getElementById("recipe-list")
const dropdown = document.getElementById("recipes")
let recipeGuess = []
let recipeCompare = []

document.addEventListener("DOMContentLoaded", function(){

    function fetchIngredients(){
        fetch(`${baseUrl}/ingredients`)
        .then(resp => resp.json())
        .then(ingredients => renderAllIngredients(ingredients))
    }
    
    function renderAllIngredients(ingredients){
        ingredients.forEach(ingredient => {
            renderIngredient(ingredient)
        });
    }
    
    function renderIngredient(ingredient){
        let ingredientDiv = document.createElement('div')
        ingredientDiv.className = "ing-div"
        ingredientDiv.innerHTML = `
        <img src="assets/images/${ingredient.image}" class="ing-img" data-id = ${ingredient.id} draggable="true">
        <br>${ingredient.name}`
        pantryContainer.append(ingredientDiv)
    }
  
    function fetchRecipes(){
        fetch(`${baseUrl}/recipes`)
        .then(resp => resp.json())
        .then(recipes => addToDropdown(recipes))
    }

    function addToDropdown(recipes){
        recipes.forEach(recipe => {
            const recipeChoice = document.createElement('option')
            recipeChoice.value = recipe.id
            recipeChoice.innerHTML = recipe.name
            dropdown.append(recipeChoice)
        })
    }

    function renderRecipeDirections(ingredients){
        recipeUl.innerHTML = ''
        ingredients.forEach(ingredient => {
            const ingLi = document.createElement('li')
            ingLi.innerText = ingredient.name
            recipeUl.append(ingLi)
        })
    }

    fetchIngredients()
    fetchRecipes()
  
    function renderDifficulty(number){
        let difficulty;
        switch (number) {
            case 1:
                difficulty = "Easy"
                break;
            case 2:
                difficulty = "Medium"
                break;
            case 3:
                difficulty = "Hard"
                break; 
            default:
                difficulty = "Easy"
                break;
        }
        recipeUl.innerText = `Difficulty: ${difficulty}`
    }

    dropdown.addEventListener('change', function(e){
        const recipeId = parseInt(e.target.value)
        if (!isNaN(recipeId)){
            fetch(`${baseUrl}/recipes/${recipeId}`)
            .then(resp => resp.json())
            .then(recipe => {
            // renderRecipeDirections(recipe.ingredients)
            fetchRecipeList(recipeId)
            renderDifficulty(recipe.difficulty_level)
        })
        }
    })

    document.addEventListener("dragstart", function(e){
        if (e.target.className === "ing-img"){
            e.dataTransfer.setData("ingredient", e.target.src)
            e.dataTransfer.setData("id", e.target.dataset.id)
        }
    })

    document.addEventListener("dragover", function(e){
        if (e.target.className === "ing-container"){
            e.preventDefault();
        }
    })

    document.addEventListener("drop", function(e){
        if (e.target.className === "ing-container"){
            e.preventDefault();
                let imageSrc = e.dataTransfer.getData("ingredient")
                let imageId = e.dataTransfer.getData("id")
                const imgAdded = document.createElement('img')
                imgAdded.className = "ing-img"
                imgAdded.src = imageSrc
                ingContainer.append(imgAdded)
                addToArray(imageId)
        }
    })

    function addToArray(imageId){
        fetch(`${baseUrl}/ingredients/${imageId}`)
        .then(resp => resp.json())
        .then(ingredient => {
            recipeGuess.push(ingredient.name)
            console.log(recipeGuess)
        })
    }

    function fetchRecipeList(recipeId){
        fetch(`${baseUrl}/recipes/${recipeId}`)
        .then(resp => resp.json())
        .then(recipeList => {
            recipeCompare = []
            recipeList.ingredients.forEach(ingredient => recipeCompare.push(ingredient.name))
        })
    }

    document.addEventListener('click', function(e){
       if (e.target.id === "submit-button") {
           console.log(recipeCompare)
           compareSubmission()
       } else if (e.target.id === "empty-button") {
           recipeGuess = []
           ingContainer.innerHTML = ''
       }
    })

    function compareSubmission(){
        let guessedArray = JSON.stringify(recipeGuess)
        let compareArray = JSON.stringify(recipeCompare)
        if (guessedArray == compareArray) {
            alert("YOU DID IT! You're amazing!")
            recipeGuess = []
            ingContainer.innerHTML = ''
        } else {
            alert("Try again :(")
            recipeGuess = []
            ingContainer.innerHTML = ''
        }
    }

})
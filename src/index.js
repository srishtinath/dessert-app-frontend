const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingContainer = document.getElementsByClassName("ing-container")[0]
const ingList = document.getElementsByClassName("ing-list")[0]
const recipeGuess = []
const recipeCompare = []

document.addEventListener("DOMContentLoaded", function(){

    function fetchIngredients(){
        fetch(`${baseUrl}/ingredients`)
        .then(resp => resp.json())
        .then(ingredients => renderIngredients(ingredients))
    }

    function renderIngredients(ingredients){
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

    fetchIngredients()
  
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    document.addEventListener("dragstart", function (e){
        if (e.target.className === "ing-img"){
            document.getElementsByClassName = "timer"
            let interval = setInterval(timer,1000);
            e.dataTransfer.setData("ingredient", e.target.src)
            e.dataTransfer.setData("id", e.target.dataset.id)
        }
    })

    document.addEventListener("dragover",function(e){
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

    function fetchRecipeList(){
        fetch(`${baseUrl}/recipes/1`)
        .then(resp => resp.json())
        .then(recipeList => {
            recipeList.ingredients.forEach(ingredient => recipeCompare.push(ingredient.name))
        })
    }

    fetchRecipeList()

    document.addEventListener('click', function(e){
       if (e.target.className === "bake-button") {
           console.log(e.target)
           compareSubmission()
       } 
    })

    function compareSubmission(){
        let guessedArray = JSON.stringify(recipeGuess)
        let compareArray = JSON.stringify(recipeCompare)
        if (guessedArray == compareArray) {
            alert("YOU DID IT! You're amazing!")
        } else {
            console.log("Try again :(")
        }
    }

})
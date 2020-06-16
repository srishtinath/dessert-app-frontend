const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingContainer = document.getElementsByClassName("ing-container")[0]
const ingList = document.getElementsByClassName("ing-list")[0]
const recipeInfo = document.getElementById("recipe-info")
const dropdown = document.getElementById("recipes")
const submit = document.getElementById("submit-button")
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

    function disableSubmit(){
        submit.disabled = true
    }

    fetchIngredients()
    fetchRecipes()
    disableSubmit()
  
    function renderDifficulty(number, size){
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
        recipeInfo.innerHTML = `<br>Difficulty: ${difficulty}
        <br>Number of Ingredients: ${size}`
    }

    dropdown.addEventListener('change', function(e){
        const recipeId = parseInt(e.target.value)
        if (!isNaN(recipeId)){
            submit.disabled = false
            fetch(`${baseUrl}/recipes/${recipeId}`)
            .then(resp => resp.json())
            .then(recipe => {
            fetchRecipeList(recipeId)
            renderDifficulty(recipe.difficulty_level, recipe.ingredients.length)
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
        if (imageId){
            fetch(`${baseUrl}/ingredients/${imageId}`)
            .then(resp => resp.json())
            .then(ingredient => {
                recipeGuess.push(ingredient.name)
                console.log(recipeGuess)
            })
        }
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

    let modal = document.getElementById("myModal");
    let modalText = document.getElementsByClassName("modal-text")[0]
    let btn = document.getElementById("submit-button");

    function compareSubmission(){
        let guessedArray = JSON.stringify(recipeGuess)
        let compareArray = JSON.stringify(recipeCompare)
        let message;

        console.log(recipeCompare)
        console.log(recipeGuess)
        
        
        // check length 
        if (recipeCompare.length === recipeGuess.length) {
            message = "You have the right number of ingredients."
        } else {
            message = "You don't have the right number of ingredients."
        }
            
        // check if all ingredients are present
        let booleanArray = []
        recipeGuess.forEach(guess => {
            booleanArray.push(recipeCompare.includes(guess))
        });
        if (booleanArray.includes(false) || booleanArray.length != recipeCompare.length){
            message = message.concat(" You don't have all ingredients required for this recipe.")
        } else {
            message = message.concat(" You have all the right ingredients.")
        }

        // check if array elements are in the right order
        if (guessedArray === compareArray) {
            message = "YOU DID IT! NICE JOB!"
        } else {
            message = message.concat(" Not quite there yet...")
        }

        renderModalContent(message)
        recipeGuess = []
        ingContainer.innerHTML = ''
        message = ''
    }

    function renderModalContent(string){
        modalText.textContent = string
        let modalBox = document.getElementsByClassName("modal-content")[0]
        if (string === "YOU DID IT! NICE JOB!") {
            modalBox.style.backgroundColor = "green"
        } else {
            modalBox.style.backgroundColor = "red"
        }
    }

    function modalElements(){
        let span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        btn.onclick = function() {
        modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
        modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        }
    }

    modalElements()

})
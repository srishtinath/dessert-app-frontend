const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingContainer = document.getElementsByClassName("ing-container")[0]
const ingList = document.getElementsByClassName("ing-list")[0]
const recipeInfo = document.getElementById("recipe-info")
const dropdown = document.getElementById("recipes")
let recipeGuess = []
let recipeCompare = []
let seconds = 0
let minutes = 0
let displaySeconds = 0
let displayMinutes = 0
let status = "stopped"
const timer = document.getElementsByClassName("timer")[0]
const button = document.getElementById("baking-button")




document.addEventListener("DOMContentLoaded", function(){
    console.log(button)

function stopWatch(){
    
    seconds ++;

   if (seconds/60 === 1){
       seconds = 0 
       minutes ++;
   }

   if (seconds < 10){
       displaySeconds = "0" + seconds.toString()
   }
   else {
       displaySeconds=seconds
    }

    if (minutes < 10){
        displayMinutes = "0" + minutes.toString()
    }
    else {
        displayMinutes=minutes
     }

   timer.innerHTML = `Time expired: ${displayMinutes}:${displaySeconds}`
   console.log(timer)
    
   }

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
            fetch(`${baseUrl}/recipes/${recipeId}`)
            .then(resp => resp.json())
            .then(recipe => {
            fetchRecipeList(recipeId)
            renderDifficulty(recipe.difficulty_level, recipe.ingredients.length)
        })
        }
    })
    
    // var timerNumber;

        // button.addEventListener('click',function(e){
        //  if (status === "stopped"){
        //     timerNumber = window.setInterval(stopWatch,1000)}
        // else {
        //         clearInterval(timerNumber)
        //     }
        //     })

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
            status = "started"
             alert("Try again :(")
            recipeGuess = []
            ingContainer.innerHTML = ''
        }
    }
})


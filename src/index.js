const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingDrag = document.getElementsByClassName("ing-drag")[0]
const ingList = document.getElementsByClassName("ing-list")[0]
const recipeInfo = document.getElementById("recipe-info")
const dropdown = document.getElementById("recipes")
const submit = document.getElementById("submit-button")
let recipeGuess = []
let recipeCompare = []
let seconds = 0
let minutes = 0
let displaySeconds = 0
let displayMinutes = 0
let timer;
let status = "stopped"
const timerDisplay = document.getElementsByClassName("timer")[0]
const button = document.getElementById("baking-button")

document.addEventListener("DOMContentLoaded", function(){
    // Timer functions

    function startTimer(){
    seconds ++;

    if (seconds/60 === 1){
        seconds = 0 
        minutes ++;
    }

    if (seconds < 10){
        displaySeconds = "0" + seconds.toString()
    } else {
        displaySeconds=seconds
    }

    if (minutes < 10){
        displayMinutes = "0" + minutes.toString()
    } else {
        displayMinutes=minutes
    }

    timerDisplay.innerHTML = `Time expired: ${displayMinutes}:${displaySeconds}`
    console.log(timer)
    
   }


   function timerOn(){
    timer = window.setInterval(startTimer,1000)

   }

   function stopTimer(){
        clearInterval(timer)
        seconds = 0
        minutes = 0
        displaySeconds = "00"
        displayMinutes = "00"
    timerDisplay.innerHTML = `Time expired: ${displayMinutes}:${displaySeconds}`
   }

   // fetch initial information
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
        button.disabled = true
    }

    fetchIngredients()
    fetchRecipes()
    disableSubmit()
  
    function renderDifficulty(number, size){
        let difficulty;
        switch (number) {
            case 1:
            case 2:
            case 3:
            case 4:
                difficulty = "Easy"
                break;
            case 5:
            case 6:
            case 7:
                difficulty = "Medium"
                break;
            case 8:
            case 9:
            case 10:
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
            button.disabled = false
            fetch(`${baseUrl}/recipes/${recipeId}`)
            .then(resp => resp.json())
            .then(recipe => {
            fetchRecipeList(recipeId)
            renderDifficulty(recipe.difficulty_level, recipe.ingredients.length)
        })
        }
    })
    
        button.addEventListener('click',function(e){
            timerOn()           
            })

        document.addEventListener("dragstart", function(e){
        if (e.target.className === "ing-img"){
            e.dataTransfer.setData("ingredient", e.target.src)
            e.dataTransfer.setData("id", e.target.dataset.id)
        }
    })

    
        document.addEventListener("dragover", function(e){
        if (e.target.className === "ing-drag"){
            e.preventDefault();
        }
    })



    document.addEventListener("drop", function(e){
        if (e.target.className === "ing-drag"){
            e.preventDefault();
            let imageSrc = e.dataTransfer.getData("ingredient")
            let imageId = e.dataTransfer.getData("id")
            const imgSpan = document.createElement('span')
            imgSpan.dataset.id = imageId
            imgSpan.className = "add-contain"
            imgSpan.innerHTML = `<img src="${imageSrc}" class="ing-img"><button class="dlt-ing" id=${imageId}>&times;</button>`
            ingDrag.append(imgSpan)
            addToArray(imageId)
        }
    })

    function addToArray(imageId){
        if (imageId){
            fetch(`${baseUrl}/ingredients/${imageId}`)
            .then(resp => resp.json())
            .then(ingredient => {
                recipeGuess.push(ingredient.name)
                const deleteButton = document.getElementById(ingredient.id)
                deleteButton.dataset.name = ingredient.name
            })
        }
    }


    function removeFromArray(name){
        let number = recipeGuess.findIndex(element => element === name)
        recipeGuess.splice(number, 1)
        console.log(recipeGuess)
    }

    function removefromDOM(id){
        let imgDivToDelete = document.querySelector(`[data-id="${id}"]`)
        imgDivToDelete.remove()
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
           stopTimer()
       } else if (e.target.id === "empty-button") {
           recipeGuess = []
           ingDrag.innerHTML = ''
           
       } else if (e.target.className === "dlt-ing") {
           removeFromArray(e.target.dataset.name)
           removefromDOM(parseInt(e.target.id))
       }
    })



    // check entry logic
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
        ingDrag.innerHTML = ''
        message = ''

    }

    function renderModalContent(string){
        modalText.textContent = string
        let modalBox = document.getElementsByClassName("modal-content")[0]
        if (string === "YOU DID IT! NICE JOB!") {
            modalBox.style.backgroundColor = "#f8a3b9"
        } else {
            modalBox.style.backgroundColor = "#8f7c5d"
        }
    }

    // modal styling
    function modalElements(){
        let span = document.getElementsByClassName("close")[0];

        btn.onclick = function() {
        modal.style.display = "block";
        }

        span.onclick = function() {
        modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    modalElements()

})

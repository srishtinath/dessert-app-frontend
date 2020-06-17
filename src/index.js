const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingContainer = document.getElementsByClassName("ing-container")[0]
const ingList = document.getElementsByClassName("ing-list")[0]
const recipeInfo = document.getElementById("recipe-info")
const dropdown = document.getElementById("recipes")
const submit = document.getElementById("submit-button")
let recipeGuess = []
let recipeCompare = []
let seconds = 60
let minutes = 0
let displaySeconds = 0
let displayMinutes = 0
let timer;
let status = "stopped"
let timeTaken;

const points = document.getElementById("skill-points")
let skillPts = 0

const timerDisplay = document.getElementsByClassName("timer")[0]
const button = document.getElementById("baking-button")


document.addEventListener("DOMContentLoaded", function(){

function startTimer(){

    seconds --;
   if (seconds/60 === 1){
       seconds = 0 
       minutes --;
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
   timerDisplay.innerHTML = `Time expired: ${displayMinutes}:${displaySeconds}`  
   redo()
}


    function timerOn(){
        timer = window.setInterval(startTimer,1000)
    }

    function stopTimer(){
        clearInterval(timer)
        displaySeconds = "00"
        displayMinutes = "00"
        timerDisplay.innerHTML = `Time expired: ${displayMinutes}:${displaySeconds}`
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
            case 2:
            case 3:
            case 4:
                seconds = 60
                difficulty = "Easy"
                break;
            case 5:
            case 6:
            case 7:
                seconds = 45
                difficulty = "Medium"
                break;
            case 8:
            case 9:
            case 10:
                seconds = 30
                difficulty = "Hard"
                break; 
            default:
                difficulty = "Easy"
                break;
        }
        recipeInfo.innerHTML = `<br>Difficulty: ${difficulty}
        <br>Number of Ingredients: ${size}`
        recipeInfo.dataset.difficulty = difficulty
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
           stopTimer()
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
        if (guessedArray == compareArray) {
            alert("YOU DID IT! You're amazing!")
            const timeTaken = seconds
            skillPoints(timeTaken)
            recipeGuess = []
            ingContainer.innerHTML = ''
        } else {
            getDifficulty()
            alert("Try again :(")
            recipeGuess = []
            ingContainer.innerHTML = ''
        }

        renderModalContent(message)
        recipeGuess = []
        ingContainer.innerHTML = ''
        message = ''
    }

        function getDifficulty(){
            if (recipeInfo.dataset.difficulty === "Easy"){
                seconds = 60}
            else if (recipeInfo.dataset.difficulty === "Medium"){
                seconds = 45}
            else {seconds = 30}
        }

         function redo(){
            if (seconds < 1){
            alert("You have ran out of time.Try again.") 
            stopTimer()
            getDifficulty()
                }
            }
        
            function skillPoints(seconds){
                if (seconds > 20 || seconds === 20){
                    skillPts = skillPts + 50
                    points.innerHTML = `${skillPts}`
                }
                else if (seconds > 10 || seconds === 10 || seconds < 20){
                    skillPts = skillPts + 20
                    points.innerHTML = `${skillPts}`
                }
                else if (seconds > 5 || seconds < 10 || seconds === 5){
                    skillPts = skillPts + 20
                    points.innerHTML = `${skillPts}`
                }
                else if (seconds === 0){
                    skillPts = skillPts + 0
                    points.innerHTML = `${skillPts}`
                }

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

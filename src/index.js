const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingDrag = document.getElementsByClassName("ing-drag")[0]
const ingList = document.getElementsByClassName("ing-list")[0]
const recipeInfo = document.getElementById("recipe-info")
const dropdown = document.getElementById("recipes")
const submit = document.getElementById("submit-button")
let recipeGuess = []
let recipeCompare = []
let seconds = 60
let minutes = 0
let displaySeconds = "00"
let displayMinutes = "00"
let timer;
let timeTaken;
let skillPts = 0
const points = document.getElementById("skill-points")
const timerDisplay = document.getElementsByClassName("timer")[0]
const button = document.getElementById("baking-button")
const resetTimer = document.getElementById("reset-timer")
const pauseTimerButton = document.getElementById("pause-timer")
const emptyBowl = document.getElementById("empty-button")
let guessesNumber = 0

document.addEventListener("DOMContentLoaded", function(){
    // Number of tries
    
    function guessIncrement(){
        guessesNumber ++;
        let guessNode = document.getElementsByClassName('guess-number')[0]
        guessNode.innerText = guessesNumber
    }
    
    function resetGuesses(){
        guessesNumber = 0
        let guessNode = document.getElementsByClassName('guess-number')[0]
        guessNode.innerText = guessesNumber
    }
    
    // Timer functions

    function startTimer(){
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
        seconds --;
        timerDisplay.innerHTML = `Time remaining: ${displayMinutes}:${displaySeconds}`
        redo()
    }
    
    function getDifficulty(){
        if (recipeInfo.dataset.difficulty === "Easy"){
            seconds = 60
        } else if (recipeInfo.dataset.difficulty === "Medium"){
            seconds = 45
        } else {
            seconds = 30
        }
    }
            
    function redo(){
        if (seconds < 1){
            alert("You ran out of time :( Try again.")
            stopTimer()
            getDifficulty()
        }
    }
            
    
    function skillPoints(seconds){
        if (seconds >= 20){
            skillPts = skillPts + 50
        }
        else if (seconds >= 10 && seconds < 20){
            skillPts = skillPts + 20
        }
        else if (seconds >= 5 && seconds < 10){
            skillPts = skillPts + 20
        }
        else if (seconds === 0){
            skillPts = skillPts + 0
        }

        let skillPtsFromTries
        if (guessesNumber === 1) {
            skillPtsFromTries = 50;
        } else if(guessesNumber > 1 && guessesNumber <= 5){
            skillPtsFromTries = 60 + guessesNumber * (-10)
        } else {
            skillPtsFromTries = 0
        }

        skillPts = skillPts + skillPtsFromTries
        points.innerHTML = `${skillPts}`
    }

    function timerOn(){
        timer = window.setInterval(startTimer, 1000)
        // resetTimer.disabled = false
        pauseTimerButton.disabled = false
    }

    function stopTimer(){
        clearInterval(timer)
        displaySeconds = "00"
        displayMinutes = "00"
        seconds = 0
        timerDisplay.innerHTML = `Time remaining: ${displayMinutes}:${displaySeconds}`
    }
    
    function pauseTimer(){
        clearInterval(timer)
        timerDisplay.innerHTML = `Time remaining: ${displayMinutes}:${displaySeconds}`
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
        // resetTimer.disabled = true
        pauseTimerButton.disabled = true
        emptyBowl.disabled = true
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
                seconds = 60
                break;
            case 5:
            case 6:
            case 7:
                seconds = 45
                difficulty = "Medium"
                seconds = 45
                break;
            case 8:
            case 9:
            case 10:
                seconds = 30
                difficulty = "Hard"
                seconds = 30
                break; 
            default:
                difficulty = "Easy"
                break;
        }
        recipeInfo.innerHTML = `<br><h5>Difficulty: ${difficulty}</h5>
        <h5>Number of Ingredients: ${size}</h5>`
        recipeInfo.dataset.difficulty = difficulty
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
            button.disabled = false
            pauseTimer()
            resetGuesses()
            cover.style.display = "block"
        })
        }
    })
    
    button.addEventListener('click', function(e){
        getDifficulty()
        timerOn()
        button.disabled = true 
        cover.style.display = "none"          
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
            emptyBowl.disabled = false
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
           compareSubmission()
        } else if (e.target.id === "empty-button") {
           recipeGuess = []
           ingDrag.innerHTML = ''
        } else if(e.target.id === "pause-timer" && e.target.textContent === "Pause Timer") {
            pauseTimer()
            e.target.textContent = "Resume Timer"
        } else if(e.target.id === "pause-timer" && e.target.textContent === "Resume Timer") {
            timerOn()
            e.target.textContent = "Pause Timer"
        // } else if(e.target.id === "reset-timer") {
        //     getDifficulty()
        //     displaySeconds = seconds
        //     timerDisplay.innerText = `Time remaining: ${displayMinutes}:${displaySeconds}`
        // timerOn()
        
        } else if (e.target.className === "dlt-ing") {
           removeFromArray(e.target.dataset.name)
           removefromDOM(parseInt(e.target.id))
        }
    })

    // check entry logic
    let modal = document.getElementById("myModal");
    let modalText = document.getElementsByClassName("modal-text")[0]
    let btn = document.getElementById("submit-button");
    let cover = document.getElementById('cover')


    function compareSubmission(){
        let guessedArray = JSON.stringify(recipeGuess)
        let compareArray = JSON.stringify(recipeCompare)
        let message;
        
        // check length 
        if (recipeCompare.length === recipeGuess.length) {
            let booleanArray = []
            recipeGuess.forEach(guess => {
            booleanArray.push(recipeCompare.includes(guess))
            });
            // check ingredients
            if (booleanArray.includes(false)) { 
                message = "You have the right number but wrong ingredients. These are the correct ingredients so far:"
                let rightIngred = recipeGuess.filter(guess => recipeCompare.includes(guess))
                message = message.concat(rightIngred.join(" "))
                guessIncrement()
            } else {
                // check order
                if (guessedArray === compareArray) {
                    message = "YOU DID IT! CONGRATULATIONS! You're ready to become a real patissier! Don't forget your pastry chef hat when applying to pastry school!"
                    const timeTaken = seconds
                    skillPoints(timeTaken)
                    resetGuesses()
                } else {
                    // wrong order
                    message = "You have the right ingredients, but in the wrong order. These are ones you guessed correctly so far:"
                    let rightOrd = compareArrays(recipeGuess, recipeCompare)
                    message = message.concat(rightOrd.join(" "))
                    guessIncrement()
                }
            }
        } else {
            message = "You don't have the right number of ingredients. Try again."
            guessIncrement()
        }
        
        renderModalContent(message)
        recipeGuess = []
        ingDrag.innerHTML = ''
        message = ''

    }

    function compareArrays(guessArray, compareArray){
        let returnArray = []
        for (const guess of guessArray) {
            if (compareArray.indexOf(guess) === guessArray.indexOf(guess)) {
                returnArray.push(guess);
            }
        }
        return returnArray;
    }


    function renderModalContent(string){
        modalText.textContent = string
        let modalBox = document.getElementsByClassName("modal-content")[0]
        if (string === "YOU DID IT! CONGRATULATIONS! You're ready to become a real patissier! Don't forget your pastry chef hat when applying to pastry school!") {
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
        pauseTimer()
        }

        span.onclick = function() {
        modal.style.display = "none";
        timerOn()
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        
    }

    modalElements()

})

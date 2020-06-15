const baseUrl = "http://localhost:3000"
const pantryContainer = document.getElementsByClassName("pantry-container")[0]
const ingContainer = document.getElementsByClassName("ing-container")[0]

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
        <img src="assets/images/${ingredient.image}" class="ing-img">
        <br>${ingredient.name}`
        pantryContainer.append(ingredientDiv)
        // clickAndDrag(ingredientDiv)
    }

    fetchIngredients()
  
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        console.log(e.target)
        const imgList = document.getElementsByClassName("ing-list")[0]
        const imgAdded = document.createElement('img')   
        imgAdded.className = "ing-img"
        imgAdded.src = "assets/images/vanilla.png"
        imgList.append(imgAdded)
    }
 
    ingContainer.addEventListener('dragenter', preventDefault, false);
    ingContainer.addEventListener('dragleave', preventDefault, false);
    ingContainer.addEventListener('dragover', preventDefault, false);
    ingContainer.addEventListener('drop', preventDefault, false);

    ingContainer.addEventListener('drop', handleDrop, false);

})
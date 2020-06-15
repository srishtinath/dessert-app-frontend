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
        <img src="assets/images/${ingredient.image}" class="ing-img" data-id = ${ingredient.id} draggable="true">
        <br>${ingredient.name}`
        pantryContainer.append(ingredientDiv)
        // clickAndDrag(ingredientDiv)
    }

    fetchIngredients()
  
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }


    document.addEventListener("dragstart", function (e){
        if (e.target.className === "ing-img"){
            e.dataTransfer.setData("ingredient", e.target.src)
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
             const imgAdded = document.createElement('img')   
            imgAdded.className = "ing-img"
            imgAdded.src = imageSrc
            ingContainer.append(imgAdded)
        }
    })
})
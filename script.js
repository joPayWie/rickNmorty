const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const BASE_URL = "https://rickandmortyapi.com/api/"

let page = 1

let totalPages

const getCharacters = async (endpoint = "") => {
    const response = await fetch(`${BASE_URL}character/?${endpoint}`)
    const info = await response.json()
    return info
}

const radioBtnChecked = (radioBtns) => {
    for (const btn of radioBtns) {
        if (btn.checked) {
            return btn.value
        }
    }
}

const filterChar = () => {
    let params = new URLSearchParams({
        page: page,
        name: $("#character-name").value,
        status: radioBtnChecked($$(".status-radio")) ? radioBtnChecked($$(".status-radio")) : '',
        gender: radioBtnChecked($$(".gender-radio")) ? radioBtnChecked($$(".gender-radio")) : '',
    })
    return params.toString()
}

getCharacters(filterChar()).then(data => { 
    renderCharacters(data.results)
    totalPages = data.info.pages
}).catch(err => {   
    $("#cards").innerHTML = "" 
    $("#error-p").innerHTML = "No se encontraron resultados"
})

const renderCharacters = (characters) => {
    if (characters.length !== 0) {
        $("#error-p").innerHTML = ""
        $("#cards").innerHTML = ""
        for (const { id, gender, image, name, species, status } of characters) {
            $("#cards").innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="${image}" class="card-img-top" alt="Avatar de ${name}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">Gender: ${gender}</p>
                        <p class="card-text">Status: ${status}</p>
                        <p class="card-text">Species: ${species}</p>
                        <a href="#" class="btn btn-primary" onclick="getCharacter(${id})">Ver detalles</a>
                    </div>
                </div>
            `
        }
    } else {
        $("#cards").innerHTML = ""
        $("#error-p").innerHTML = "No se encontraron resultados"
    }
}


// const filterChar = () => {
//     return `&name=${$("#character-name").value}&status=${radioBtnChecked($$(".status-radio")) ? radioBtnChecked($$(".status-radio")) : ''}&gender=${radioBtnChecked($$(".gender-radio")) ? radioBtnChecked($$(".gender-radio")) : ''}`
// }


$("form").addEventListener("submit", (e) => {
    e.preventDefault()
    getCharacters(filterChar()).then(data => renderCharacters(data.results)).catch(err => {   
        $("#cards").innerHTML = "" 
        $("#error-p").innerHTML = "No se encontraron resultados"
    })
})

$("#btn-reset").addEventListener("click", () => {
    $("form").reset()
    $("#cards").innerHTML = ""
    getCharacters(filterChar()).then(data => renderCharacters(data.results)).catch(err => {   
        $("#cards").innerHTML = "" 
        $("#error-p").innerHTML = "No se encontraron resultados"
    })
})

const nextPage = () => {
    page = page + 1
    for ( const prevBtn of $$(".prev") ) {
            prevBtn.removeAttribute("disabled")
        }
    if ( page === totalPages ) {
        for ( const nextBtn of $$(".next") ) {
           nextBtn.setAttribute("disabled", true)
        }
    }
}

const prevPage = () => {
    if ( page > 1 ) {
        page = page - 1
    } 
    if (page === 1) {
        for ( const prevBtn of $$(".prev") ) {
            prevBtn.setAttribute("disabled", true)
        }
    }
}

for ( const prevBtn of $$(".prev") ) {
    prevBtn.addEventListener("click", () => {
        prevPage()
        getCharacters(filterChar()).then(data => renderCharacters(data.results)).catch(err => {   
            $("#cards").innerHTML = "" 
            $("#error-p").innerHTML = "No se encontraron resultados"
        })
    })
}

for ( const nextBtn of $$(".next") ) {
    nextBtn.addEventListener("click", () => {
        nextPage()
        getCharacters(filterChar()).then(data => renderCharacters(data.results)).catch(err => {   
            $("#cards").innerHTML = "" 
            $("#error-p").innerHTML = "No se encontraron resultados"
        })
    })
}

for ( const prevBtn of $$(".prev") ) {
    prevBtn.setAttribute("disabled", true)
}
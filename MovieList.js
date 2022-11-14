const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const IMAGE_URL = BASE_URL + "/posters/"
const dataPanel = document.querySelector('#data-panel')
const movies = []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="card">
        <img src="${IMAGE_URL + item.image}" class="card-img-top"
          alt="movie-image">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
          data-bs-target="#movie-detail-info" data-id='${item.id}'>more</button>
        <button class="btn btn-info btn-add-movie" data-id ='${item.id}'>+</button>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')
  const movieImage = document.querySelector("#movie-modal-image")

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    movieTitle.innerText = data.title
    movieDate.innerText = 'Release date: ' + data.release_date
    movieDescription.innerText = data.description
    movieImage.innerHTML = ` <img src="${IMAGE_URL + data.image}"
    alt="movie-poster" class="img-fluid">`
  })
}


function addFavouriteBtn(id){
  const list = JSON.parse(localStorage.getItem("favouriteMovies"))|| []
  const movie = movies.find((movie) =>  movie.id === id) 

  if(list.some((movie)=> movie.id===id)){
    return alert("hkihkhg")
  }

  list.push(movie)
  localStorage.setItem("favouriteMovies", JSON.stringify(list))
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  const target= event.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (target.matches('.btn-add-movie')){
    addFavouriteBtn(Number(event.target.dataset.id))
  }
})


axios.get(INDEX_URL).then(response => {
  console.log(response)
  movies.push(...response.data.results)
  console.log(movies)
  renderMovieList(movies)
})

searchForm.addEventListener("submit", function onSubmitBtn(event){
  event.preventDefault()
  const target =event.target
  const inputText = searchInput.value.trim().toLowerCase()
  console.log(inputText)

  const filterName= movies.filter((movie) => movie.title.toLowerCase().includes(inputText))
  if(filterName.length===0){
    return alert("Don't find a relative movies")
  }
  renderMovieList(filterName)
  
})
const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const searchBtn = document.querySelector("#search-btn")
const dataPanel = document.querySelector("#data-panel")
const movieModal = document.querySelector("#movie-modal")

const searchInput = document.querySelector("#search-input")
const searchForm = document.querySelector("#search-form")
const paginator = document.querySelector("#paginator")
const movies = []

const MOVIE_PER_PAGE = 12

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  let filteredMovies = []

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert("cannot find movie with keyword")
  }
  movieDatas(filteredMovies)
})


function movieDatas(data) {
  let htmlContent = ""
  data.forEach(datas => {
    htmlContent += `
        <div class="col-sm-2">
          <div class="mb-2">

          <img
            src="${POSTER_URL + datas.image}"
            class="card-img-top" alt="電影照片">
          <div class="card-body">
            <h5 class="card-title">${datas.title}</h5>
             <a href="#" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#movie-modal" data-id=${datas.id}>More</a>
            <a href="#" class="btn btn-info btn-add-favorite" data-id="${datas.id}">+</a>
          </div>

        </div>
      </div>
    `
    dataPanel.innerHTML = htmlContent
  })
}

function showMoviesModal(id) {
  const movieModalTittle = document.querySelector("#movie-modal-title")
  const movieModalImage = document.querySelector("#movie-modal-image")
  const movieModalDate = document.querySelector("#movie-modal-date")
  const movieModalDescription = document.querySelector("#movie-modal-description")

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    movieModalTittle.innerText = data.title
    movieModalDate.innerText = "Release Date:" + data.release_date
    movieModalDescription.innerText = data.description
    movieModalImage.innerHTML = `
    <img src="${POSTER_URL + data.image}" alt="電影照片" class="img-fluid">
    `
  })
}

function addFavorite(id) {
  const dataStorage = JSON.parse(localStorage.getItem("favouriteList")) || []
  const movieList = movies.find((movie) => movie.id === id)

  if (dataStorage.some((movie) => movie.id === id)) {
    return alert("此電影已經放入儲存空間中")
  }
  dataStorage.push(movieList)

  localStorage.setItem("favouriteList", JSON.stringify(dataStorage))
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMoviesModal(Number(event.target.dataset.id))
  } else if (event.target.classList.contains("btn-add-favorite")) {
    addFavorite(Number(event.target.dataset.id))
  }
})

function getMoviePages(page) {
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return movies.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHtml = ""
  for (let page = 1; page <= numberOfPage; page++) {
    rawHtml += ` <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHtml
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") {
    return
  }

  const pageNumber = event.target.dataset.page
  movieDatas(getMoviePages(pageNumber))
}
)
axios.get(INDEX_URL).then((response) => {
  //Array [80]
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  movieDatas(getMoviePages(1))
})



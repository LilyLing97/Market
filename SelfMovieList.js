const BASIC_URL = "https://movie-list.alphacamp.io"
const Index_URL = BASIC_URL + "/api/v1/movies/"
const Posters_URL = BASIC_URL + "/posters/"

const dataPanel = document.querySelector("#data-Panel")
const paginator = document.querySelector("#paginator")

const movies = []
const MOVIES_PER_PAGE = 12


function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item" > <a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function separateMovie(page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}


function renderMovieList(data) {
  let htmlContent = ""
  data.forEach(datas => {
    htmlContent += `
      <div class="col-sm-2">
        <div class="card">
          <img src="${Posters_URL + datas.image}" class="card-img-top"
            id="movie-image" alt="電影照片">
          <div class="card-body">
            <h5 class="card-title">${datas.title}</h5>
            <button type="button" class="btn btn-warning" id="more-btn" data-bs-toggle="modal"
              data-bs-target="#movie-modal" data-id=${datas.id}>More</button>
            <button type="button" class="btn btn-success" id="add-btn">+</button>
          </div>
        </div>
      </div>
    `
    dataPanel.innerHTML = htmlContent
  })
}


function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalImage = document.querySelector("#movie-modal-image")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDesciption = document.querySelector("#movie-modal-description")

  axios.get(Index_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = data.release_date
    modalDesciption.innerText = data.description
    modalImage.innerHTML = `<img src="${Posters_URL + data.image}"></script>`
  })
}

dataPanel.addEventListener("click", function moreBtn(event) {
  if (event.target.matches("#more-btn")) {
    showMovieModal(Number(event.target.dataset.page))
  }
})

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return
  const targetPage = event.target.dataset.page
  renderMovieList(separateMovie(targetPage))
})


axios.get(Index_URL).then(response => {
  movies.push(...response.data.results)

  renderPaginator(movies.length)
  renderMovieList(separateMovie(1))
})

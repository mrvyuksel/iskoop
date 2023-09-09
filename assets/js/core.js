const apiKey = "63f944af"; 

const findMovies = async () => {
  const moviesName = document.getElementById("moviesInput").value;
  const moviesList = document.querySelector(".movies-list");
  moviesList.innerHTML = "";
  moviesList.classList.add("searching");
  const apiUrl = ` https://www.omdbapi.com/?apikey=${apiKey}&s=${moviesName}`;
 

  await fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          
          if (data.Search.length > 0) {
              const storageList = JSON.parse(localStorage.getItem("moviesList")) || [];
              data.Search.forEach(async (item) => {
                storageList.push(item)
                setMovies(item)
              });
              localStorage.setItem("moviesList", JSON.stringify(storageList))
            } else {
                const resultHTML = "<p>Film bulunamadı.</p>";
                document.querySelector(".movies-list").insertAdjacentHTML("afterbegin", resultHTML)
            }
        })
        .catch(error => {
            const resultHTML = "<p>Film bulunamadı.</p>";
            document.querySelector(".movies-list").insertAdjacentHTML("afterbegin", resultHTML)
        });
}

const setMovies = async (data) => {
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${data.imdbID}`;
    const response = await fetch(apiUrl);
    const ratingData = await response.json();
    const rating = ratingData?.imdbRating;
    renderList(data, rating)
}

const renderList = (data, rating) => {
    const resultHTML = `
                  <div class="movies-item">
                    <div class="movies-img">
                        <img src="${data.Poster !== 'N/A' ? data.Poster : 'assets/images/none-img.png'}" />
                    </div>
                    <div class="movies-title">${data.Title}</div>
                    <div class="movies-point">Rating: ${rating ? rating : data.imdbRating}</div>
                    <div class="movies-indicator">
                        <div class="indicator" style="left:${Number(rating ? rating : data.imdbRating)*10}%"></div>
                        <div class="movies-indicator-inner">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div class="movies-remove">x</div>
                  </div>
                  `;
    document.querySelector(".movies-list").insertAdjacentHTML("afterbegin", resultHTML)
}

const removeMovies = () => {
    const removeButton = document.querySelectorAll(".movies-remove");
    removeButton.forEach((btn) => {
        btn.addEventListener("click", function(){ 
            const title = btn.parentElement.querySelector(".movies-title").innerHTML;
            const storageList = JSON.parse(localStorage.getItem("moviesList")) || [];
            storageList.forEach((item, index) => {
                if(item.Title === title) {
                    storageList.splice(index, 1)
                    localStorage.setItem("moviesList",  JSON.stringify(storageList))
                }
            })
            btn.parentElement.remove();
         });
    })
}

document.addEventListener("DOMContentLoaded", (event) => {
    const storageList = JSON.parse(localStorage.getItem("moviesList")).reverse() || [];
    const currentList = [];
    storageList?.forEach((item, index) => {
        if(index < 10) {
            currentList.push(item);
            setMovies(item);
        }
    })

    localStorage.setItem("moviesList",  JSON.stringify(currentList))

    setTimeout(() => {
        removeMovies();
    }, 1000);
});
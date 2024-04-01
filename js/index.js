const albumSearchForm = document.querySelector("#album-search-form");
const searchInput = document.querySelector("#search-input");
const ratingInput = document.querySelector(".min-album-rating-input");
let albumStore = [];

function displayAlbums(albums) {
  const tbody = document.getElementById("album-rows");
  tbody.innerHTML = "";
  albums.forEach((album) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${album.album}</td>
        <td>${album.releaseDate}</td>
        <td>${album.artistName}</td>
        <td>${album.genres}</td>
        <td>${album.averageRating}</td>
        <td>${album.numberRatings}</td>
      `;
    tbody.appendChild(row);
  });
}

async function appInit() {
  const res = await fetch("public/data/albums.json");
  const payload = await res.json();
  albumStore = [...payload];
  displayAlbums(albumStore);
}

function filterData(name, rating) {
  const albums = [...albumStore];
  const filteredArray = albums.filter((album) => {
    if (name && rating) {
      if (
        album.artistName.toLowerCase().includes(name) &&
        album.averageRating >= parseFloat(rating)
      ) {
        return true;
      }
    } else if (name && album.artistName.toLowerCase().includes(name)) {
      return true;
    } else if (rating && album.averageRating >= parseFloat(rating)) {
      return true;
    }
    return false;
  });
  return filteredArray;
}

albumSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchName = event.target.elements["search-input"].value.toLowerCase();
  const searchNumber = event.target.elements["min-album-rating-input"].value;
  if (!searchName && !searchNumber) {
    displayAlbums([...albumStore]);
    return;
  }
  if (searchName && !searchNumber) {
    const tbody = document.getElementById("album-rows");
    tbody.innerHTML = `<tr><td colspan="6">No search results were found</td></tr>`;
    return;
  }
  if (!searchName && searchNumber) {
    const tbody = document.getElementById("album-rows");
    tbody.innerHTML = `<tr><td colspan="6">No search results were found</td></tr>`;
    return;
  }
  const filteredArray = filterData(searchName, searchNumber);
  displayAlbums(filteredArray);
});

appInit();

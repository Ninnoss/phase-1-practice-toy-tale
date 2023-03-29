let addToy = false;
const toysUrl = 'http://localhost:3000/toys';
const toysContainer = document.querySelector('#toy-collection');
const toyForm = document.querySelector('.add-toy-form');

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('#new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = 'block';
    } else {
      toyFormContainer.style.display = 'none';
    }
  });
});
toyForm.addEventListener('submit', createNewToy);

function createNewToy(e) {
  const newToyName = document.querySelector('input[name="name"]');
  const toyImgSrc = document.querySelector('input[name="image"]');
  e.preventDefault();
  const formData = {
    name: newToyName.value,
    image: toyImgSrc.value,
    likes: 0,
  };
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(formData),
  };

  fetch('http://localhost:3000/toys', config)
    .then((res) => res.json())
    .then((toy) => makeToyCard(toy))
    .catch((err) => console.error('Error:', err));
}


document.addEventListener('DOMContentLoaded', fetchToys);

function fetchToys() {
  fetch(toysUrl)
    .then((res) => res.json())
    .then(addToys)
    .catch((err) => console.error('Error:', err));
}

function addToys(toys) {
  toys.forEach(makeToyCard);
}

function makeToyCard(toy) {
  const { id, name, image, likes } = toy;

  const card = document.createElement('div');
  card.classList.add('card');

  const nameEl = document.createElement('h2');
  nameEl.textContent = name;

  const imgEl = document.createElement('img');
  imgEl.src = image;
  imgEl.classList.add('toy-avatar');

  const likesEl = document.createElement('p');
  likesEl.textContent = likes;

  const likeBtn = document.createElement('button');
  likeBtn.textContent = 'Like';
  likeBtn.dataset.id = id;
  likeBtn.classList.add('like-btn');

  card.append(nameEl, imgEl, likesEl, likeBtn);
  toysContainer.append(card);
  updateLikes();
}

function updateLikes() {
  const likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach((btn) => btn.addEventListener('click', handleLike));
}

function handleLike(e) {
  const btn = e.currentTarget;
  const card = btn.closest('.card');
  const likesEl = card.querySelector('p');
  const likes = parseInt(likesEl.textContent) + 1;

  const config = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ likes }),
  };

  fetch(`${toysUrl}/${btn.dataset.id}`, config)
    .then((res) => res.json())
    .then((data) => likesEl.textContent = data.likes)
    .catch((err) => console.error('Error:', err));
}

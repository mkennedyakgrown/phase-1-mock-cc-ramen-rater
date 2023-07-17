// write your code here
const url = 'http://localhost:3000/ramens';
const ramenMenu = document.getElementById('ramen-menu');
const ramenDetails = document.getElementById('ramen-detail');
const ratingDisplay = document.getElementById('rating-display');
const commentDisplay = document.getElementById('comment-display');
const editForm = document.getElementById('edit-ramen');
const editRating = document.getElementById('edit-rating');
const editComment = document.getElementById('edit-comment');
const ramenForm = document.getElementById('new-ramen');
const formName = document.getElementById('new-name');
const formRestaurant = document.getElementById('new-restaurant');
const formImage = document.getElementById('new-image');
const formRating = document.getElementById('new-rating');
const formComment = document.getElementById('new-comment');

document.addEventListener('DOMContentLoaded', () => {
    loadRamen();
    ramenForm.addEventListener('submit', handleNewRamen);
    editForm.addEventListener('submit', handleEditRamen);
});

function loadRamen() {
    while(ramenMenu.firstChild) {ramenMenu.removeChild(ramenMenu.firstChild)};
    fetch(url)
    .then(res => res.json())
    .then(json => json.forEach(element => loadOneRamen(element)))
    .then(() => {
        loadRamenDetails(ramenMenu.firstChild.id);
    });
}

function loadOneRamen(ramen) {
    try {
        const img = document.createElement('img');
        img.setAttribute('src', ramen.image);
        img.setAttribute('id', ramen.id);
        img.setAttribute('name', ramen.name);
        ramenMenu.appendChild(img);
        img.addEventListener('click', handleRamenSelection);
    } catch {};
}

function handleRamenSelection(event) {
    loadRamenDetails(event.target.id);
}

function loadRamenDetails(id) {
    fetch(`${url}/${id}`)
    .then(res => res.json())
    .then(ramen => {
        ramenDetails.querySelector('.detail-image').setAttribute('src', ramen.image);
        ramenDetails.querySelector('.name').innerText = ramen.name;
        ramenDetails.querySelector('.restaurant').innerText = ramen.restaurant;
        ratingDisplay.innerText = ramen.rating;
        commentDisplay.innerText = ramen.comment;
    });
}

function handleNewRamen(event) {
    event.preventDefault();
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
        body: JSON.stringify({
            name: formName.value,
            restaurant: formRestaurant.value,
            image: formImage.value,
            rating: formRating.value,
            comment: formComment.value,
        }),
    })
    .then(() => loadRamen());
}

function handleEditRamen(event) {
    event.preventDefault();
    const id = ramenMenu.querySelector(`[name="${ramenDetails.querySelector('.name').innerText}"]`).id;
    console.log(id);
    fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
        body: JSON.stringify({
            rating: editRating.value,
            comment: editComment.value,
        })
    })
    .then(loadRamen())
    .then(editForm.reset())
    .then(loadRamenDetails(id));
}
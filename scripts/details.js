const query = window.location.search;
const id = new URLSearchParams(query).get('id');

const bannerImage = document.querySelector('.banner-content > img ');

const titleName = document.querySelector('.banner h1');
const personDescription = document.querySelector('.banner p');

const personalImages = document.querySelectorAll('.personal-info img');
const personalInfoName = document.querySelector('#personal-info-name');
const personalInfoSocial = document.querySelector('#personal-info-social');
const personalInfoUrl = document.querySelector('#personal-info-url');

render();

// Get data according to ID
async function getMemberById() {
    const req = await fetch('https://tribe.api.fdnd.nl/v1/member');
    const res = await req.json();
    return res.data.find(student => student.memberId == id);
}

// Render the according data
async function render() {
    const member = await getMemberById()
    const avatar = member.avatar !== '' ? member.avatar : 'https://source.unsplash.com/random/1920x1080';

    titleName.innerText = `${member.name} ${member.prefix}${member.surname}`;
    personDescription.innerText = member.bio;
    
    personalImages.forEach(popularImage => {
        popularImage.src = avatar;
    });

    personalInfoName.innerText = `${member.name} ${member.surname}`;
    personalInfoSocial.innerText = `@${member.githubHandle}`;
    personalInfoUrl.innerText = `${member.url}`;

    bannerImage.src = avatar;
}
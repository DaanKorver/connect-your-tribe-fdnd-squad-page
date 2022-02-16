const query = window.location.search;
const id = new URLSearchParams(query).get('id');

const bannerImage = document.querySelector('.banner-content > img ');

const titleName = document.querySelector('.banner h1');
const personDescription = document.querySelector('.banner p');
const personalImages = document.querySelectorAll('.personal-info img');


render()

async function getMemberById() {
    const req = await fetch('https://tribe.api.fdnd.nl/v1/member');
    const res = await req.json();
    return res.data.find(student => student.memberId == id);
}

async function render() {
    const member = await getMemberById()
    const avatar = member.avatar !== '' ? member.avatar : 'https://source.unsplash.com/random/1920x1080';
    titleName.innerText = `${member.name} ${member.prefix}${member.surname}`
    personDescription.innerText = member.bio;
    
    personalImages.forEach(popularImage => {
        popularImage.src = avatar;
    });

    bannerImage.src = avatar;
}
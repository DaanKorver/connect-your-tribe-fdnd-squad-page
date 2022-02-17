//Variables
const songEl = document.querySelector('template')
const playlistEl = document.querySelector('table')
const preloader = document.querySelector('.preloader')
const playBtn = document.querySelector('.play-button')
const searchBar = document.getElementById('search')
let membersEls

//Functionality
fillPlaylist()

playBtn.addEventListener('click', shuffle)
searchBar.addEventListener('keyup', search)


//Functions

/**
 * Retrieves all of the members from the FDND API
 * 
 * @async
 * @function getMembers
 * @returns {Object[]} Array with members from FDND tribe
 */
async function getMembers() {
  const req = await fetch('https://tribe.api.fdnd.nl/v1/member')
  const res = await req.json()
  return res.data.filter(student => student.squadId === 1)
}

/**
 * Fills the table(playlist) element with rows(songs) per member from the API
 * 
 * @async
 * @function fillPlaylist
 */
async function fillPlaylist() {
  const members = await getMembers()
  members.forEach(async (member, index)=>{
    const song = songEl.content.cloneNode(true)
    const td = song.querySelectorAll('td')
    const fullName = `${member.name}${member.prefix ? member.prefix : ' '}${member.surname}`
    const githubHandle = getGithubHandle(member.githubHandle)
    const squad = 'FDND Founder' //Hardcoded otherwise it makes to much request to the /squad endpoint
    const memberData = [index + 1, fullName, squad, githubHandle, member.url, member.avatar]
    for (let i = 0; i < td.length; i++) {
      if(td[i].classList.contains('name')) {
        const avatar = memberData[memberData.length-1] || './assets/empty.svg'
        const className = memberData[memberData.length-1] ? '' : 'empty'
        const image = td[i].querySelector('img')
        const span = td[i].querySelector('span')
        span.innerText = memberData[i]
        image.src = avatar
        if(className) image.classList.add(className)
      } else {
        td[i].innerText = memberData[i]
      }
    }
    const tr = song.querySelector('tr')
    tr.addEventListener('click', ()=>{
      navigate(member.memberId)
    })
    tr.dataset.name = fullName
    playlistEl.appendChild(song)
  })
  membersEls = document.querySelectorAll('[data-name]')
  hidePreloader()
}

/**
 * Navigate to the detail page
 * 
 * @function navigate
 * @param {number} memberId The id that is gonna be used to navigate to the detail page
 */
function navigate(memberId) {
  window.location = `detail.html?id=${memberId}`
}

/**
 * Sanitizes the github handle
 * 
 * @function getGithubHandle
 * @param {*} handle The github handle. Can be a link or just the name
 * @returns {String} Github handle + @ sign
 */
function getGithubHandle(handle) {
  if(handle === '') handle = 'FDND'
  return `@${handle.replace(/https:\/\/github\.com\//gm, '')}`
}

/**
 * Hides the preloader
 * 
 * @function hidePreloader
 */
function hidePreloader() {
  setTimeout(()=>{
    document.body.style.overflow = 'auto'
    preloader.style.opacity = 0
    preloader.style.pointerEvents = 'none'
  },1200)
}

async function shuffle() {
  const members = await getMembers()
  const randomOffset = Math.floor(Math.random() * members.length)
  const randomMemberId = members.find((member, index) => index == randomOffset).memberId
  navigate(randomMemberId)
}

function search() {
  const searchValue = this.value.toLowerCase()
  if(this.value === '') {
    membersEls.forEach(member => {
      member.style.display = 'table-row'
    })
  } else {
    membersEls.forEach(member => {
      const name = member.dataset.name.toLowerCase()
      if(name.includes(searchValue)) {
        member.style.display = 'table-row'
      } else {
        member.style.display = 'none'
      }
    })
  }
}
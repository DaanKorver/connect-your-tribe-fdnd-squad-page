const songEl = document.querySelector('template')
const playlistEl = document.querySelector('table')

fillPlaylist()

async function getMembers() {
  const req = await fetch('https://tribe.api.fdnd.nl/v1/member')
  const res = await req.json()
  return res.data.filter(student => student.squadId === 1)
}

async function fillPlaylist() {
  const members = await getMembers()
  members.forEach(async (member, index)=>{
    const song = songEl.content.cloneNode(true)
    const td = song.querySelectorAll('td')
    const fullName = `${member.name} ${member.prefix} ${member.surname}`
    const githubHandle = getGithubHandle(member.githubHandle)
    const squad = await getSquad(member.squadId)
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
    playlistEl.addEventListener('click', ()=>{
      navigate(member.memberId)
    })
    playlistEl.appendChild(song)
  })
}

function navigate(memberId) {
  window.location = `detail.html?id=${memberId}`
}

async function getSquad(squadId) {
  const req = await fetch('https://tribe.api.fdnd.nl/v1/squad')
  const res = await req.json()
  return res.data.find(squad => squad.squadId == squadId).name
}

function getGithubHandle(handle) {
  if(handle === '') handle = 'FDND'
  return `@${handle.replace(/https:\/\/github\.com\//gm, '')}`
}
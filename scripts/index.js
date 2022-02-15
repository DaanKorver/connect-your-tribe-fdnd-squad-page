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
  members.forEach((index, member)=>{
    const song = songEl.content.cloneNode(true)
    const td = song.querySelectorAll('td')
    const memberData = ['name', 'squadId', 'githubHandle', 'url'].map(key => member[key])
    for (let i = 0; i < td.length; i++) {
      if(i === 0) td[i].innerText = index
      else td[i].innerText = memberData[i]
      
    }
    playlistEl.appendChild(song)
  })
}
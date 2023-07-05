





export function isAdmin()
{
  const isUserLoggedIn = () => !!(localStorage.getItem('userData') && localStorage.getItem('accessToken'))
    
  if (!isUserLoggedIn()) return false
    
  const abilities = JSON.parse(localStorage.getItem('userAbilities'))
  
  return !(!Array.from(new Set(abilities.map(a => a.subject)))
    .find(subject => subject.toLowerCase() == 'all' || subject.toLowerCase() == 'admin'))
}


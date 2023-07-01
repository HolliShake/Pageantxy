
export function resolveRoles(roleString)
{
  let roles = parseRole(roleString)
  let roleNames = Array.from(new Set(roles.map(r => r.subject)))
    
  return roleNames.map(r => (r == 'all') ? 'admin' : r)
}

function parseRole(roleString)
{
  return JSON.parse(roleString)
}


export default parseRole

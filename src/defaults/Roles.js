

export default Object.freeze({
  Admin: JSON.stringify([{ "subject": "Auth", action: "read" }, { "subject": "Admin", "action": "manage" }]),
  Judge: JSON.stringify([{ "subject": "Auth", action: "read" }, { "subject": "Judge", "action": "edit" }, { "subject": "Judge", "action": "read" }]),
})

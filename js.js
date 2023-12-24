let db = null
let userName = document.querySelector(".userName")
let pass = document.querySelector(".password")
let email = document.querySelector(".email")
let submit = document.querySelector("form")
let table = document.querySelector(".table")

let sitedb = indexedDB.open("sitedb", 2)
sitedb.addEventListener("upgradeneeded", event => {
    db = event.target.result
    if (!db.objectStoreNames.contains("member")) {
        db.createObjectStore("member", {keyPath: "userId"})
    }
})
sitedb.addEventListener("success", event => {
    db = event.target.result
    tableVal()
})
submit.addEventListener("submit", event => {
    event.preventDefault()
    let users = {
        userId:Math.floor(Math.random() * 1000),
        name:userName.value,
        pass:pass.value,
        email:email.value,
    }
    let store = useTx("member", "readwrite")
    store.add(users)
    tableVal()
    clearInputs()
})

function clearInputs() {
    userName.value = ""
    pass.value = ""
    email.value = ""
}
function useTx (storeName, mode="readonly") {
    let tx = db.transaction(storeName, mode)
    let store = tx.objectStore("member")
    return store
}
function tableVal() {
    let request = useTx("member").getAll()
    let result = null
    request.addEventListener("success", event => {
        let users = event.target.result
        table.innerHTML = `
        <tr>
        <th>user Id</th>
        <th>User Name</th>
        <th>Password</th>
        <th>Email</th>
        </tr>`
        
        table.innerHTML += users.map(user => {
            return `
            <tr>
            <td>${user.userId}</td>
            <td>${user.name}</td>
            <td>${user.pass}</td>
            <td>${user.email}</td>
            </tr>
            `
        }).join("")
    })
}


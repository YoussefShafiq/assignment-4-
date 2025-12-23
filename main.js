const fs = require('fs');
const path = require('path')
const express = require('express')

const filePath = path.resolve('./users.json')
let users = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }))

const saveToFile = () => {
    fs.writeFileSync(filePath, JSON.stringify(users))
}

const app = express()

let port = 3000
app.use(express.json())

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is up and running" })
})

app.post('/user', (req, res) => {
    if (!req.body) {
        res.status(400).json({
            success: false,
            message: "request body is required"
        })
        return
    }
    const { name, age, email } = req.body
    const id = users[users.length - 1]?.id + 1 || 1

    if (!name || !age || !email) {
        res.status(400).json({
            success: false,
            message: "All fields are required"
        })
        return;
    }

    const userExist = users.find((u) => {
        return u.email === email
    })

    if (userExist) {
        res.status(409).json({
            success: false,
            message: "user already exists"
        })
        return;
    }

    users.push({ id, name, email, age })
    saveToFile()

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: { id, name, email, age }
    })
    return;
})

app.get('/user', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    })
    return
})

app.get('/user/get-by-name', (req, res) => {
    const {name} = req.query;
    
    if(!name){
        res.status(400).json({
            success: false,
            message: "name query param is required"
        })
        return
    }
    const user = users.find(u => {
        return u.name == name
    })

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        })
        return
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user
    })
    return
})

app.get('/user/filter', (req, res) => {
    const {minAge} = req.query;
    
    if(!minAge){
        res.status(400).json({
            success: false,
            message: "minAge query param is required"
        })
        return
    }
    const filteredUsers = users.filter(u => {
        return u.age >= minAge
    })    

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: filteredUsers
    })
    return
})

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(u => {
        return u.id == id
    })

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        })
        return
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user
    })
    return
})

app.delete('/user{/:id}', (req, res) => {
    const id = req.params.id || req.body?.id;

    if (!id) {
        res.status(400).json({
            success: false,
            message: "id is required"
        })
        return
    }

    const userIndex = users.findIndex(u => {
        return u.id == id
    })

    if (userIndex === -1) {
        res.status(404).json({
            success: false,
            message: "user not found"
        })
        return
    }

    users.splice(userIndex, 1)
    saveToFile()
    res.status(200).json({
        success: true,
        message: "user deleted successfully"
    })
    return
})

app.patch('/user/:id', (req, res) => {
    const id = req.params.id;
    if (!req.body) {
        res.status(400).json({
            success: false,
            message: "request body is required"
        })
        return
    }
    const { name, email, age } = req.body;


    const user = users.find(u => {
        return u.id == id
    })

    if (!user) {
        res.status(404).json({
            success: false,
            message: "user not found"
        })
        return
    }

    if (!name && !age && !email) {
        res.status(400).json({
            success: false,
            message: "at least one field is required to update"
        })
        return
    }

    name && (user.name = name)
    age && (user.age = age)
    email && (user.email = email)

    saveToFile()
    res.status(200).json({
        success: true,
        message: "user updated successfully",
        data: user
    })
    return
})

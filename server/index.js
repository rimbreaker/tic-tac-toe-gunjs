const express=require('express')
const Gun=require('gun')
const app = express()
const PORT = 3030
app.use(Gun.serve)

const server = app.listen(PORT,()=>{
    console.log(`Example app listeninig at localhost://${PORT}`)
})

Gun({web:server})

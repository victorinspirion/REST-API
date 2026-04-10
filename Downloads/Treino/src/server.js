import 'dotenv/config'
import { authToken , gerarToken, validateCookie} from './middleware.js'
import {loginDatabase, insertDatabase, updateDatabase, selectProducts, selectDatabase} from './database.js'
import app from './app.js'    
import { __filename, __dirname } from './app.js'

    let users = []

    app.get('/home', (req,res)=>
        res.sendFile(`${__dirname}/public/main/home.html`))

    app.get('/produtos',(req,res)=> 
        res.sendFile(`${__dirname}/public/main/main.html`))


    app.get('/sign-up',(req,res)=>
        res.sendFile(`${__dirname}/public/sign-up/signup.html`)
    )

    app.get('/login', async (req, res) =>{
        res.sendFile(`${__dirname}/public/login/login.html`)
    })
    app.get('/produtos/:id',(req,res)=> {
        res.sendFile(`${__dirname}/public/product/product.html`)
    })

    app.get('/api/produtos/:id',async (req,res)=>{
    const id = req.params.id
    const response = await selectDatabase(id)
    console.log(selectDatabase(id))
    res.json({
            "id": response.id,
            "nome": response.nome,
            "imagem_url": response.imagem_url,
            "descricao": response.descricao, 
            "estoque": response.estoque,
            "preco": response.preco})
    })
    
    app.get('/produtos/list',async (req,response)=>{
        const rows = await selectProducts()
        response.json({"message": rows})
    })


    app.post('/sign-up', async (req, res) => {
        const {nome,email,idade,senha} = req.body

        const newUser = {
            nome,
            email,
            idade,
            senha
        }

        await insertDatabase(nome,email,idade,senha)
        const token = gerarToken(newUser)
        validateCookie(req,res,token)
        res.json({"message":"Usuário criado com sucesso!"})
    })

    app.post('/login', async (req,res)=>{
    
        const email = req.body.email
        const senha = req.body.senha

        const user = {
            email,
            senha
        }

        const response = await loginDatabase(user.email)

        if(response.length >= 1){
            if(senha != response[0].senha)
                res.json({"message": "Senha Inválida!", "success": "false"})
            else{
                const userDb = response[0]
                const token = gerarToken({id:userDb.id, nome: userDb.nome})
                validateCookie(req,res,token)
                res.status(200).json({"success":true})
            }
        }
        else{
            return res.status(401).json({"success":"false"});}
    })

    app.put('/users/:id',async (req,res)=> {
        const Id = parseInt(req.params.id)               
        const {nome} = req.body

        updateDatabase(nome ,Id)
    
        res.status(200).send("Sucesso!")
    })


    app.delete('/users/:id', async (req,res)=>{
        const Id = req.params.id
        let index 
        if(index == -1){
            return res.status(400).send("Id Inválido!")
}
        users.splice(index)
        res.status(201).send("Deletado com sucesso!")})


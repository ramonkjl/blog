const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render("admin/index");
});

router.get('/posts', (req, res)=>{
    res.send("<h1>Página de listagem dos posts</h1>");
});

router.get('/categorias', (req, res)=>{
    res.send("<h1>Página de Categorias</h1>");
});

module.exports = router;
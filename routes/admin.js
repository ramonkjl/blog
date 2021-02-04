const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model("Categoria");

router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/posts', (req, res) => {

});

router.get('/categorias', (req, res) => {
    res.render("admin/categorias");
});

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias");
})

//Rota de post
//Aqui uso uma async
router.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug,
    }

    async function salvar() {
        await new Categoria(novaCategoria).save()
            .then(() => console.log("Categoria Salva com Sucesso"))
            .catch((err) => console.log("erro ao registrar categoria"))
    }

    salvar();
    res.render('admin/categorias');

})
module.exports = router
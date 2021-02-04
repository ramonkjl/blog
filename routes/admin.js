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

//ROTA DE POST
router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias});
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao tentar listar as categorias");
        res.redirect('/admin');
    })
});

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias");
})


//ROTA DE PU
router.get('/categorias/edit/:id', (req, res)=>{
    //const id = req.params.id
    Categoria.findOne({_id: req.params.id}).lean()
    .then((categoria)=>{ 
        res.render("admin/editcategoria", {categoria: categoria})
    })
    .catch((err)=>{
        req.flash("error_msg", "Essa categoria não existe")
        res.redirect("/admin/categorias")
    })
})

//Rota de post
//Aqui uso uma async
router.post('/categorias/nova', (req, res) => {
    var erros = []
    //validaddo fomulario
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    }
    //Fim da validação

    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros })
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug,
        }

        async function salvar() {
            await new Categoria(novaCategoria).save()
                .then(() => {
                    req.flash("success_msg", "Categoria criada com sucesso!"),
                        res.redirect('/admin/categorias')
                })
                .catch((err) => {
                    req.flash("error_msg", "Houve um erro ao tentar salvar a categoria")
                    console.log("erro ao registrar categoria")
                })
        }
        salvar();
    }



})
module.exports = router
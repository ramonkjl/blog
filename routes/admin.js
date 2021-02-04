const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model("Categoria");
require('../models/Postagem');
const Postagem = mongoose.model("Postagem");

router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/posts', (req, res) => {

});
//===ROTAS DAS CATEGORIAS==========
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


//ROTA DE PUT
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

//SALVANDO EDIÇÃO
router.post('/categorias/edit', (req, res)=>{

    Categoria.where({_id: req.body.id}).updateOne({nome: req.body.nome, slug: req.body.slug}).then(()=>{
        req.flash("success_msg", "Atualizado com Sucesso")
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash("error_msg", "falha ao tentar atualização")
        res.redirect('/admin/categorias', err)
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

//Delete
router.post('/categoria/deletar', (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada")
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash("error_msg", "Falha ao tentar deletar")
        res.redirect('/admin/categorias')
    })
})

//===FIM DAS ROTAS DAS CATEGORIAS==========

//===ROTAS DAS POSTAGENS==================
//"GET"
router.get('/postagens', (req, res)=>{
    Postagem.find().lean().populate("categoria").sort({data: 'desc'}).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect('/admin');
    })  
})

//POST
router.get('/postagem/add', (req, res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar formulário")
        res.redirect('/admin/postagens')
    })
})

router.post('/postagem/nova', (req, res)=>{
    const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }
    
    new Postagem(novaPostagem).save().then(()=>{
        req.flash("success_msg", "Postagem Feita!")
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro")
        res.redirect('/admin/postagens')
    })
})

//PUT
router.get('/postagem/edit/:id', (req, res)=>{
    Postagem.findOne({_id: req.params.id}).lean()
    .then((postagens)=>{
        Categoria.find().lean()
            .then((categorias)=>{
                res.render('admin/editpostagem', {postagens: postagens, categorias: categorias})

            }).catch((err)=>{
                req.flash("error_msg", "Falha ao carregar")
                res.redirect('/admin/postagens')
            })
    })
    .catch((err)=>{
        req.flash("error_msg", 'Falha ao carregar formulário')
        res.redirect('admin/postagens')
    })
})

router.post('/postagem/edit', (req, res)=>{
    Postagem.where({_id: req.body.id})
        .updateOne({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
    }).then(()=>{
        req.flash('success_msg', 'Edição feita!')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg', 'Falha na edição')
        res.redirect('/admin/postagens')
    })
})
module.exports = router
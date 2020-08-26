const router  = require("express").Router()
const custom = require("../functions/custom")
const Doc = require("../models/doc")
const Week = require("../models/week")

router.get("/", (req, res) => Doc.find({}, function(err, allDocs){
    if(err){
        console.log(err)
    } else {
        Week.find({status: "open"}, function(err, allWeeks){
            if(err){
                console.log(err)
            } else {
                const sorted = allWeeks.sort(custom.sortByEnd)
                const data = custom.getNDays(sorted, 5)
                res.render("docs/index",{
                    doc : JSON.stringify(allDocs),
                    data: JSON.stringify(data)
                })
            }
        })
    }
}))

router.get("/:id", function(req, res){
    Doc.findById(req.params.id).populate("comments").exec(function(err, foundDoc){
        if(err){
            console.log(err);
        } else {
            Week.find({}, function(err, allWeeks){
                if(err){
                    console.log(err)
                } else {
                    const sorted = allWeeks.sort(custom.sortByEnd)
                    const data = custom.getNDays(sorted, 365)
                    res.render("docs/show", {
                        doc: foundDoc, 
                        data: data,
                        dataStringified: JSON.stringify(data),
                    }); 
                }
            })
        }
    })
})

// ====================
// New Doc
// ====================

router.post("/", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newDoc = {name: name, image: image, description: desc}
    doc.create(newDoc, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/docs");
        }
    })
})

router.get("/docs/new", (req, res) => res.render("docs/new"))


// ====================
// COMMENTS ROUTES
// ====================

router.get("/:id/comments/new", function(req, res){
    Doc.findById(req.params.id, function(err, doc){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {doc: doc})
        }
    })
})

router.post("/:id/comments", function(req, res){
   Doc.findById(req.params.id, function(err, doc){
       if(err){
           console.log(err)
           res.redirect("/docs")
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err)
           } else {
               doc.comments.push(comment)
               doc.save();
               res.redirect('/docs/' + doc._id)
           }
        })
       }
   })
})


module.exports = router
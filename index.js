const cheerio = require('cheerio')
const request = require('request')
// const url = 'https://cat-translator.com/manga/manga/heavenly-god-mnemonic/'
const fs = require('fs')
var express = require("express");
var router = express.Router();
var Nt = require("./ntmodel");

function getlastep(url,selector) {
  return new Promise((resolve,reject)=>{

    request.get(url, (e, r, b) => {
      let $ = cheerio.load(b)
      fs.writeFileSync('test.html', $(selector).text())
      const data = fs.readFileSync('test.html', { encoding: "utf8" })
      const ep = data.match(/\d/g).join('');
      let sub;
      if (ep.length < 9) {
        sub = ep.substr(0, 1)
      }
      else if (ep.length < 187) {
        sub = ep.substr(0, 2)
      }
      else {
        sub = ep.substr(0, 3)
      }
      return resolve(sub);
    })
  })
  
  
 

}

//--------------------------------------- db mongo


// GET all
router.get("/",  (req, res) => {
  Nt.find().exec( async(err, data) => {
    let result = data.map( async (item, index) => {
    let lastep = await getlastep(item.link,item.topicselector);
    return { name: item.name, episode: item.episode, lastepisode: lastep, link: item.link, topicselector: item.topicselector, id: item._id }
      
    })
    let load  = await Promise.all(result);
    if (err) return res.status(400).send(err);
    res.status(200).json(load);



  });
});

// GET 1
router.get("/:_id", (req, res) => {
  Nt.findById(req.params._id).exec((err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).json(data);
  });
});

// POST (create new data)
router.post("/", async (req, res) => {
  console.log(req.body.topicselector);

  let loadep = await getlastep(req.body.linkweb,req.body.topicselector);
  var obj = new Nt({ name: req.body.name, episode: loadep, link: req.body.linkweb, topicselector: req.body.topicselector });
  obj.save((err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({messege:"เพิ่มข้อมูลเรียบร้อย"});
  });
});

// PUT (update current data)
router.put("/:_id", async (req, res) => {

  const data = await Nt.findById(req.params._id)
  let lastep = await getlastep(data.link,data.topicselector);
  const result = await Nt.findByIdAndUpdate(req.params._id, { name: data.name, episode: lastep })
  return res.status(200).json({messege:"อัพเดทข้อมูลเรียบร้อย"});

});


// DELETE (delete 1 data)
router.delete("/:_id", (req, res) => {
  Nt.findByIdAndDelete(req.params._id, (err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).send("ลบข้อมูลเรียบร้อย");
  });
});
module.exports = router;

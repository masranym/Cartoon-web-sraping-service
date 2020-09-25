// ntmodel.js

var mongoose = require("mongoose");

var ntSchema = mongoose.Schema(
  {
    // กำหนด ชื่อและชนิดของ document เรา
    name: {
      type: String
    },
    episode: {
      type: Number
    },
    link:{
      type: String
    },
    topicselector:{
      type: String
    }
  },
  {
    // กำหนด collection ของ MongoDB หรือจะไม่กำหนดก็ได้
    collection: "CARTOON"
  }
);

// ถ้าไม่ได้กำหนด collection ข้างบน default จะเป็น "cartoon"
var Nt = mongoose.model("cartoon", ntSchema);
module.exports = Nt;
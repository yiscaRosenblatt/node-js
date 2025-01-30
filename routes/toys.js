const express = require("express");
const { ToyModel, validToy } = require("../models/toysModel");
const { authToken } = require("../auth/authToken")
const router = express.Router();



router.get("/", async (req, res) => {
  try {
    let skip = Number(req.query.skip) || 0;
    let data = await ToyModel.find({})
      .limit(10)
      .skip(skip * 10);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
    try {
      let searchQuery = req.query.s || "";
      let skip = Number(req.query.skip) || 0;

      let data = await ToyModel.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } }, 
          { info: { $regex: searchQuery, $options: "i" } }
        ]
      })
      .limit(10)
      .skip(skip * 10);

      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.get("/category/:catname", async (req, res) => {
  try {
    let category = req.params.catname;
    let skip = Number(req.query.skip) || 0;

    let data = await ToyModel.find({ category: category })
      .limit(10)
      .skip(skip * 10);

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});









router.post("/", authToken, async (req, res) => {
  let valiBody = validToy(req.body);
  if (valiBody.error) {
    return res.status(400).json(valiBody.error.details);
  }

  try {
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }


})




router.put("/:id", authToken, async (req, res) => {
  let valiBody = validToy(req.body);
  if (valiBody.error) {
    return res.status(400).json(valiBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToyModel.updateOne({ _id: id });
    }
    else {
      data = await ToyModel.updateOne({ _id: id, user_id: req.tokenData._id });
    }
    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
})



router.delete("/:id", authToken, async (req, res) => {
  try {
    let id = req.params.id;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToyModel.deleteOne({ _id: id });
    }
    else {
      data = await ToyModel.deleteOne({ _id: id, user_id: req.tokenData._id });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
})




router.get("/prices", async (req, res) => {
  try {
    let { min, max, skip = 0 } = req.query;
    let filter = {};

    if (min) filter.price = { $gte: Number(min) };
    if (max) filter.price = { ...filter.price, $lte: Number(max) };

    let toys = await ToyModel.find(filter)
      .limit(10)
      .skip(Number(skip) * 10);

    res.json(toys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/single/:id", async (req, res) => {
  try {
      let toy = await ToyModel.findById(req.params.id);
      if (!toy) return res.status(404).json({ msg: "Toy not found" });
      res.json(toy);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});




router.get("/count", async (req, res) => {
  try {
      let count = await ToyModel.countDocuments();
      res.json({ count });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



module.exports = router;
const { find, findOne } = require('../model/Home')

const express = require('express'),
    rest = express.Router(),
    Home = require('../model/Home'),
    { homeValidation } = require('../validator/Home_valid')
    

var myhome = [
    {
        id: 0,
        name: "chayanon",
        tel: "0954321078",
        description: "คำอธิบาย",
        latitude: 56,
        longitude: 23,
        price: 5000, //บาท
        area: 100, //หน่วยตารางเมตร
        type: "sale", // sale/rent
        category: "condo", // condo/house
        province: "ภูเก็ต"
    },
    {
        id: 1,
        name: "chayanon",
        tel: "0954321078",
        description: "คำอธิบาย",
        latitude: 56,
        province: "สงขลา",
        longitude: 23,
        price: 5000, //บาท
        area: 100, //หน่วยตารางเมตร
        type: "sale", // sale/rent
        category: "condo" // condo/house
    },
    {
        id: 2,
        name: "chayanon",
        province: "กรุงเทพ",
        tel: "0954321078",
        description: "คำอธิบาย",
        latitude: 56,
        longitude: 23,
        price: 5000, //บาท
        area: 100, //หน่วยตารางเมตร
        type: "sale", // sale/rent
        category: "house" // condo/house
    },
    {
        id: 3,
        name: "chayanon",
        province: "ภูเก็ต",
        tel: "0954321078",
        description: "คำอธิบาย",
        latitude: 56,
        longitude: 23,
        price: 5000, //บาท
        area: 100, //หน่วยตารางเมตร
        type: "sale", // sale/rent
        category: "condo" // condo/house
    },
    {
        id: 4,
        name: "chayanon",
        province: "ภูเก็ต",
        tel: "0954321078",
        description: "คำอธิบาย",
        latitude: 6.991273,
        longitude: 100.484478,
        price: 5000, //บาท
        area: 100, //หน่วยตารางเมตร
        type: "sale", // sale/rent
        category: "condo" // condo/house
    },
    {
        id: 5,
        name: "chayanon",
        province: "สงขลา",
        tel: "0954321078",
        description: "คำอธิบาย",
        latitude: 6.990543,
        longitude: 100.489983,
        price: 5000, //บาท
        area: 100, //หน่วยตารางเมตร
        type: "sale", // sale/rent
        category: "condo" // condo/house
    },
    {
        id: 6,
        name: "chayanon",
        province: "สงขลา",
        tel: "0954321078",
        description: "คำอธิบาย",
        latitude: 6.998233,
        longitude: 100.479395,
        price: 5000, //บาท
        area: 100, //หน่วยตารางเมตร
        type: "sale", // sale/rent
        category: "condo" // condo/house
    }
]

rest.route('/')
    .get((req, res) => {
        res.send("1234")
    })

rest.route('/home')
    .get(async (req, res) => {
        // res.json(myhome)
        const newhome = await Home.find(this.all)
        // const test = [...newhome]
        try {
            if (newhome) {
                // console.log(newhome[0].name);
                res.send(newhome)
            }
        } catch (err) {
            res.send(err)
            console.log(err);
        }

    })
    .post(async (req, res) => {

        console.log(req.body);
        

        const newhome = await Home.find(this.all)
        const { error } = homeValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const id = newhome.length

        const home = new Home({
            id: id > 0 ? newhome[id - 1].id + 1 : +id,
            name: req.body.name,
            des: req.body.des,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            price: req.body.price,
            area: req.body.area,
            type: req.body.type,
            category: req.body.category,
            tel: req.body.tel,
            province: req.body.province
        })
        try {
            const savedHome = await home.save()
            res.send(savedHome)
        } catch (err) {
            res.status(400).send(err)
        }

        // var keephome = {}
        // console.log(req.body);

        // keephome.id = myhome.length > 0 ? myhome[myhome.length - 1].id + 1 : 0
        // keephome.name = req.body.name
        // keephome.des = req.body.des
        // keephome.latitude = req.body.latitude
        // keephome.longitude = req.body.longitude
        // keephome.price = req.body.price
        // keephome.area = req.body.area
        // keephome.type = req.body.type
        // keephome.category = req.body.category
        // keephome.tel = req.body.tel
        // myhome.push(keephome)

        res.json({ message: "add ok" })
    })

rest.route('/edit/:id')
    .delete(async (req, res) => {
        // var index = myhome.findIndex(p => +p.id === +req.params.id)
        // myhome.splice(index, 1)
        // res.json({ message: "delete" })


        const index = await Home.findOneAndDelete({ id: +req.params.id })
        console.log(index);

        if (!index) {
            res.status(400).json({ delete: 'id already delete' })
        }
        else {
            res.status(400).json({ delete: true })
        }
        // const thisHome = await User.findOne({  })
        // res.send(thisHome)
    })
    .put(async (req, res) => {
        // console.log(req.body);

        // var index = myhome.findIndex(p => +p.id === +req.params.id)
        // myhome[index].name = req.body.name
        // myhome[index].des = req.body.des
        // myhome[index].latitude = req.body.latitude
        // myhome[index].longitude = req.body.longitude
        // myhome[index].price = req.body.price
        // myhome[index].area = req.body.area
        // myhome[index].type = req.body.type
        // myhome[index].category = req.body.category
        // myhome[index].tel = req.body.tel
        // res.json({ message: "update" })

        const lo = await Home.updateOne({ id: 0 }, {
            $set: req.body
        }, (error, results) => {
            res.status(400).json({ update: true })

        })

    })
module.exports = rest
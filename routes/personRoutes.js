const express = require("express");
const router = express.Router();
const Person = require("../models/Person");
const { jwtAuthMiddleware, generateToken } = require("../jwt");




// Profile router
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;  // here this req."user" is from jwtAuthMiddleware req."user" = decoded
        console.log(userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});


router.get("/", jwtAuthMiddleware, async (req, res) => {
    try {
        const person = await Person.find();
        if(person){
            res.status(200).json({
                message: "Data fetched successfully",
                success: true,
                data: person
            });
        }
        else{
            res.status(500).json({
                message: "Error fetching person",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});


router.post("/signup", async (req, res) => {
    try {
        const data = req.body;
    
        // create a new person 
        const newPerson = new Person(data);
    
        // save the new person to database
        await newPerson.save();

        const payload = {
            id: newPerson.id,
            username: newPerson.username,
            email: newPerson.email
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is: ", token)
    
        if(newPerson){
            res.status(201).json({
                message: "Data saved successfully",
                success: true,
                data: newPerson,
                token: token
            });
        }
        else{
            res.status(500).json({
                message: "Error saving person",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }


    // newPerson.save((err, savedPerson) => {
    //     if(err){
    //         console.log("Error saving person: ", err);
    //         res.status(500).json({err: "Internal server error"});
    //     }
    //     else{
    //         console.log("data saved successfully");
    //         res.status(201).json(savedPerson);
    //     }
    // });

    // newPerson.name = data.name;
    // newPerson.age = data.age;
    // newPerson.work = data.work;
    // newPerson.mobile = data.mobile;
    // newPerson.email = data.email;
    // newPerson.address = data.address;
});


router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Person.findOne({ username: username });

        if(!user || !(await user.comparePassword(password))) {
            res.status(401).json({
                message: "User doesn't exists in our database!! Please register first",
                success: false
            });
        }

        // generate token
        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload);

        return res.status(202).json({
            message: "User logged in successfully",
            success: true,
            data: user,
            token: token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});


router.get("/:work", async (req, res) => {
    try {
        const workType = req.params.work;   // /:work (this /:work is not from schema)  or we can give any name like workAs then we have to write req.params.workAs
        if(workType === "chef" || workType === "manager" || workType === "waiter"){
            const workData = await Person.find({work: workType});   // here [work] is from person schema 
            console.log(workData);
            res.status(200).json({
                message: "Data fetched successfully..",
                success: true,
                data: workData
            });
        }
        else{
            res.status(404).json({
                message: "Invalid work type",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const workId = req.params.id;
        const data = req.body;
        const updatedPerson = await Person.findByIdAndUpdate(workId, data, { new: true, runValidators: true });
        if(updatedPerson){
            res.status(202).json({
                message: "Person updated successfully",
                success: true,
                data: updatedPerson
            });
        }
        else{
            res.status(404).json({
                message: "Failed to update person details",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const workId = req.params.id;
        const deletedPerson = await Person.findByIdAndDelete(workId);
        if(deletedPerson){
            res.status(202).json({
                message: "Person deleted successfully",
                success: true,
                data: deletedPerson
            });
        }
        else{
            res.status(404).json({
                message: "Failed to delete person details",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});



module.exports = router;
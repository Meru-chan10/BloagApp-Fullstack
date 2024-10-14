// Dependencies
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors")

// Environment Setup
require('dotenv').config()

// Routes Middleware
const blogRoutes = require("./routes/blogs");
const userRoutes = require("./routes/user");

// Server Setup
const app = express();
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true, parameterLimit:50000}));

const corsOptions ={
    origin:['http://localhost:4000', 'http://localhost:3000'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))


// Database Connection Setup

mongoose.connect(process.env.MONGODB_STRING, {
    useNewUrlParser:true,
	useUnifiedTopology:true
})

mongoose.connection.once('open', () => console.log('Now Connected to MongoDB Atlas'))

app.use("/blogs", blogRoutes);
app.use("/users", userRoutes)

app.use((err, req, res, next) => {
    if (err.status === 413) {
        return res.status(413).json({ message: 'Payload too large' });
    }
    next(err);
});

// Server gateway Response
if(require.main === module){
	app.listen(process.env.PORT || 3000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 3000 }`)
	});
}

module.exports = {app,mongoose};
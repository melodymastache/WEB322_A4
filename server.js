/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Melody Mastache Student ID: 126275189 Date: March 8th, 2019
*
* Online (Heroku) Link: https://young-sands-87495.herokuapp.com/
*
********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const info = require("./data-service.js");
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require("multer");
const nope = "unable to read file";
const exphbs = require("express-handlebars");

// multer for images
const storage = multer.diskStorage
    ({
        destination: "./public/images/uploaded",
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
const upload = multer({ storage: storage });

// for css and imgs
app.use(express.static('public'));
app.use(express.static('./public/images/uploaded'));
app.use(express.static('img'));
// middleware for body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app start
function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

info.initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart());
    })
    .catch(() => {
        console.log("Unable to call server");
    })
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
const hbs = exphbs.create({
    defaultLayout: 'main.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});
app.engine('.hbs', hbs.engine);
app.set("view engine", ".hbs");

// route for home.hbs, also is default path
app.get("/", (req, res) => {
    res.render('home');
});

// route for about.html
app.get("/about", (req, res) => {
    res.render('about');
});

// route for departments.json
app.get("/departments", (req, res) => {
    info.getDepartments()
        .then((data) => {
            res.render('departments', { departments: data })
        })
        .catch((err) => {
            message: nope
        })
});

// route for employees view
app.get("/employees/add", (req, res) => {
    res.render('addEmployee');
});

// route for adding employees
app.post("/employees/add", (req, res) => {
    info.addEmployee(req.body)
        .then((data) => {
            res.redirect("/employees");
        })
        .catch((err) => {
            message: nope
        });
});

// route for images view
app.get("/images/add", (req, res) => {
    res.render('addImage');
});

// route for image middleware
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

// route for uploaded images array
app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, images) {
        res.render('images', { images });
    })
});

// route for employees.json
app.get("/employees", (req, res) => {
    if (req.query.status) {
        // employee query for status
        info.getEmployeesByStatus(req.query.status)
            .then((data) => {
                res.render('employees', { employees: data })
            })
            .catch((err) => {
                message: nope
            })
    }
    else if (req.query.deparment) {
        info.getEmployeesByDepartment(req.query.department)
            .then((data) => {
                res.render('employees', { employees: data })
            })
            .catch((err) => {
                message: nope
            });
    }
    else if (req.query.manager) {
        // route for returning name when value = manager number
        info.getEmployeesByManager(req.query.manager)
            .then((data) => {
                res.render('employees', { employees: data })
            })
            .catch((err) => {
                message: nope
            });
    }
    else {
        info.getAllEmployees()
            .then((data) => {
                res.render('employees', { employees: data })
            })
            .catch((err) => {
                message: nope
            });
    }
});

// route for returning name when value = employee number
app.get("/employee/:value", (req, res) => {
    info.getEmployeesByNum(req.params.value)
        .then((data) => {
            res.render('employee', { employees: data[0] })
        })
        .catch((err) => {
            res.render('employee', { message: 'no results' })
        });
});

app.post("/employee/update", (req, res) => {
    info.updateEmployee(req.body)
        .then((data) => {
            res.redirect("/employees")
        })
        .catch((err) => {
            message: nope
        })
});

// error route must always be LAST
app.use((req, res) => {
    res.status(404).sendFile(path.join(__filename, "../public/oh-no-1.jpg"));
});

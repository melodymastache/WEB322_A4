const Sequelize = require('sequelize');
// TO DO: Create new database and connect to that one instead.
var sequelize = new Sequelize('d38m999qv8ds7f', 'blpukoropsahyc', '4b008739258eb7c856bcd5aeefb0a18293e63f3afb3457b35c08ca09ef153adf',
  {
    host: 'ec2-23-23-241-119.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: true
    }
  });

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

var Employee = sequelize.define('Employee', {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hiredate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

module.exports.initialize = () => new Promise((resolve, reject) => {
  sequelize.sync()
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject('Unable to sync database.');
      console.log(err);
    })
})

///////////////// GETTER FUNCTIONS ///////////////////

module.exports.getEmployeeByNum = function (num) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: { employeeNum: num }
    })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("No results returned.");
        console.log(err);
      });
  });
}

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      order: ['employeeNum']
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned");
        console.log(err);
      });
  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        status: status
      }
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned");
        console.log(err);
      });
  });
};

module.exports.getEmployeesByDepartment = function (dept) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        department: dept
      }
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned");
        console.log(err);
      });
  });
};

module.exports.getEmployeesByManager = function (manager) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        employeeManagerNum: manager
      }
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned");
        console.log(err);
      });
  });
};

module.exports.getEmployeesByNum = function (num) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        employeeNum: num
      }
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned");
        console.log(err);
      });
  });
};

module.exports.getAllManagers = function () {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        isManager: true
      }
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned");
        console.log(err);
      });
  });
};

module.exports.getAllDepartments = function () {
  return new Promise((resolve, reject) => {
    Department.findAll({
      order: ["departmentId"]
    })
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned");
        console.log(err);
      });
  });
};

module.exports.getDepartmentById = function (id) {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where: { departmentId: id }
    })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("No results returned.");
        console.log(err);
      });
  });
}

/////////////// ADD FUNCTIONS ////////////////

module.exports.addEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    Employee.create({
      firstName: employeeData.firstName,
      last_name: employeeData.last_name,
      email: employeeData.email,
      SSN: employeeData.SSN,
      addressStreet: employeeData.addressStreet,
      addresCity: employeeData.addresCity,
      addressState: employeeData.addressState,
      addressPostal: employeeData.addressPostal,
      maritalStatus: employeeData.maritalStatus,
      isManager: employeeData.isManager,
      employeeManagerNum: employeeData.employeeManagerNum,
      status: employeeData.status,
      department: employeeData.department,
      hireDate: employeeData.hireDate
    })
      .then(() => {
        console.log("Employee created.");
        resolve();
      })
      .catch((err) => {
        reject("Unable to create employee");
        console.log(err);
      });
  });
};

module.exports.addDepartment = function (departmentData) {
  return new Promise((resolve, reject) => {
    for (var i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    Department.create(departmentData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to create department.");
        console.log(err);
      });
  });
}

////////////// UPDATE FUNCTIONS /////////////////

module.exports.updateEmployee = (employeeData) => {
  employeeData.isManager = (employeeData.isManager) ? true : false;
  for (let i in employeeData) {
    if (employeeData[i] == "") {
      employeeData[i] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Employee.update({
      firstName: employeeData.firstName,
      last_name: employeeData.last_name,
      email: employeeData.email,
      SSN: employeeData.SSN,
      addressStreet: employeeData.addressStreet,
      addresCity: employeeData.addresCity,
      addressState: employeeData.addressState,
      addressPostal: employeeData.addressPostal,
      maritalStatus: employeeData.maritalStatus,
      isManager: employeeData.isManager,
      employeeManagerNum: employeeData.employeeManagerNum,
      status: employeeData.status,
      department: employeeData.department,
      hireDate: employeeData.hireDate
    }, {
      where: {
        employeeNum: employeeData.employeeNum
      }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to update employee.");
        console.log(err);
      });
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise((resolve, reject) => {
    for (var i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    Department.update(departmentData, {
      where: { departmentId: departmentData.departmentId }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to create department.");
        console.log(err);
      });
  });
}

///////////////// DELETE FUNCTION ///////////////////

module.exports.deleteEmployeeByNum = function (empNum) {
  return new Promise(function (resolve, reject) {
    Employee.destroy({
      where: { employeeNum: empNum }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to delete employee.");
        console.log(err);
      });
  });
}

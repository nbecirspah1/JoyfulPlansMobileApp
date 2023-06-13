const client = require('./connection.js')
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");

app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
})
client.connect();

app.get('/users', (req, res)=>{
    client.query(`Select * from users`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }else{
            res.send("GRESKA");
        }
    });
    client.end;
})

app.get('/users/:id', (req, res)=>{
    client.query(`Select * from users where id=${req.params.id}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post('/users', (req, res)=> {
    const user = req.body;
    let insertQuery = `insert into users(id, name, email, password) 
                       values(${user.id}, '${user.name}', '${user.email}', '${user.password}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.put('/users/:id', (req, res)=> {
    let user = req.body;
    let updateQuery = `update users
                       set name = '${user.name}',
                       email = '${user.email}',
                       password = '${user.password}'
                       where id = ${user.id}`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    const loginQuery = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  
    client.query(loginQuery, (err, result) => {
      if (!err) {
        if (result.rows.length > 0) {
          // Generisanje access tokena
          const user = result.rows[0];
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            "tajna_za_potpisivanje",
            { expiresIn: "1h" } // Token će isteći za 1 sat
          );
  
          // Sačuvaj access token u bazi podataka za datog korisnika
          const updateTokenQuery = `UPDATE users SET access_token = '${token}' WHERE id = ${user.id}`;
  
          client.query(updateTokenQuery, (err, result) => {
            if (!err) {
              // Remove the password field from the user object
              delete user.password;
              res.send({ user, token });
            } else {
              console.log(err.message);
              res.status(500).send("Error saving access token");
            }
          });
        } else {
          res.status(401).send("Invalid email or password");
        }
      } else {
        console.log(err.message);
        res.status(500).send("Error logging in");
      }
    });
  });
  
  app.post("/logout", (req, res) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      res.status(401).send("Unauthorized");
      return;
    }
  
    const token = authorizationHeader.replace("Bearer ", "");
  
    // Verify and decode the token
    jwt.verify(token, "tajna_za_potpisivanje", (err, decoded) => {
      if (err) {
        console.log(err.message);
        res.status(401).send("Invalid token");
        return;
      }
  
      const userId = decoded.userId;
  
      // Clear the access token for the user in the database
      const clearTokenQuery = `UPDATE users SET access_token = NULL WHERE id = ${userId}`;
  
      client.query(clearTokenQuery, (err, result) => {
        if (!err) {
          res.send("Logout successful");
        } else {
          console.log(err.message);
          res.status(500).send("Error logging out");
        }
      });
    });
  });
  
  
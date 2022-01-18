const express = require('express')
const path = require('path');
const sql = require('mssql');
const fs = require('fs');
var cors = require('cors');

const app = express()
app.use(cors());

const port = process.env.PORT || 1337;

var config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER, 
    database: process.env.SQL_DATABASE 
};
      
app.get('/', (req, res) => {

    if (!config.user || !config.password || !config.server || !config.database)
        res.send({message: 'Trūksta aplinkos parametrų'});

    sql.connect(config, function (err) {
        
        if (err) {
            res.send({
                message: 'Nepavyko prisijungti prie serverio',
                exception: err
            });
            return;
        }

        var request = new sql.Request();

        request.query('select TOP (1) Id, Name, Description, ImageUrl from Product.Products', function (err, recordset) {
            
            if (err) {
                res.send({
                    message: 'Nepavyko nuskaityti duomenų iš duomenų bazės',
                    exception: err
                });
                return;
            }

            if (recordset.rowsAffected < 1)
            {
                res.send({message: 'Trūksta duomenų'});
                return;
            }
                

            res.send({message: 'Viskas veikia!'});
        });   
    });   
})


app.get('/data', (req, res) => {

    sql.connect(config, function (err) {
        
        if (err) {
            console.log(err);
        }

        var request = new sql.Request();

        request.query(`SELECT 
                        Id AS id, 
                        Name AS name, 
                        Description AS description, 
                        ImageUrl AS imageUrl 
                       FROM Product.Products`, function (err, recordset) {
            
            if (err) {
                console.log(err)
            }

            res.send(recordset.recordset);
        });   
    });   
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


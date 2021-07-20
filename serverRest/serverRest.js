var express = require('express');
// CORS CONFIG
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}


const jwt = require('jwt-simple');
// Configuración para JWT
const secretKey = "miClaveSecreta"; // clave de cifrado del token
const algorithm = "HS256"; // algoritmo de cifrado del token
const expire = 24 * 60 * 60 * 1000; // Tiempo de expiración en milisegundos


// DB CONNECTION

var mysql = require("mysql");

var dbСonnection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tiendaonline",
    })
    // .on("error", (err) => {
    //     console.log("No se pudo contectarse a base de datos, error:  ", err);
    // });
    

    dbСonnection.connect(function(err){
        if(err) {
            console.log("No se pudo conectar a la BD",err)
            return;
        }
        console.log("base de datos conectada");


      
            var app = express();
            app.use("/", express.json({strict: false }));
            


            app.all("/", function(req, res, next) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With',);
            });

           
            app.use(cors())
          
// CATALOGO
                  app.get("/electrodomesticos",function(req,res) {
                dbСonnection.query("SELECT * FROM electrodomesticos",function (error,products) {
                    if (error) return res.status(500).send("Error al obtener productos");
                    res.status(200).json(products)
                    
                });
            });



            app.get("/electrodomesticos/:id",function(req,res) {
                var id = req.params.id;
                dbСonnection.query("SELECT * FROM electrodomesticos WHERE id = ?", [id], function (error, producto) {
                    if (error) return res.status(500).send("Error al obtener el producto");
                  //  if (producto.length == 0) return res.status(404).send("Producto no encontrado");
                    res.status(200).json(producto[0]);
                  });


            })




//LOGIN

app.post('/api/login', function (req, res) { // realiza el login. Si todo ok crea un nuevo token
    var email = req.body.email;
    var pass = req.body.pass;
    console.log("Login. User:", email, pass);
    var sqlQuery = "SELECT usu.id FROM usuario as usu WHERE usu.email = " + mysql.escape(email) +  " and usu.pass = " +  mysql.escape(pass)
    dbСonnection.query(sqlQuery, function(error, usuarioID){
        if (error) return res.status(500).send("Error obteniendo usuarios");
        console.log("ID DE USUSARIO: ",usuarioID)
       userId = usuarioID[0]; // este id se obtiene de una BD o de donde toque

        if (usuarioID.length == 0 ){
            return res.status(401).send("Error usuarios o contraseña");
        }

        console.log("Login ok. Id de usuario:", userId);
        var payload = { // payload del token
            iss: userId, // usuario
            exp: Date.now() + expire // Fecha de expiración del token en miliseg
        };
        console.log("JWT payload:", payload);

            // Codificar token
    var token = jwt.encode(payload, secretKey, algorithm);
    console.log("JWT token:", token);

    
    // Indicar el token en la cabecera HTTP: x-access-token
    res.setHeader("x-access-token", token);

     // Enviar el userId
     res.status(200).json(token);

    });

  
});

//BANCO
app.post('/api/banco/pagar', function (req, res) { 
   
    var cardHolder = req.body.cardHolder;
    var cardNum = req.body.cardNum;
    var dateExp = req.body.dateExp;
    var cvv = req.body.cvv;

    console.log("info bancaria: ", cardHolder,cardNum,dateExp,cvv);

    var sqlQuery = "SELECT b.id FROM banco as b WHERE b.cardHolder = " 
    + mysql.escape(cardHolder) +  " and b.cardNum = " +  mysql.escape(cardNum)
     +  " and b.dateExp = "  +  mysql.escape(dateExp)+  " and b.cvv = " +  mysql.escape(cvv)

    dbСonnection.query(sqlQuery, function(error, cuentaID){
        if (error) return res.status(500).send("Error al obtener cuenta");
        console.log("ID DE LA CUENTA: ",cuentaID)
       countID = cuentaID[0]; 

        if (cuentaID.length == 0 ){
            return res.status(401).send("La informacion bancaria proporcionada incorrecta ");
        }

        console.log("Cuenta ok. ID de cuenta:", countID);
        var payloadBn = { // payload del token
            iss: countID, // cuenta
            exp: Date.now() + expire // Fecha de expiración del token en miliseg
        };
        console.log("JWT payload:", payloadBn);

            // Codificar token
    var token2 = jwt.encode(payloadBn, secretKey, algorithm);
    console.log("JWT token:", token2);

    
    // Indicar el token en la cabecera HTTP: x-access-token
    res.setHeader("x-access-token", token2);

     // Enviar el userId
     res.status(200).json(token2);

    });

  
});




app.use("/api", function (req, res, next) { // comprobar un token valido
    var token = req.headers['x-access-token']; // obtener token de una cabecera HTTP
    if (!token) {
        res.status(403).json('Missing token'); // No hay token
        console.error("No se ha indicado token");
        return;
    }

    var token2 = req.headers['x-access-token']; // obtener token de una cabecera HTTP
        if (!token2) {
            res.status(403).json('Missing token'); // No hay token
            console.error("No se ha indicado token");
            return;
        }

    // Descodificamos el token para que nos devuelva el usuario y la fecha de expiración
    var payload = jwt.decode(token, secretKey, algorithm);
    if (!payload || !payload.iss || !payload.exp) {
        console.error("Token error");
        return res.status(403).json("Token error");
    }

    var payloadBn = jwt.decode(token2, secretKey, algorithm);
    if (!payloadBn || !payloadBn.iss || !payloadBn.exp) {
        console.error("Token error");
        return res.status(403).json("Token error");
    }

    // Comprobamos la fecha de expiración
    if (Date.now() > payload.exp) {
        console.error("Expired token");
        return res.status(403).json("Expired token");
    }

    // Añadimos el usuario a req para acceder posteriormente.
    req.user = payload.iss.id;
    req.count = payloadBn.iss.id;
    next(); // todo ok, continuar
});


app.get("/api/usuarioRegistrado", function(req, res) {
    
    dbСonnection.query("SELECT * FROM usuario as usu WHERE usu.id = ?", [req.user], function(error, usuario) {
        if (error){
            console.log(error);
            return res.status(500).send("Error al obtener los usuario");
        } 
        if (usuario.length == 0) return res.status(404).send("Usuario no encontrado");
        res.status(200).json(usuario[0]);
    });
});



app.get("/api/banco/pagoFin", function(req, res) {
    
    dbСonnection.query("SELECT * FROM banco as p WHERE p.id = ?", [req.count], function(error, cuenta) {
        if (error){
            console.log(error);
            return res.status(500).send("Error al obtener la cuenta");
        } 
        if (cuenta.length == 0) return res.status(404).send("Cuenta no encontrada");
        res.status(200).json(cuenta[0]);
    });
});


app.put("/api/banco/pagar", function(req, res) {
    console.log(req.body);
    var id = req.body.id;
    var saldo = req.body.saldo;
    var sqlQuery = "UPDATE banco as b SET b.saldo = "+ mysql.escape(saldo) +" WHERE b.id = " + mysql.escape(id)
    dbСonnection.query(sqlQuery, function(error, cuenta) {
        console.log(sqlQuery);
        if (error) return res.status(500).send("Error al actualizar el saldo");
        res.status(200).json(cuenta);
    });
});





//CESTA

app.get("/cesta/:idUs",function(req,res) {
    var idUs = req.params.idUs;
    dbСonnection.query("SELECT * FROM cesta as c WHERE c.id_usu = ?", [idUs], function (error, productosEnCesta) {
        if (error) return res.status(500).send("Error al obtener la cesta");
        if (productosEnCesta.length == 0) return res.status(404).send("Productos no encontrados");
        res.status(200).json(productosEnCesta);
      });


})

app.get("/cestaProduct/:idUsu",function(req,res) {
    var idUsu = req.params.idUsu;
    sqlQuery = "SELECT  cesta.id, cesta.id_pr, cesta.id_usu, electrodomesticos.nombre,electrodomesticos.precio,electrodomesticos.imagen,electrodomesticos.categoria FROM cesta INNER JOIN electrodomesticos ON  cesta.id_pr=electrodomesticos.id where cesta.id_usu = ?"
    dbСonnection.query(sqlQuery,[idUsu], function (error, cestaJoinProductos) {
        if (error) return res.status(500).send("Error al obtener la cesta");
        if (cestaJoinProductos.length == 0) return res.status(404).send("Productos no encontrados");
        res.status(200).json(cestaJoinProductos);
      });

})




app.post("/cesta",function(req,res) {
    console.log(req.body);
    var id_pr = req.body.id_pr;
    var id_usu = req.body.id_usu;
    var cantidad = req.body.cantidad;

    var sqlQuery = "INSERT INTO cesta(id_pr,id_usu,cantidad) VALUES(" + mysql.escape(id_pr) + "," + mysql.escape(id_usu) + "," + mysql.escape(cantidad) + ")"

    dbСonnection.query(sqlQuery, function(error, itemCesta) {
        console.log(error);
        if (error) return res.status(500).send("Error al insertar item a la cesta");
        res.status(200).json(itemCesta);
    });
})



app.delete("/cesta/:id",function(req,res) {

    var id = req.params.id;
   
    dbСonnection.query("delete c from cesta as c where c.id =?",[id], function(error, itemCesta) {
        console.log(error);
        if (error) return res.status(500).send("Error al eleminar item de la cesta");
        if (itemCesta.length == 0) return res.status(404).send("Productos no encontrados");
        res.status(200).json(itemCesta);
    });
})









var port = 3000;
app.listen(port, function() { 
     console.log("Servidor escuchando en puerto:", port);
    });
    
   

    })

    






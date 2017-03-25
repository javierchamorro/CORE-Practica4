/*
Practica 4
Javier Chamorro Abella
Oscar Sanchez Rueda
*/


var net=require('net');
var file=require('fs');

if(process.argv.length !== 3){
	console.log('sintax: "node servidor.js filename.txt"');
	process.exit();
}
var server = net.createServer(function(socket){	
	socket.setEncoding('utf-8');
	var contactos = Array();

	file.readFile(process.argv[2], 'utf-8', function(error, data){	
		if(data !== undefined){	
			for (var i=0; i<data.split("\n").length; i++){
				contactos[data.split("\n")[i].split(", ")[0]] = data.split("\n")[i].split(", ")[1];
			}
		}
	});

	Agenda=agenda(contactos);

	socket.on('data',function(comando){
		
		var mensaje = comando.toString().trim().split(" ");	

		if(mensaje[0]==="setTel"){
			try{
				var elemento = comando.trim().split(/"/);
				if (elemento.length !== 3){	
					socket.write("KO\n");	
				}else{
					Agenda.set(elemento[1],elemento[2]);
					file.writeFile(process.argv[2], Agenda.toString(socket),'utf-8',function(error){
						if (error) {
							throw new Error("Error al escribir en el archivo");
							socket.write("KO\n");
						}
					});
				}
			}catch(e){
				socket.write("KO\n");
			}
			return;
		}
		if(mensaje[0]==="getTel"){
			var elemento = comando.trim().split(/"/);	
			if(elemento.length !== 3){	
				socket.write("KO\n");
			}else{
				socket.write(Agenda.get(elemento[1])+ "\n");
			}
			return;
		}
		if(mensaje[0]==="quit"){
			socket.end();
		}else{
			socket.write("El comando no existe"+"\n");
		}
	});

});

function agenda (datos){
	var info=datos;

	return{
		get : function(nombre){
			if(nombre!== undefined && datos[nombre]!== undefined){
				return datos[nombre];
			}else{
				return "KO";
			}
		},

		set : function(nombre, numero){
			datos[nombre]=numero;
		},

		toString : function(){
			var contacto ="";
			for (var name in info){
				if(name !== undefined && datos[name] !== undefined){
					contacto += name + ", " + info[name] + "\n";
				}
			}
			return contacto;
		}
	}
}

server.listen(8000);
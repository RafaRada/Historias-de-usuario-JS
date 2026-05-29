let nombre = prompt("Ingrese su nombre:");
let validadorGeneral = true; //Validador para que funcione como un while true
function validadorNumero() {//Esta funcion esta creada para validar la edad
    let edad = prompt("Ingrese su edad: ");
    while (validadorGeneral) {
        if (isNaN(edad) || edad === "" || edad === null || edad <= 0) { //Si edad no es un numero entonces
            alert("Error: Por favor, ingresa una edad válida en números."); //Alerta de error
            edad = prompt("Ingrese su edad: ");//Vuelve a pedir la edad
        } else {//Sino
            validadorGeneral = false;//El validador general se vuelve falso y se sale del bucle
        }
    }
    (edad < 18)//Validacion ternaria
        ? alert("Hola " + nombre + ", eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!")
        : alert("Hola " + nombre + ", eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!!");

    }

validadorNumero();

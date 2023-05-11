let orden;
let preguntas;
let correctas = 0;

window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    cargarJson()
});

const cargarJson = async () => {
    const response = await fetch(('preguntas.json'));
    preguntas = await response.json();
    barajarArray()
}

const barajarArray = () => {
    orden = preguntas.map(pregunta => pregunta.id);
    orden.sort(() => Math.random() - 0.5);//mezclo el array de ids
    console.log(orden);
}

const jugar = (usuario) => {
    console.log(preguntas)
    let contador = 3;
    const intervalo = setInterval(() => {
        articleJuego.innerHTML = `
            <h3>Hola ${usuario} 🖐️ Preparate para comenzar en ${contador} <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <span class="sr-only">Loading...</span></h3>
        `;
        if (contador == 0) {
            clearInterval(intervalo);
            mostrarPregunta();
        } else {
            contador--;
        }
    }, 1000);
}

const sectionIngreso = document.getElementById('ingreso')
const comenzarBtn = document.getElementById('comenzar');
const nombreInput = document.getElementById('nombre');
const articleJuego = document.getElementById('juego');
const articleBotones = document.getElementById('botonera');

let usuario;
comenzarBtn.onclick = () => {
    if (nombreInput.value != '') {
        usuario = nombreInput.value;
        sectionIngreso.remove();
        jugar(usuario);
    }
}

const mostrarPregunta = () => {
    let numero = 0;
    articleJuego.innerHTML = '';
    articleJuego.innerHTML = `
        <div>
            <h3>Pregunta número ${orden[numero]}</h3>
            <textarea rows='10' readonly>${preguntas[orden[numero] - 1].pregunta}</textarea>
        </div>
    `;
    articleBotones.innerHTML = `
        <button id='respuesta'>Ver Respuesta</button>
        <button id='siguiente'>Siguiente</button>
    `;
    document.getElementById('siguiente').onclick = () => {
        if (numero < orden.length - 1) {
            numero++;
            articleJuego.innerHTML = '';
            articleJuego.innerHTML = `
            <div>
                <h3>Pregunta número ${orden[numero]}</h3>
                <textarea rows='10' readonly>${preguntas[orden[numero] - 1].pregunta}</textarea>
            </div>
            <p>${correctas} correctas / ${numero} totales</p>
        `;
            document.getElementById('respuesta').removeAttribute('disabled');
        } else {
            articleJuego.innerHTML = '';
            articleJuego.innerHTML = `
                <h3>No hay más preguntas - Como te fué ?</h3>
            `;
            articleBotones.innerHTML = `
            <button id='bien' onclick='confetti()')>Bien 💪</button>
            <button id='maso' onclick='Swal.fire("A seguir intentando 💫")'>Maso 😅</button>
        `;
        }

    }
    document.getElementById('respuesta').onclick = () => {
        articleJuego.innerHTML += `
        <div>
            <textarea rows='10' readonly>${preguntas[orden[numero] - 1].respuesta}</textarea>
        </div>
        `;
        document.getElementById('respuesta').setAttribute('disabled', true);
        dispararAlert();
    }
}

const dispararAlert = () => {
    setTimeout(() => {
        Swal.fire({
            position: 'bottom',
            background: '#7f8de1',
            title: 'Respondiste bien ?',
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i>',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"></i>',
            cancelButtonAriaLabel: 'Thumbs down'
        }).then((result) => {
            if (result.isConfirmed) {
                correctas++;
            }
        });
    }, 3000);
}
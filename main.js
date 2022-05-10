// Initial variable
const tasks = []
let time = 0 // el tiempo que inicia la tarea
let timer = null // setTimer de cada tarea
let timerBreak = null // setTimer al terminar la tarea y empieza el descanso
let current = null // tarea actual

const form = document.querySelector("#form")
const itTask = document.querySelector("#itTask")
const bAdd = document.querySelector("#bAdd")
//seleccionamos la etiqueta con id #taskname
const taskName = document.querySelector("#time #taskName")

renderTime() // mostrar el render al inicio
renderTasks()

// call listener
form.addEventListener("submit", (e) => {
  e.preventDefault()
  if (itTask.value !== "") {
    // ingresar task
    createTask(itTask.value)
    // limpiar input
    itTask.value = ""
    renderTasks()
  }
})

// Agregar elementos al []tasks
function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(3).slice(3),
    title: value,
    completed: false,
  }
  //   console.log(newTask)
  //   console.log(tasks)
  tasks.unshift(newTask) //unshift() agrega uno o más elementos al inicio del array
}

// Renderiza todos los elementos de las tareas, generamos un html y lo injecta en una contenedor
function renderTasks() {
  // recoremos el arreglo y lo capturamos en la variable "html"
  const html = tasks.map((task) => {
    return `
            <div class="task">
                <div class="completed">
                ${
                  task.completed
                    ? `<span class="done">Done</span>`
                    : `<button class="start-button" data-id="${task.id}">
                        Start
                    </button>`
                }
                </div>

                <div class="title">${task.title}</div>
            </div>
        `
  })

  //Seleccionar todos los nodeList[] del contenedor padre #tasks
  const tasksContainer = document.querySelector("#tasks")
  //insertamos los elementos en la etiqueta seleccionada (#tasks) y hacemos un join
  tasksContainer.innerHTML = html.join("")

  //seleccionar todos los nodelist[] desendientes de la clase seleccionada
  const startButtons = document.querySelectorAll(".task .start-button")
  //console.log(startButtons)

  // Recorremos todos los nodeList[buttons]
  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      //evaluamos si timer no es null
      if (!timer) {
        //capturamos el id del button
        const id = button.getAttribute("data-id")
        //creamos un funcion al iniciar el button y recibe como argumento el id
        startButtonHandler(id)
        //agregamos un texto al button
        button.textContent = "In progress..."
      }
    })
  })
}

// Manejar el estado al momento de hacer click
function startButtonHandler(id) {
  time = 4 // cada min equivale 60 sec, 25 minutos equivale a = 1500 sec
  current = id // tarea actual

  //  devuelve el índice del primer elemento de un array que cumpla la condicion
  const taskIndex = tasks.findIndex((task) => task.id === id)

  //insertamos el valor title del array tasks a la etiqueta #taskname
  taskName.textContent = tasks[taskIndex].title
  renderTime()
  // hacemos el setInterval de la tarea
  timer = setInterval(() => {
    //funcion para disminuir el tiempo en segundos
    timeHandler(id)
  }, 1000) // se ejecuta cada 1 segundos la funcion
}

/*------------TIMER HANDLER --------------*/
// Function que permite disminuir el tiempo en -1
function timeHandler(id) {
  time--
  renderTime() // renderiza el tiempo
  if (time === 0) {
    clearInterval(timer) // detener el setInterval cuando el timer es 0
    markCompleted(id)
    timer = null
    renderTasks()
    startBreak()
  }
}

function startBreak() {
  time = 3
  taskName.textContent = "Break"
  renderTime()
  timerBreak = setInterval(() => {
    timerBreakHandler()
  }, 1000)
}

/*------------TIMER BREAK HANDLER --------------*/
function timerBreakHandler() {
  time--
  renderTime() // renderiza el tiempo

  if (time === 0) {
    clearInterval(timerBreak) // detener el setInterval cuando el timer es 0
    current = null // tarea actual null
    timerBreak = null
    taskName.textContent = ""
    renderTasks()
  }
}

// funcion que permite dar formato a un numero
function renderTime() {
  const timeDiv = document.querySelector("#time #value")
  const minutes = parseInt(time / 60)
  const seconds = parseInt(time % 60)

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`
}

function markCompleted(id) {
  //  devuelve el índice del primer elemento de un array que cumpla la condicion
  const isEqualId = (task) => task.id === id
  const taskIndex = tasks.findIndex(isEqualId)
  tasks[taskIndex].completed = true
}

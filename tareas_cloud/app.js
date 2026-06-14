// Reemplazar con las credenciales de tu proyecto
const SUPABASE_URL = "https://djjoyusnlhlopnwqsner.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqam95dXNubGhsb3Bud3FzbmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE0OTcsImV4cCI6MjA5NzA0NzQ5N30.UUcCsXDxkqsVoHwAnvScwqZWCMPXhCMwuv3KHPzvZSY";
const { createClient } = supabase;
const db = createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);
// Cargar tareas
async function cargarTareas() {
const { data, error } = await db
.from("tareas")
.select("*")
.order("created_at");
if(error){
console.error(error);
return;
}
renderTareas(data);
}
// Tiempo real
db.channel("tareas-canal")
.on(
"postgres_changes",
{
event: "*",
schema: "public",
table: "tareas"
},
() => {
cargarTareas();
}
)
.subscribe();
// Agregar tarea
async function agregarTarea(){
const titulo =
5
document.getElementById("titulo")
.value.trim();
const responsable =
document.getElementById("responsable")
.value.trim();
if(!titulo || !responsable){
alert("Complete todos los campos");
return;
}
await db
.from("tareas")
.insert({
titulo,
responsable
});
document.getElementById("titulo").value = "";
document.getElementById("responsable").value = "";
}
// Cambiar estado
async function toggleEstado(id, estado){
await db
.from("tareas")
.update({
completada: !estado
})
.eq("id", id);
}
// Eliminar tarea
async function eliminarTarea(id){
if(confirm("¿Eliminar esta tarea?")){
await db
.from("tareas")
.delete()
.eq("id", id);
}
}
6
// Mostrar tareas
function renderTareas(tareas){
const cont =
document.getElementById(
"tareas-container"
);
document.getElementById(
"contador"
).textContent = "(" + tareas.length + ")";
if(tareas.length === 0){
cont.innerHTML =
'<p class="vacio">No hay tareas registradas.</p>';
return;
}
cont.innerHTML = tareas.map(
tarea =>
`
 <div class="tarea ${tarea.completada ? 'completada' : ''}">
 <div class="tarea-info">
 <strong>${tarea.titulo}</strong>
 <span>
 Responsable:
${tarea.responsable}
 </span>
 </div>
 <div class="tarea-acciones">
 <button
 onclick="toggleEstado('${tarea.id}',$
{tarea.completada})">
${tarea.completada ? "Reabrir" : "Completar"}
 </button>
 <button
 class="btn-eliminar"
7
 onclick="eliminarTarea('${tarea.id}')">
 Eliminar
 </button>
 </div>
 </div>
 `
).join("");
}
cargarTareas();

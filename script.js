const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const API_KEY = "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"; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {

    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}


const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    const faq = {
        "costo mensualidad": "El costo de la mensualidad para el próximo semestre es de 550bs.",
        "materias ofertadas": "Actualmente ofrecemos las carreras de administración de empresas, contaduría pública, ingeniería comercial, marketing y publicidad, psicología, ciencias de la comunicación social, relaciones internacionales, gestión del turismo, psicopedagogía, ingeniería industrial, ingeniería en redes y telecomunicaciones, ingeniería en gestión petrolera, ingeniería en gestión ambiental, ingeniería de sistemas, ingeniería civil, medicina y fisioterapia y kinesiología",
        "no tengo acceso a la plataforma moodle":"si te programaste con retraso debes aproximarte al decano correspondiente de tu carrera para que te habilite el acceso a Moodle",
        "perdí mi celular y no puedo ingresar a mi cuenta académica": "debes aproximarte al encargado del área de sistemas de la universidad",
        "cuentan con la carrera de derecho": "por supuesto, contamos con esa carrera como también con la carrera de administración de empresas, contaduría pública, ingeniería comercial, marketing y publicidad, psicología, ciencias de la comunicación social, relaciones internacionales, gestión del turismo, psicopedagogía, ingeniería industrial, ingeniería en redes y telecomunicaciones, ingeniería en gestión petrolera, ingeniería en gestión ambiental, ingeniería de sistemas, ingeniería civil, medicina y fisioterapia y kinesiología",
        "con qué carreras cuentan": "contamos con las carreras de derecho, administración de empresas, contaduría pública, ingeniería comercial, marketing y publicidad, psicología, ciencias de la comunicación social, relaciones internacionales, gestión del turismo, psicopedagogía, ingeniería industrial, ingeniería en redes y telecomunicaciones, ingeniería en gestión petrolera, ingeniería en gestión ambiental, ingeniería de sistemas, ingeniería civil, medicina y fisioterapia y kinesiología",
        "puedo inscribirme en cualquier mes del año": "por supuesto, contamos con flexibilidad de horarios con la modalidad de una materia por mes. Puede inscribirse en cualquier momento y se le indicará el inicio de módulo correspondiente a la modalidad de estudio y horario correspondiente",
        "cuánto debo pagar al momento de inscribirme": "debe cubrir el costo de la, matricula que tiene un costo de bs600, la primera mensualidad que tiene un costo de bs550, el carnet universitario que tiene un costo de bs50 y el seguro universitario que tiene un costo de bs100",
        "qué cubre el seguro universitario":" cubre cualquier tipo de accidente únicamente dentro de la universidad y será atendido en una clínica privada",
        "qué hago si ya no hay cupos para programarme":"puedes apersonarte a la ventanilla de registros para que puedan programarte o habilitar cupos para tu materia correspondiente y si posterior a eso no tienes acceso a la plataforma de Moodle puedes solicitar tu acceso a tu decano correspondiente",
        "qué necesito para obtener una beca": "puedes obtener una beca si ya cursaste todo un año de tu carrera y cuentas con un promedio de 75 o más para solicitar media beca o un promedio de 85 o más para solicitar beca completa, ten en cuenta que la solicitud se la realiza al inicializar el año",
        "puedo cambiarme de turno si tengo beca": "no puedes cambiarte de turno ni de modalidad de estudio y tampoco adelantar materias, la beca que obtuviste solo cubre pagos mensuales en el horario y modalidad que cursas con regularidad",
        "qué pasa si pierdo una materia": "si cuentas con una beca se procede con la anulación de la misma y puedes volver a cursar la materia en el horario en la que esté disponible y si no cuentas con una beca de igual forma puedes volver a cursar la materia en cualquier horario paralela a otra o no",
        "qué pasa si perdí mi carné universitario": "debes aproximarte al área de marketing para que procedan con la solicitud de un nuevo carné",
        "qué pasa si esta materia no hay tantos alumnos y tengo beca": "deberás cancelar la cantidad regular de la mensualidad debido al bajo número de estudiantes",
        "puedo programarme un día después del inicio de módulo": "no puedes programarte pasado el primer día de inicio de módulo",
        "puedo faltar a clase": "no puedes faltar más de 4 clases durante el módulo caso contrario se te anulara la defensa del proyecto socioformativo final de tu materia correspondiente y de igual forma no podrás realizar ninguna actividad realizada durante la clase a la que faltaste",
        "qué requisitos necesito para inscribirme en la universidad": "necesitas una fotocopia legalizada del título de bachiller, una fotocopia de carné de identidad vigente, un certificado de nacimiento original, una fotografía 4x4 fondo azul",
        "puedo hacer intercambio a otro país": "por supuesto, contamos con convenios con universidades de distintos Países, debes presentar una solicitud para validar tu traspaso durante un semestre completo"
    };

    const userQuestion = userMessage.toLowerCase();
    if (userQuestion in faq) {
        messageElement.textContent = faq[userQuestion];
    } else {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage}],
            })
        }

        fetch(API_URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                messageElement.textContent = data.choices[0].message.content.trim();
            })
            .catch(() => {
                messageElement.classList.add("error");
                messageElement.textContent = "¡Ups! Algo salió mal. Inténtalo de nuevo.";
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }
}


const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if(!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
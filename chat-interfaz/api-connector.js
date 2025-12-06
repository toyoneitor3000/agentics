// Configuración de la API
const API_URL = 'http://localhost:7001';
let selectedAgent = null;
let agents = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('api-url').textContent = API_URL;
    testAPIConnection();
});

// Probar conexión con la API
async function testAPIConnection() {
    const statusEl = document.getElementById('connection-status');
    const apiStatusEl = document.getElementById('api-status');
    
    statusEl.innerHTML = '<i class="fas fa-circle"></i> Probando conexión...';
    statusEl.style.color = 'var(--warning)';
    apiStatusEl.textContent = 'Probando conexión...';
    
    logToConsole('info', '> Probando conexión con API...');
    
    try {
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
            const data = await response.json();
            statusEl.innerHTML = '<i class="fas fa-circle"></i> API Conectada';
            statusEl.style.color = 'var(--success)';
            apiStatusEl.textContent = `Conectado (${data.version})`;
            document.getElementById('root-agent').textContent = data.root_agent_name || 'No disponible';
            
            logToConsole('success', `> ✓ API conectada: ${data.version}`);
            logToConsole('success', `> ✓ ADK disponible: ${data.adk_available}`);
            logToConsole('success', `> ✓ Agente raíz: ${data.root_agent_name || 'No disponible'}`);
            
            // Cargar agentes automáticamente
            loadAgentsFromAPI();
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        statusEl.innerHTML = '<i class="fas fa-circle"></i> API No Conectada';
        statusEl.style.color = 'var(--danger)';
        apiStatusEl.textContent = `Error: ${error.message}`;
        logToConsole('error', `> ✗ Error de conexión: ${error.message}`);
    }
}

// Cargar agentes desde la API
async function loadAgentsFromAPI() {
    logToConsole('info', '> Cargando agentes desde API...');
    
    try {
        const response = await fetch(`${API_URL}/agents`);
        if (response.ok) {
            const data = await response.json();
            agents = data.agents || [];
            renderAgents();
            logToConsole('success', `> ✓ ${agents.length} agentes cargados`);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        logToConsole('error', `> ✗ Error cargando agentes: ${error.message}`);
        // Usar agentes de respaldo
        agents = [
            { id: 'root', name: 'Purrpur CEO', role: 'Orquestador principal', icon: 'crown' },
            { id: 'brand', name: 'Brand Manager', role: 'Creación de marcas', icon: 'palette' },
            { id: 'backend', name: 'Backend Cloud', role: 'Servidores y APIs', icon: 'server' },
            { id: 'frontend', name: 'Frontend Web', role: 'Desarrollo web', icon: 'code' }
        ];
        renderAgents();
        logToConsole('warning', '> Usando agentes de respaldo');
    }
}

// Renderizar agentes en el panel izquierdo
function renderAgents() {
    const agentList = document.getElementById('agent-list');
    agentList.innerHTML = '';
    
    agents.forEach(agent => {
        const agentNode = document.createElement('div');
        agentNode.className = 'agent-node';
        agentNode.dataset.id = agent.id;
        agentNode.onclick = () => selectAgent(agent);
        
        agentNode.innerHTML = `
            <div class="agent-icon">
                <i class="fas fa-${agent.icon || 'robot'}"></i>
            </div>
            <div class="agent-info">
                <div class="agent-name">${agent.name}</div>
                <div class="agent-role">${agent.role || 'Agente'}</div>
            </div>
            <div class="agent-status"></div>
        `;
        
        agentList.appendChild(agentNode);
    });
}

// Seleccionar agente
function selectAgent(agent) {
    // Remover selección anterior
    document.querySelectorAll('.agent-node').forEach(node => {
        node.classList.remove('active');
    });
    
    // Seleccionar nuevo
    const agentNode = document.querySelector(`.agent-node[data-id="${agent.id}"]`);
    if (agentNode) {
        agentNode.classList.add('active');
    }
    
    selectedAgent = agent;
    document.getElementById('current-agent-name').textContent = agent.name;
    
    logToConsole('info', `> Agente seleccionado: ${agent.name}`);
    addMessage('agent', `Agente ${agent.name} seleccionado. ¿En qué puedo ayudarte?`);
}

// Enviar mensaje a la API
async function sendMessageToAPI() {
    const input = document.getElementById('input-mensaje');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Agregar mensaje del usuario
    addMessage('user', message);
    
    // Limpiar input
    input.value = '';
    
    // Enviar a la API
    try {
        logToConsole('info', `> Enviando mensaje a API: "${message.substring(0, 50)}..."`);
        
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: message,
                agent_name: selectedAgent?.name || 'purrpurragent'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Agregar respuesta del agente
            addMessage('agent', data.response || 'No response received', {
                cost: '$0.0000', // La API no devuelve costo actualmente
                tokens: 0 // La API no devuelve tokens actualmente
            });
            
            logToConsole('success', `> ✓ Respuesta recibida de ${data.agent_used} (${data.execution_time.toFixed(2)}s)`);
            
            // Actualizar estadísticas (usar valores estimados)
            updateStats(0.001, 100); // Valores estimados para demostración
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        logToConsole('error', `> ✗ Error enviando mensaje: ${error.message}`);
        addMessage('agent', `Lo siento, hubo un error al procesar tu mensaje: ${error.message}`);
    }
}

// Enviar mensaje de prueba
async function sendTestMessage() {
    const testMessages = [
        "Hola, ¿cómo estás?",
        "¿Qué puedes hacer por mí?",
        "Cuéntame sobre los agentes disponibles",
        "¿Cómo funciona el sistema PURPUR?"
    ];
    
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    document.getElementById('input-mensaje').value = randomMessage;
    sendMessageToAPI();
}

// Agregar mensaje al chat
function addMessage(type, content, metadata = {}) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${type}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    let footer = '';
    if (type === 'agent' && (metadata.cost || metadata.tokens)) {
        footer = `
            <div class="message-footer">
                <span>💰 ${metadata.cost || '$0.000'}</span>
                <span>⚡ ${metadata.tokens || 0} tokens</span>
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span><i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i> ${type === 'user' ? 'Tú' : selectedAgent?.name || 'Sistema'}</span>
            <span>${timeString}</span>
        </div>
        <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
        ${footer}
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Actualizar estadísticas
let totalCost = 0;
let totalTokens = 0;
let startTime = Date.now();

function updateStats(cost = 0, tokens = 0) {
    totalCost += cost;
    totalTokens += tokens;
    
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const tokensPerSecond = elapsedSeconds > 0 ? Math.round(totalTokens / elapsedSeconds) : 0;
    
    document.getElementById('total-cost').textContent = totalCost.toFixed(2);
    document.getElementById('message-cost').textContent = `$${cost.toFixed(4)}`;
    document.getElementById('tokens-per-second').textContent = tokensPerSecond;
    document.getElementById('total-tokens').textContent = totalTokens;
    document.getElementById('total-time').textContent = `${elapsedSeconds}s`;
}

// Log a consola
function logToConsole(type, message) {
    const consoleDiv = document.getElementById('tool-console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = message;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// Funciones de UI
function clearChat() {
    document.getElementById('chat-messages').innerHTML = '';
    logToConsole('info', '> Chat limpiado');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessageToAPI();
    }
}

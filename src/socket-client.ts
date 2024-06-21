import {Manager, Socket} from 'socket.io-client'

let socket: Socket;

export const connectToServer = (token: string) => {

    const manager = new Manager('localhost:3000/socket.io/socket.io.js',{
        extraHeaders: {
            hola: 'mundo',
            autentication: token
        }
    });

    socket?.removeAllListeners(); // si el coket es null borra los demas
    socket =  manager.socket('/');


    addListeners()
   
    //localhost:3000/socket.io/socket.io.js
   
}

const addListeners = () => {
    //Obteniedo los id 
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector('#messages-ul')!;
    
    socket.on('connect', () => {
        serverStatusLabel.innerHTML = `<h1 style="color: green;">CONECTADO</h1>`
    })

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = '<h1 style="color: red;">DESCONECTADO</h1>'
    })

    //Escuchar
    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach( clientId => {
            clientsHtml += `<li>${clientId}</li>`
        });

        clientsUl.innerHTML = clientsHtml
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if(messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client',{
            id : 'YOOO', 
            message:  messageInput.value
        })
        messageInput.value = '';
    });

    socket.on('message-from-server', ( payload: { fullName: string, message: string}) =>{
       const newMessage = `
        <li>
            <strong>${payload.fullName}</strong>
            <span>${payload.message}</span>
        </li>
       `

       const li = document.createElement('li');
       li.innerHTML = newMessage;
       messagesUl.appendChild(li)
    })



}
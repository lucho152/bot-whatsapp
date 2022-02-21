const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');


const SESSION_FILE_PATH = "./session.js";
const COUNTRY_CODE = "549";
const NUMBER_PHONE = "3764721581";
const MSG = "Hola Mundo!!";
let session_data;

if (fs.existsSync(SESSION_FILE_PATH)) {
    session_data = require(SESSION_FILE_PATH);
}

const client = new Client({ session: session_data });

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("El cliente esta listo.");

    let chatId = COUNTRY_CODE + NUMBER_PHONE + "@c.us";
    client.sendMessage(chatId, MSG)
        .then((response) => {
            if(response.id.fromMe) console.log("Mensaje enviado.");
        });

});

client.on('authenticated', (session) => {
    session_data = session;
    fs.writeFileSync(
        SESSION_FILE_PATH, //Ubicacion del archivo
        JSON.stringify(session), //En caso de success
        (error) => { if (error) console.error(error) }); //En caso de error
});

client.on('auth_failure', (msg) => {
    console.error("Hubo un fallo en la autenticación: ", msg);
});
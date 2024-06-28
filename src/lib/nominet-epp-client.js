const tls = require('tls');
const xml2js = require('xml2js');
const EventEmitter = require('events');
const { dataToString, parseJSXML} = require('../utils/data-utils');
const { createDomain, createContact, checkDomain } = require('../commands/epp-commands');

class NominetEPPClient extends EventEmitter {
  constructor(server, port, { rejectUnauthorized = false } = {}) {
    super();
    this.server = server;
    this.port = port;
    this.rejectUnauthorized = rejectUnauthorized;
    this.client = null;
    this.buffer = Buffer.alloc(0);
  }

  connect() {
    this.client = tls.connect(this.port, this.server, { rejectUnauthorized: this.rejectUnauthorized }, () => {
      console.log('Connected to EPP server');
      this.emit('connect');
    });

    this.client.on('data', (data) => this.onData(data));
    this.client.on('close', () => this.emit('close'));
    this.client.on('error', (err) => this.emit('error', err));
  }

  onData(data) {
    this.buffer = Buffer.concat([this.buffer, data]);

    while (this.buffer.length >= 4) {
      const messageLength = this.buffer.readUInt32BE(0);

      if (this.buffer.length < messageLength) {
        return;
      }

      const messageBuffer = this.buffer.slice(4, messageLength);
      this.buffer = this.buffer.slice(messageLength);
      const string = dataToString(messageBuffer);

      xml2js.parseString(string, { explicitArray: false }, (err, result) => {
        if (err) {
          this.emit('error', err);
        } else {

          // Full expand of the data object and log it
          console.log(result?.epp?.response)

          const data = parseJSXML(result);

          if (data?.clientTransactionId === 'login-command' && data?.eppResultCode === '1000') {
            this.emit('login', data);
          }

          console.log(data)

          this.emit('response', result);
        }
      });
    }
  }

  sendEPPCommand(command) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(Buffer.byteLength(command) + 4, 0);
    const commandBuffer = Buffer.from(command);
    const messageBuffer = Buffer.concat([lengthBuffer, commandBuffer]);
    this.client.write(messageBuffer);
  }

  createDomain(name, period, registrant, nameservers, transactionId = 'abcde12345'){
    const command = createDomain(name, period, registrant, nameservers, transactionId);
    this.sendEPPCommand(command);
  }

  createContact(identifier, name, organisation, address, city, state, postcode, country, phone, email, transactionId = 'abcde12345'){
    const command = createContact(identifier, name, organisation, address, city, state, postcode, country, phone, email, transactionId);
    this.sendEPPCommand(command);
  }

  checkDomain(name, transactionId = 'abcde12345'){
    const command = checkDomain(name, transactionId);
    this.sendEPPCommand(command);
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

module.exports = NominetEPPClient;
function login(username, password, transactionId = 'ABC-12345') {
  return `
    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
      <command>
        <login>
          <clID>${username}</clID>
          <pw>${password}</pw>
          <options>
            <version>1.0</version>
            <lang>en</lang>
          </options>
          <svcs>
            <objURI>urn:ietf:params:xml:ns:domain-1.0</objURI>
            <objURI>urn:ietf:params:xml:ns:contact-1.0</objURI>
            <objURI>urn:ietf:params:xml:ns:host-1.0</objURI>
          </svcs>
        </login>
        <clTRID>${transactionId}</clTRID>
      </command>
    </epp>
  `;
}

/**
 * Create domain name
 * @param name Domain name
 * @param period Period of registration in years
 * @param registrant Registrant ID
 * @param nameservers Array of nameservers
 * @param transactionId Client Transaction ID
 * @returns {string} XML string to send to EPP server
 */
function createDomain(name, period = 1, registrant, nameservers, transactionId = 'abcde12345'){

  const nameserverString = nameservers.map(ns => `<domain:hostObj>${ns}</domain:hostObj>`).join('\n');

  return `
  <?xml version="1.0" encoding="UTF-8"?>
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="urn:ietf:params:xml:ns:epp-1.0
   epp-1.0.xsd">
   <command>
     <create>
       <domain:create
         xmlns:domain="urn:ietf:params:xml:ns:domain-1.0"
         xsi:schemaLocation="urn:ietf:params:xml:ns:domain-1.0
         domain-1.0.xsd">
         <domain:name>${name}</domain:name>
         <domain:period unit="y">${period}</domain:period>
         <domain:ns>
            ${nameserverString}
         </domain:ns>
         <domain:registrant>${registrant}</domain:registrant>
         <domain:authInfo>
           <domain:pw>**********</domain:pw>
         </domain:authInfo>
       </domain:create>
     </create>
     <clTRID>${transactionId}</clTRID>
   </command>
</epp>
`;
}

/**
 * Create contact
 * @param identifier Contact ID
 * @param name Contact/Administration name
 * @param organisation Organisation name (or Contact name
 * @param address // Address
 * @param city // City
 * @param state // State
 * @param postcode // Postcode
 * @param country // Country
 * @param phone // Phone number
 * @param email // Email address
 * @param transactionId // Client Transaction ID
 * @returns {string}
 */
function createContact(identifier, name, organisation, address, city, state, postcode, country, phone, email, transactionId = 'abcde12345'){
  return `
  <?xml version="1.0" encoding="UTF-8"?>
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="urn:ietf:params:xml:ns:epp-1.0
    epp-1.0.xsd">
    <command>
        <create>
            <contact:create
                xmlns:contact="urn:ietf:params:xml:ns:contact-1.0" 
                xsi:schemaLocation="urn:ietf:params:xml:ns:contact-1.0
                contact-1.0.xsd">
                <contact:id>${identifier}</contact:id>
                <contact:postalInfo type="loc">
                    <contact:name>${name}</contact:name>
                    <contact:org>${organisation}</contact:org>
                    <contact:addr>
                        <contact:street>${address}</contact:street>
                        <contact:city>${city}</contact:city>
                        <contact:sp>${state}</contact:sp>
                        <contact:pc>${postcode}</contact:pc>
                        <contact:cc>${country}</contact:cc>
                    </contact:addr>
                </contact:postalInfo>
                <contact:voice>${phone}</contact:voice>
                <contact:email>${email}</contact:email>
                <contact:authInfo>
                    <contact:pw>authinfo</contact:pw>
                </contact:authInfo>
            </contact:create>
        </create>
    </command>
</epp>
`;
}

function checkDomain(name, transactionId = 'abcde12345'){
  return `
  <?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
    <command>
      <check>
        <domain:check
         xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
          <domain:name>${name}</domain:name>
        </domain:check>
      </check>
      <clTRID>${transactionId}</clTRID>
    </command>
  </epp>
  ;`
}

module.exports = { login, createDomain, createContact, checkDomain };
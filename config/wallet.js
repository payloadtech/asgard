//////////////////////////////////////////////////////////////////////////////
////                          Wallet Sheezzzzz                            ////
//////////////////////////////////////////////////////////////////////////////

/*
The wallet hierarchically derives public addresses, and their corresponding
P2SH wallet addresses. It requires a nonce in the redis client, called
walletNonce, which it will pass through to the argument.

*/

var bitcore = require('bitcore');


var wallet = function(iteration) {
  var publicKeyRing = [
    "xpub69FPCcRRKETsYfQrLZGUqPmiXErDh9km2LPjtLE8tJBcQFfKLJN8FXsptwW62Q61CZvDCj81wRXMj4EKmEMKym6sn8WG8GwcbjefV3n8GWq",
    "xpub67wfAJFVRFFRiNrdftanqxejaa7cqJV2TYefgwMWB37QDtoBt9pyE7jiWtJti2jjYUmUhPZ7aSxR9FKLgCLXJriSTNeegookB42XV2d1eTN",
    "xpub67wfJNixk7YJEWPmaoqWSqsaBrBuB7QnF4HJg1mowvyZ7DcftfUZomyoBZc3bsnX7UsguvHnJb6mvyUKd4DEY48MZeAZNYsM21Uqp52btGG"
  ];

  var publicKeys = publicKeyRing.map(function(xPubKey) {
    var parent = new bitcore.HDPublicKey(xPubKey);
    var index = "m/2147483647/0/" + iteration;
    var childKey = parent.derive(index).publicKey;
    return childKey;
  });

  var p2shAddress = new bitcore.Address(publicKeys, 2);
  return p2shAddress;
};


module.exports = wallet;

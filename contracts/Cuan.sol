// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CuanPertama {
    string public pesan = "Saya siap jadi Developer Web3!";
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function gantiPesan(string memory _pesanBaru) public {
        require(msg.sender == owner, "Bukan pemilik!");
        pesan = _pesanBaru;
    }
}

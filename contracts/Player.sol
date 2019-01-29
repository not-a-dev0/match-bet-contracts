pragma solidity ^0.4.24;

contract Player {
 
    uint32 public id;
    bytes32 public name; 
     
    constructor(uint32 _id, bytes32 _name) public {
        id = _id;
        name = _name;
    }
}


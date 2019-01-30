pragma solidity >=0.4.24;

contract Player {
 
    uint32 public id;
    bytes public name; 
     
    constructor(uint32 _id, bytes memory _name) public {
        id = _id;
        name = _name;
    }
}


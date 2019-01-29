pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol"; 
import "./Betting.sol";
import "./Match.sol";
import "./Player.sol";

contract BettingFactory is Ownable{  
     
    address[] public playersAddressTable;
    mapping(address => Player) public playersTable;
    uint32 public playerId;
    
    address[] public matchAddressTable;
    mapping(address => Match) public matchesTable;
    uint32 public matchId;

    address[] public bettingAddressTable;
    mapping(address => Betting) public bettingsTable;
    uint32 public bettingId;

    event BettingCreated(uint32 bettingId);
    event MatchCreated(uint32 matchId, bytes32 description);
    event PlayerCreated(uint32 playerId, bytes32 name, address playerAddress);

    constructor() public {
        owner = msg.sender;
    }
 
    function createPlayer(bytes32 _name) public onlyOwner {
        playerId++;
        Player player = new Player(playerId, _name);
        
        address playerAddr = address(player); 
        playersTable[playerAddr] = player;
        playersAddressTable.push(playerAddr);
       
        emit PlayerCreated(player.id(), player.name(), playerAddr);
    }
    
    function getPlayer(address addr) public view returns (uint32 id, bytes32 name) {
        return (playersTable[addr].id(), playersTable[addr].name());
    }  

    function getPlayers() public view returns (address[]) {
        return playersAddressTable;
    }
 
    
    
    function createMatch(bytes32 _description, address _player1, address _player2) public onlyOwner {
        matchId++;
        Match m = new Match(matchId, _description, _player1, _player2);
        address matchAddr = address(m);
        matchesTable[matchAddr] = m;
        matchAddressTable.push(matchAddr); 
        emit MatchCreated(m.matchId(), m.description()); 
    }

    function getMatches() public view returns (address[]) {
        return matchAddressTable;
    }

    function getMatch(address addr) public view returns (uint32 id, bytes32 name, uint32, uint32) {
        return (matchesTable[addr].matchId(), matchesTable[addr].description(), 
            matchesTable[addr].player1().id(), matchesTable[addr].player2().id());
    }
  

    function createBetting(address _match) public onlyOwner {
        bettingId++;
        Betting b = new Betting(bettingId, _match);
        address bettingAddr = address(b);
        bettingsTable[bettingAddr] = b;
        bettingAddressTable.push(bettingAddr); 
        emit BettingCreated(b.id()); 
    }

    function getBettings() public view returns (address[]) {
        return bettingAddressTable;
    }

    function getBetting(address addr) public view returns (uint32 id, uint32 matchId, bytes32 description, uint32 player1_id, uint32 player2_id) {
        return (bettingsTable[addr].id(), 
                bettingsTable[addr]._match().matchId(), 
                bettingsTable[addr]._match().description(),
                bettingsTable[addr]._match().player1().id(), 
                bettingsTable[addr]._match().player2().id());
    }
      
    function bet(address addr, uint8 _playerNum) public payable {
        bettingsTable[addr].bet(_playerNum, msg.sender, msg.value);
    }

    function totalBetAmount(address addr) public view returns (uint, uint, uint) {
        return bettingsTable[addr].totalBetAmounts();
    }

    function setMatchResult(address addr, uint32 _winner, uint8 _winningScore, uint8 _losingScore, uint8 _drawScore) public {
        bettingsTable[addr].setMatchResult(_winner, _winningScore, _losingScore, _drawScore);
    }

    function payWinner(address addr) public {
        bettingsTable[addr].payWinners();
    }
    
    function kill() external {
        require(msg.sender == owner, "Only the owner can kill this contract");
        selfdestruct(owner);
    }
}
 
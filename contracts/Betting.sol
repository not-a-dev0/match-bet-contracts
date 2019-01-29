pragma solidity ^0.4.24;

import "./Match.sol";
import "./Player.sol";

contract Bettor {

    address public bettor;
    uint public amount; 
    uint8 public choice;
    uint public amountPaid;
    bool  public paid;

    constructor(address _bettor, uint _amount, uint8 _choice) public {
        bettor = _bettor;
        amount = _amount;
        choice = _choice;
        paid = false;
    }

    function winningPaidAmount(uint _amountPaid) public {
        amountPaid = _amountPaid;
    }

    function isPaid(bool _paid) public {
        paid = _paid;
    }
}
contract Betting {
    uint32 public id;
    Match public _match;
    uint public totalAmount;
    uint public player_1_amount;
    uint public player_2_amount;
    BettingStatus status;

    mapping(uint32 => Bettor[]) public bettors;  // key: 1=player , 2=player 2

    enum BettingStatus {
        OPEN,     
        CLOSED,    
        PAID           
    } 

    event PlaceBetEvent(uint32 id, uint8 playerNumber, uint player_1_amount, uint player_2_amount);

    constructor(uint32 _id, address matchAddr) public {
        id = _id;
        _match = Match(matchAddr);
        status = BettingStatus.OPEN;
    }

    function getStatus() public view returns(string) {
        return convertBettingStatusToString(status);
    }
    
    function closeBetting() public {
        status = BettingStatus.CLOSED;
    }

    function getMatch() public returns (Match) {
        return _match;
    }

    function changeMatchStatus(bytes32 _status) public {
        _match.changeStatus(_status);
    } 

    function bet(uint8 _playerNum, address bettor, uint amount) public payable{ 
        require(_playerNum == 1 || _playerNum == 2);
        bettors[_playerNum].push(new Bettor(bettor, amount, _playerNum));
        if (_playerNum == 1) {
            player_1_amount += amount;
        } else {
            player_2_amount += amount;
        }
        totalAmount += amount;
        emit PlaceBetEvent(id, _playerNum, player_1_amount, player_2_amount);
    } 

    function totalBetAmounts() public view returns (uint, uint, uint) {
        return (totalAmount,  player_1_amount,  player_2_amount); 
    }

    function setMatchResult(uint32 _winner, uint8 _winningScore, uint8 _losingScore, uint8 _drawScore) public {
        _match.setMatchResult(_winner, _winningScore, _losingScore, _drawScore);
    }

    function payWinners() public {
        uint32 winner = _match.winner();
        Bettor[] memory b = bettors[winner];
        uint amount = address(this).balance / b.length;
        for (uint i=0; i < b.length; i++) {
            b[i].bettor().transfer(amount);            
            b[i].isPaid(true);
            b[i].winningPaidAmount(amount);
        }
        status = BettingStatus.PAID;
    }
    
    function convertBettingStatusToString(BettingStatus s) internal pure returns (string) {
        if (s == BettingStatus.OPEN) {return "open";} 
        if (s == BettingStatus.CLOSED) {return "closed";}
        if (s == BettingStatus.PAID) {return "paid";}     
        return "undetermined"; 
    }
    
    function convertStringToBettingStatus(bytes32 s) internal pure returns (BettingStatus) {
        if (keccak256(abi.encodePacked(s)) == keccak256("open")  ) return BettingStatus.OPEN;
        if (keccak256(abi.encodePacked(s)) == keccak256("closed")) return BettingStatus.CLOSED;
        if (keccak256(abi.encodePacked(s)) == keccak256("paid")) return BettingStatus.PAID; 
    }
}
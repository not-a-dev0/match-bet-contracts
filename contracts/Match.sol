pragma solidity >=0.4.24;

import "./Player.sol";

contract Match {

    enum MatchStatus {
        PENDING,    // match has not been played yet.
        CLOSED,     // match is closed
        ONGOING,   // match is currently being played 
        CANCELLED,  // match is cancelled
        DRAW,       // match is finished and no player won
        WON         // match is finished and a player won
    } 
    
    uint32 public matchId;
    bytes public description;                 // Match description
    Player public player1;                     // first player id
    Player public player2;                     // second player address
    MatchStatus status;                 // enum current status of the match           
      
    uint32  public winner;                      // winning player ID
    uint32  public loser;                       // losing player ID
    uint8   public winningScore;
    uint8   public losingScore;
    uint8   public drawScore;       
     

    event MatchWinner(string winnerName, string loserName);
    event MatchCreated(uint32 matchId, bytes description, uint32 player1, uint32 player2); 

    constructor(uint32 _matchId, bytes memory _description, address _player1, address _player2) public {
        matchId = _matchId;
        description = _description;
        player1 = Player(_player1);
        player2 = Player(_player2);
        emit MatchCreated(matchId, description, player1.id(), player2.id());
    }
    
    function convertMatchStatusToString(MatchStatus s) internal pure returns (bytes32) {
        if (s == MatchStatus.PENDING) {return "pending";}
        if (s == MatchStatus.ONGOING) {return "ongoing";}
        if (s == MatchStatus.CLOSED) {return "closed";}
        if (s == MatchStatus.CANCELLED) {return "cancelled";}
        if (s == MatchStatus.DRAW) {return "draw";}
        if (s == MatchStatus.WON) {return "won";}
        return "undetermined"; 
    }
    
    function convertStringToMatchStatus(bytes32 s) internal pure returns (MatchStatus) {
        if (keccak256(abi.encodePacked(s)) == keccak256("pending")  ) return MatchStatus.PENDING;
        if (keccak256(abi.encodePacked(s)) == keccak256("ongoing")) return MatchStatus.ONGOING;
        if (keccak256(abi.encodePacked(s)) == keccak256("closed")) return MatchStatus.CLOSED;
        if (keccak256(abi.encodePacked(s)) == keccak256("cancelled")) return MatchStatus.CANCELLED;
        if (keccak256(abi.encodePacked(s)) == keccak256("draw")) return MatchStatus.DRAW;
        if (keccak256(abi.encodePacked(s)) == keccak256("won")) return MatchStatus.WON; 
    }

    function changeStatus(bytes32 newStatus) public {
        status = convertStringToMatchStatus(newStatus);
    }

    function getStatus() public view returns(bytes32) {
        return convertMatchStatusToString(status);
    }
     
    function setMatchResult(uint32 _winner, uint8 _winningScore, uint8 _losingScore, uint8 _drawScore) public {
        require(status == MatchStatus.CLOSED, "Match should be pending");
        winner = _winner;
        if (winner == player1.id()) {
            loser = player2.id();
        } else {
            loser = player1.id();
        }
        winningScore = _winningScore;
        losingScore = _losingScore;
        drawScore = _drawScore;
        status = MatchStatus.WON;
    } 

    // function getWinner() public view returns (uint32) {
    //     return winner;
    // }   
}
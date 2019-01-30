const BettingFactory = artifacts.require('BettingFactory');
const Player = artifacts.require('Player');

const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract('BettingFactory', (accounts) => {

    let bettingFactory;
    const owner = accounts[0];

    beforeEach(async () => {
        bettingFactory = await BettingFactory.new({from: owner});
    });

    afterEach(async () => {
        await bettingFactory.kill({from: owner});
    });


    it("should able to create Players", async () => { 
        await bettingFactory.createPlayer(convertToUtf8Bytes("Hulk Hogan"));
        await bettingFactory.createPlayer(convertToUtf8Bytes("John Cena"));
        const players = await bettingFactory.getPlayers();
        //console.log(players);
        assert.equal(players.length, 2, "Players should have 2 members."); 
    });

    it("should able to create a Player and get the details ", async () => { 
        await bettingFactory.createPlayer(convertToUtf8Bytes("Hulk Hogan")); 
        const players = await bettingFactory.getPlayers();
        console.log(players[0]);
        assert.equal(players.length, 1, "Players should have 1 member."); 
       
        // const player = Player.at(players[0]);  DOESN'T WORK
        //console.log(players); 
        
        const player = await bettingFactory.getPlayer(players[0]);
        let name = web3.utils.toUtf8(player.name);
         
        //const player = await bettingFactory.playersTable(players[0]);
        //console.log("+++ player name: ",web3.toUtf8(name));

        assert.equal(player.id.toNumber(), 1, "Player id should be 1.");
        assert.equal(name.trim(), "Hulk Hogan", "Player name should be 'Hulk Hogan' not " + web3.utils.toUtf8(player.name));
         
    });
 


 
    // it("add two candidates and assert events", async () => {
    //     let tx = await election.addCandidate("Donald Trump");
    //     truffleAssert.eventEmitted(tx, 'candidateAdded', (ev) => {
    //         console.log("\t[1] candidateAdded event id", ev.candidateId.toNumber());
    //         console.log("\t[1] candidateAdded event name", ev.name );
    //         return ev.name  === "Donald Trump";
    //     }, "Candidate name should be Donald Trump");   
        
    //     tx = await election.addCandidate("Hilary Clinton");
    //     truffleAssert.eventEmitted(tx, 'candidateAdded', (ev) => {
    //         console.log("\t[1] candidateAdded event id", ev.candidateId.toNumber());
    //         console.log("\t[1] candidateAdded event name", ev.name );
    //         return ev.name  === "Hilary Clinton";
    //     }, "Candidate name should be Hilary Clinton");  

    //     tx = await election.vote(1, {from: accounts[0]} );
    //     truffleAssert.eventEmitted(tx, 'votedEvent', (ev) => {
    //         console.log("\t[1] votedEvent event voter", ev.voter);
    //         console.log("\t[1] votedEvent event candidateId", ev.candidateId.toNumber() );
    //         return ev.candidateId.toNumber()  === 1;
    //     }, "Should voted for candidate 1");

    //     tx = await election.vote(2, {from: accounts[1]} );
    //     truffleAssert.eventEmitted(tx, 'votedEvent', (ev) => {
    //         console.log("\t[1] votedEvent event voter", ev.voter);
    //         console.log("\t[1] votedEvent event candidateId", ev.candidateId.toNumber() );
    //         return ev.candidateId.toNumber()  === 2;
    //     }, "Should voted for candidate 2");

    //     //tx = await election.vote(1, {from: accounts[0]} );
    //     // await truffleAssert.fails(
    //     //     election.vote(1, {from: accounts[0]} ),
    //     //     truffleAssert.ErrorType.REVERT,
    //     //     "Voter cannot vote more than once."
    //     // ); 

    //     await truffleAssert.fails(election.vote(1, {from: accounts[0]} ) );
            
    // });

});    

function convertToUtf8Bytes(value) {
    let myBuffer = [];
    let str = value;
    //let buffer = new Buffer(str, 'utf16le');
    let buffer = new Buffer(str, 'utf8');
    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }
    return myBuffer;
}
const BettingFactory = artifacts.require('BettingFactory');
const Match = artifacts.require('Match');

const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract('BettingFactory', (accounts) => {

    let bettingFactory;
    let PLAYER_1;
    let PLAYER_2;
    let PLAYER_3;
    let PLAYER_4;

    const owner = accounts[0];

    beforeEach(async () => {
        bettingFactory = await BettingFactory.new({from: owner});
        await bettingFactory.createPlayer("Hulk Hogan");
        await bettingFactory.createPlayer("John Cena");
        await bettingFactory.createPlayer("Jake The Snake");
        await bettingFactory.createPlayer("The Undertaker");
        const players = await bettingFactory.getPlayers();
        PLAYER_1 = players[0];
        PLAYER_2 = players[1];
        PLAYER_3 = players[2];
        PLAYER_4 = players[3];
    });

    afterEach(async () => {
        await bettingFactory.kill({from: owner});
    });


    it("should able to create Matches", async () => { 
        await bettingFactory.createMatch("Hulk Hogan vs. John Cena", PLAYER_1, PLAYER_2);
       
        const matches = await bettingFactory.getMatches();
        console.log(matches);
        assert.equal(matches.length, 1, "Matches list should have a size of 1."); 
    });
 

});    
const BettingFactory = artifacts.require('BettingFactory');
const Match = artifacts.require('Match');
const Betting = artifacts.require('Betting');

const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

const { convertToUtf8Bytes }  = require('./utils');

contract('BettingFactory', (accounts) => {

    let bettingFactory;
    let PLAYER_HULK_HOGAN_ADDR;
    let PLAYER_JOHN_CENA_ADDR;
    let PLAYER_JAKE_THE_SNAKE_ADDR;
    let PLAYER_THE_UNDERTAKER_ADDR;
    let PLAYER_HULK_HOGAN_ID;
    let PLAYER_JOHN_CENA_ID;
    let PLAYER_JAKE_THE_SNAKE_ID;
    let PLAYER_THE_UNDERTAKER_ID; 

    const owner = accounts[0];

    beforeEach(async () => {
        bettingFactory = await BettingFactory.new({from: owner});
        await bettingFactory.createPlayer(convertToUtf8Bytes("Hulk Hogan"));
        await bettingFactory.createPlayer(convertToUtf8Bytes("John Cena"));
        await bettingFactory.createPlayer(convertToUtf8Bytes("Jake The Snake"));
        await bettingFactory.createPlayer(convertToUtf8Bytes("The Undertaker"));
        const players = await bettingFactory.getPlayers();
        //console.log(players);

        const ID_FLD = 0;
        const NAME_FLD = 1; 
        let PLAYER_HULK_HOGAN_NAME;
        let PLAYER_JOHN_CENA_NAME;
        let PLAYER_JAKE_THE_SNAKE_NAME;
        let PLAYER_THE_UNDERTAKER_NAME;

        PLAYER_HULK_HOGAN_ID = (await bettingFactory.getPlayer(players[0]) )[ID_FLD].toNumber(); 
        assert.equal(PLAYER_HULK_HOGAN_ID, 1, "Player ID should be 1");
        PLAYER_HULK_HOGAN_NAME = (await bettingFactory.getPlayer(players[0]) )[NAME_FLD]; 
        assert.equal(web3.utils.toUtf8(PLAYER_HULK_HOGAN_NAME), "Hulk Hogan", "Player name should be Hulk Hogan");
        
        PLAYER_JOHN_CENA_ID = (await bettingFactory.getPlayer(players[1]) )[ID_FLD].toNumber();
        assert.equal(PLAYER_JOHN_CENA_ID, 2, "Player ID should be 2");
        PLAYER_JOHN_CENA_NAME = (await bettingFactory.getPlayer(players[1]) )[NAME_FLD]; 
        assert.equal(web3.utils.toUtf8(PLAYER_JOHN_CENA_NAME), "John Cena", "Player name should be John Cena");

        PLAYER_JAKE_THE_SNAKE_ID = (await bettingFactory.getPlayer(players[2]) )[ID_FLD].toNumber();
        assert.equal(PLAYER_JAKE_THE_SNAKE_ID, 3, "Player ID should be 3");
        PLAYER_JAKE_THE_SNAKE_NAME = (await bettingFactory.getPlayer(players[2]) )[NAME_FLD]; 
        assert.equal(web3.utils.toUtf8(PLAYER_JAKE_THE_SNAKE_NAME), "Jake The Snake", "Player name should be Jake The Snake");

        PLAYER_THE_UNDERTAKER_ID = (await bettingFactory.getPlayer(players[3]) )[ID_FLD].toNumber();
        assert.equal(PLAYER_THE_UNDERTAKER_ID, 4, "Player ID should be 4"); 
        PLAYER_THE_UNDERTAKER_NAME = (await bettingFactory.getPlayer(players[3]) )[NAME_FLD]; 
        assert.equal(web3.utils.toUtf8(PLAYER_THE_UNDERTAKER_NAME), "The Undertaker", "Player name should be The Undertaker");

        PLAYER_HULK_HOGAN_ADDR = players[0];
        PLAYER_JOHN_CENA_ADDR = players[1];
        PLAYER_JAKE_THE_SNAKE_ADDR = players[2];
        PLAYER_THE_UNDERTAKER_ADDR = players[3];
    });

    afterEach(async () => {
        await bettingFactory.kill({from: owner});

    });


    it("should able to create Matches", async () => { 
        await bettingFactory.createMatch(convertToUtf8Bytes("Hulk Hogan vs. John Cena"), PLAYER_HULK_HOGAN_ADDR, PLAYER_JOHN_CENA_ADDR, {from: owner});
        await bettingFactory.createMatch(convertToUtf8Bytes("Jake The Snake vs. The Undertaker"), PLAYER_JAKE_THE_SNAKE_ADDR, PLAYER_THE_UNDERTAKER_ADDR, {from: owner});
        await bettingFactory.createMatch(convertToUtf8Bytes("Hulk Hogan vs. The Undertaker"), PLAYER_HULK_HOGAN_ADDR, PLAYER_THE_UNDERTAKER_ADDR, {from: owner});
        await bettingFactory.createMatch(convertToUtf8Bytes("John Cena vs. Jake The Snake"), PLAYER_JOHN_CENA_ADDR, PLAYER_JAKE_THE_SNAKE_ADDR, {from: owner});
 
        const matches = await bettingFactory.getMatches();

        //console.log(matches);

        const MATCH_ID = 0;
        const MATCH_DESCRIPTION = 1;
        const PLAYER_1_ID = 2;
        const PLAYER_2_ID = 3;

        const match_1 = await bettingFactory.getMatch(matches[0]); 

        assert.equal(match_1[MATCH_ID].toNumber(), 1, "Match ID should be 1.");
        assert.equal(web3.utils.toUtf8 (match_1[MATCH_DESCRIPTION]), "Hulk Hogan vs. John Cena", "Description should be 'Hulk Hogan vs. John Cena'");
        assert.equal(match_1[PLAYER_1_ID].toNumber(), PLAYER_HULK_HOGAN_ID, "Player 1 ID should be " + PLAYER_HULK_HOGAN_ID);
        assert.equal(match_1[PLAYER_2_ID].toNumber(), PLAYER_JOHN_CENA_ID, "Player 2 ID should be " + PLAYER_JOHN_CENA_ID);
        
        const match_2 = await bettingFactory.getMatch(matches[3]);        
        assert.equal(match_2[MATCH_ID].toNumber(), 4, "Match ID should be 4.");
        assert.equal(web3.utils.toUtf8 (match_2[MATCH_DESCRIPTION]), "John Cena vs. Jake The Snake", "Description should be 'John Cena vs. Jake The Snake'");
        assert.equal(match_2[PLAYER_1_ID].toNumber(), PLAYER_JOHN_CENA_ID, "Player 1 ID should be " + PLAYER_JOHN_CENA_ID);
        assert.equal(match_2[PLAYER_2_ID].toNumber(), PLAYER_JAKE_THE_SNAKE_ID, "Player 2 ID should be " + PLAYER_JAKE_THE_SNAKE_ID);
    });
 
    it("should be able to create match betting.", async () => { 
        await bettingFactory.createMatch(convertToUtf8Bytes("Hulk Hogan vs. John Cena"), PLAYER_HULK_HOGAN_ADDR, PLAYER_JOHN_CENA_ADDR);  
        const matches = await bettingFactory.getMatches();
        
        const ID_FLD= 0;        
        const DESCRIPTN_FLD = 1;
        const PLAYER_1_ID_FLD = 2;
        const PLAYER_2_ID_FLD = 3;

        // const match_1 = await bettingFactory.getMatch(matches[0]); 
        // console.log(match_1);
        // console.log(match_1[0]);
        // assert.equal(match_1[ID_FLD].toNumber(), 1, "Match ID should be 1.");
        // assert.equal(web3.utils.toUtf8 (match_1[DESCRIPTN_FLD]), "Hulk Hogan vs. John Cena", "Description should be 'Hulk Hogan vs. John Cena'");
        // assert.equal(match_1[PLAYER_1_ID_FLD].toNumber(), PLAYER_HULK_HOGAN_ID, "Player 1 ID should be " + PLAYER_HULK_HOGAN_ID);
        // assert.equal(match_1[PLAYER_2_ID_FLD].toNumber(), PLAYER_JOHN_CENA_ID, "Player 2 ID should be " + PLAYER_JOHN_CENA_ID);

        await bettingFactory.createBetting(matches[0],{from: owner});

        const bettingAddrs = await bettingFactory.getBettings(); 
        //console.log(bettingAddrs);

        const betting = await bettingFactory.getBetting(bettingAddrs[0]); 
         
        assert.equal(betting[0].toNumber(), 1, "Betting ID should be 1.");
        assert.equal(betting[1].toNumber(), 1, "Match ID should be 1.");
        assert.equal(web3.utils.toUtf8(betting[2]), "Hulk Hogan vs. John Cena", "Match description should be 'Hulk Hogan vs. John Cena'");
        assert.equal(betting[3].toNumber(), 1, "Player 1 ID should be 1.");
        assert.equal(betting[4].toNumber(), 2, "Player 2 ID should be 2."); 
    });    

    it("should be able to place a bet.", async () => { 
        await bettingFactory.createMatch(convertToUtf8Bytes("Hulk Hogan vs. John Cena"), PLAYER_HULK_HOGAN_ADDR, PLAYER_JOHN_CENA_ADDR);  
        const matches = await bettingFactory.getMatches(); 

        await bettingFactory.createBetting(matches[0],{from: owner});

        const bettingAddrs = await bettingFactory.getBettings();  

        console.log("++++ bettingAddrs:", bettingAddrs);


        const betting = await bettingFactory.getBetting(bettingAddrs[0]); 
         
        // assert.equal(betting[0].toNumber(), 1, "Betting ID should be 1.");
        // assert.equal(betting[1].toNumber(), 1, "Match ID should be 1.");
        // assert.equal(web3.utils.toUtf8(betting[2]), "Hulk Hogan vs. John Cena", "Match description should be 'Hulk Hogan vs. John Cena'");
        // assert.equal(betting[3].toNumber(), 1, "Player 1 ID should be 1.");
        // assert.equal(betting[4].toNumber(), 2, "Player 2 ID should be 2."); 

        const TOTAL_BET_AMOUNT_FLD = 0;
        const TOTAL_PLAYER_1_BET_AMOUNT = 1;
        const TOTAL_PLAYER_2_BET_AMOUNT = 2;

        //await bettingFactory.bet(bettingAddrs, PLAYER_HULK_HOGAN_ID, {from: accounts[1], value: 200});
        // await bettingFactory.bet(bettingAddrs, PLAYER_JOHN_CENA_ID, {from: accounts[2], value: 300});
       
        // const totalBetAmounts = await bettingFactory.totalBetAmount(bettingAddrs);
       
        // assert.equal(totalBetAmounts[TOTAL_BET_AMOUNT_FLD].toNumber(), 500, "Betting total amount should be 500.");
        // assert.equal(totalBetAmounts[TOTAL_PLAYER_1_BET_AMOUNT].toNumber(), 200, "Player 1 total bet should be 200.");
        // assert.equal(totalBetAmounts[TOTAL_PLAYER_2_BET_AMOUNT].toNumber(), 300, "Player 2 total bet should be 300.");
    });


    // it("should be able pay winning bets.", async () => { 
    //     await bettingFactory.createMatch(convertToUtf8Bytes("Hulk Hogan vs. John Cena"), PLAYER_HULK_HOGAN_ADDR, PLAYER_JOHN_CENA_ADDR);  
    //     const matches = await bettingFactory.getMatches(); 

    //     await bettingFactory.createBetting(matches[0],{from: owner});

    //     const bettingAddrs = await bettingFactory.getBettings(); 

    //     const TOTAL_BET_AMOUNT_FLD = 0;
    //     const TOTAL_PLAYER_1_BET_AMOUNT = 1;
    //     const TOTAL_PLAYER_2_BET_AMOUNT = 2;

    //     await bettingFactory.bet(bettingAddrs, PLAYER_HULK_HOGAN_ID, {from: accounts[1], value: 200});
    //     await bettingFactory.bet(bettingAddrs, PLAYER_JOHN_CENA_ID, {from: accounts[2], value: 300});
       
    //     const totalBetAmounts = await bettingFactory.totalBetAmount(bettingAddrs);
       
    //     assert.equal(totalBetAmounts[TOTAL_BET_AMOUNT_FLD].toNumber(), 500, "Betting total amount should be 500.");
    //     assert.equal(totalBetAmounts[TOTAL_PLAYER_1_BET_AMOUNT].toNumber(), 200, "Player 1 total bet should be 200.");
    //     assert.equal(totalBetAmounts[TOTAL_PLAYER_2_BET_AMOUNT].toNumber(), 300, "Player 2 total bet should be 300.");

    //     await bettingFactory.totalBetAmount(bettingAddrs)
    // });    
});    


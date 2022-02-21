// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EPrediction{
    struct Predictor {
        uint ammount;
        bool vote;
    }

    event Wagered(address indexed predictor, uint _ammount, bool vote);
    event AddedUserToWhitelist(address user);

    // user / Predictor
    mapping(address => Predictor) public predictors;
    // User / boolean (is white listed)
    mapping(address => bool) public whitelist;

    address[] public participants;
    address creator;
    bool public predictionClosed;
    bool public predictionEnded;
    string public condition;
    uint public totalVotesVoteTrue;
    uint public totalVotesVoteFalse;
    uint public totalAmmountVoteTrue;
    uint public totalAmmountVoteFalse;


    constructor(bool _predictionClosed, string memory _condition, address _creator, address[] memory _whitelist) {
        predictionClosed = _predictionClosed;
        condition = _condition;
        creator = _creator;

        if(predictionClosed){
            for(uint i = 0; i < _whitelist.length; i++){
                whitelist[_whitelist[i]] = true;
            }
        }
    }

    modifier onlyCreator() {
        require(msg.sender == creator);
        _;
    }


    function vote(bool userVote) public payable {
        require(predictionClosed && whitelist[msg.sender], "you cannot participate in this prediction");
        // Otherwise we can get the right percentage number
        require((predictors[msg.sender].ammount + msg.value) * 100 > totalAmmountVoteTrue && (predictors[msg.sender].ammount + msg.value)> totalAmmountVoteFalse, 'the max betting size has been reached');

        predictors[msg.sender] = Predictor(msg.value, userVote);
        participants.push(msg.sender);

        if(userVote){
            totalVotesVoteTrue++;
            totalAmmountVoteTrue += msg.value;
        }
        else{
            totalVotesVoteFalse++;
            totalAmmountVoteFalse += msg.value;
        }

        emit Wagered(msg.sender, msg.value, userVote);
    }

    function endPrediction(bool winner) public onlyCreator {
        require(predictionEnded == false, "this prediction has already ended");

        for(uint i = 0; i < participants.length; i++){
            if(winner == predictors[participants[i]].vote){
                uint percentageOfTotal = (predictors[participants[i]].ammount * 100) /  (winner ? totalAmmountVoteTrue : totalAmmountVoteFalse);
                uint winValue = ((winner ? totalAmmountVoteFalse : totalAmmountVoteTrue) / 100) * percentageOfTotal;
                predictors[participants[i]].ammount += winValue;
            }
            else{
                predictors[participants[i]].ammount = 0;
            }
        }
        predictionEnded = true;
    }

    function claimAmmount() public {
        require(predictionEnded, "this prediciton has not endet");
        require((predictors[msg.sender]).ammount != 0, "you have no ammount in this prediction");

        uint ammount = predictors[msg.sender].ammount;
        predictors[msg.sender].ammount = 0;
        payable(msg.sender).transfer(ammount);
    }

    function addAddressToWhitelist(address user) public onlyCreator{
        require(predictionClosed, "this is a public prediction");

        whitelist[user] = true;
        emit AddedUserToWhitelist(user);
    }
}
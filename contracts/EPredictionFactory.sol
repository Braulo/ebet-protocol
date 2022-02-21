// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './EPrediction.sol';

contract EPredictionFactory{

    event CreatedPrediction(EPrediction prediction);
    EPrediction[] public allPredictions;

    // User / All User Predictions
    mapping(address => EPrediction[]) public userPredictions;

    function createPrediction(bool predictionClosed, string memory condition, address[] memory whitelist) public {
        EPrediction prediction = new EPrediction(predictionClosed, condition, msg.sender, whitelist);
        allPredictions.push(prediction);

        emit CreatedPrediction(prediction);
    }

    function getAllPredictions() external view returns(EPrediction[] memory){
        return allPredictions;
    }

}
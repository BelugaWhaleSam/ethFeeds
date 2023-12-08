// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;
/**
 * @title Feeback Contract
 * @dev Store & retrieve value in a variable
 */
contract Feeds {

    event AddFeedback(address recipient, uint feedbackId, string role, string Name, string email, string feedback);

    struct FeedbackStruct {
        uint id;
        address username;
        string role;
        string Name;
        string email;
        string feedback;
    }

    FeedbackStruct[] private feedbackArray;

    // Mapping of Feed id to the wallet address of the user
    mapping(uint256 => address) feedbackToOwner;

    // Method to be called by our frontend when trying to add a new Feedback
    function addFeedback(string memory role,string memory Name,string memory email,string memory feedback) external {
        uint feedbackId = feedbackArray.length;
        feedbackArray.push(FeedbackStruct(feedbackId, msg.sender, role, Name, email, feedback));
        feedbackToOwner[feedbackId] = msg.sender;
        emit AddFeedback(msg.sender, feedbackId, role, Name, email, feedback);
    }

    // Method to get all the Feedback
    function getAllFeedback() external view returns (FeedbackStruct[] memory) {
        FeedbackStruct[] memory temporary = new FeedbackStruct[](feedbackArray.length);
        uint counter = 0;
        for(uint i=0; i<feedbackArray.length; i++) {
                temporary[counter] = feedbackArray[i];
                counter++;
        }

        FeedbackStruct[] memory result = new FeedbackStruct[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

}

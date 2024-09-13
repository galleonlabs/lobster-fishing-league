// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract MockVRFCoordinatorV2 is VRFCoordinatorV2Interface {
    struct Request {
        address sender;
        uint256 subId;
        bytes32 keyHash;
        uint32 callbackGasLimit;
        uint32 numWords;
    }

    Request[] public requests;

    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 minimumRequestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external override returns (uint256 requestId) {
        requests.push(Request(msg.sender, subId, keyHash, callbackGasLimit, numWords));
        return requests.length;
    }

    function fulfillRandomWords(uint256 requestId, address consumerContract, uint256[] memory randomWords) external {
        VRFConsumerBaseV2(consumerContract).rawFulfillRandomWords(requestId, randomWords);
    }

    function getRequests() external view returns (Request[] memory) {
        return requests;
    }

    // Implement other required functions...
    function getRequestConfig() external pure override returns (uint16, uint32, bytes32[] memory) {
        revert("Not implemented");
    }

    function createSubscription() external pure override returns (uint64 subId) {
        revert("Not implemented");
    }

    function getSubscription(uint64 subId) external pure override returns (uint96 balance, uint64 reqCount, address owner, address[] memory consumers) {
        revert("Not implemented");
    }
    function acceptSubscriptionOwnerTransfer(uint64 subId) external {
        revert("Not implemented");
    }

    function addConsumer(uint64 subId, address consumer) external {
      revert("Not implemented");
    }

    function cancelSubscription(uint64 subId, address to) external {
        revert("Not implemented");
    }

    function pendingRequestExists(uint64 subId) external view returns (bool) {
        revert("Not implemented");
    }

    function removeConsumer(uint64 subId, address consumer) external {
         revert("Not implemented");
    }

    function requestSubscriptionOwnerTransfer(uint64 subId, address newOwner) external {
         revert("Not implemented");
    }

}
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // People public person01 = People({favoriteNumber: 2, name: "John"});
    // People public person02 = People({favoriteNumber: 3, name: "Jane"});

    People[] public people;

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        // people.push(People({favoriteNumber: _favoriteNumber, name: _name}));
        people.push(People(_favoriteNumber, _name));
    }
}

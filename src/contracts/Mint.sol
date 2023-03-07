    // SPDX-License-Identifier: MIT
    // Deployed on Fantom Testnet : 0xA4CCEb9e84b9682ca559AA41DB57f4BECe586dc5
    pragma solidity ^0.8.9;

    import "@openzeppelin/contracts@4.8.1/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts@4.8.1/token/ERC721/extensions/ERC721URIStorage.sol";
    import "@openzeppelin/contracts@4.8.1/access/Ownable.sol";
    import "@openzeppelin/contracts@4.8.1/utils/Counters.sol";

    contract AIMint is ERC721, ERC721URIStorage, Ownable {
        using Counters for Counters.Counter;

        Counters.Counter private _tokenIdCounter;

        constructor() ERC721("AI Mint", "AIMNT") {}

        function safeMint(address to, string memory uri) public {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uri);
        }

        // The following functions are overrides required by Solidity.

        function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
            super._burn(tokenId);
        }

        function tokenURI(uint256 tokenId)
            public
            view
            override(ERC721, ERC721URIStorage)
            returns (string memory)
        {
            return super.tokenURI(tokenId);
        }
    }
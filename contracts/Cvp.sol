// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Cvp {
    address payable owner;

    struct Student {
        address studentAdd;
        string name;
        string studentId;
        string emailId;
        string mobileNo;
    }

    struct CollegeStaff {
        address staffAdd;
        string department;
        uint256 level;
        string name;
        string emailId;
    }

    struct Request {
        uint256 reqId; // 0 =no request created in case of multiple docuemtn issued in one go
        address studentAdd;
        string docName;
        string description;
        uint256 level;
        string reqType;
        uint256 initTime;
        uint256 closeTime;
        uint256 status; // 1 = ongoing 0=successfully closed 2=rejected
        address issuer1;
        address issuer2;
        string department;
        string comment;
    }

    struct Document {
        uint256 docId;
        string docName;
        string description;
        address studentAdd;
        address issuer2;
        uint256 reqId;
        string ipfsCID;
        string department;
    }

    // Counts
    uint256 studentsCount;
    uint256 documentsCount;
    uint256 requestCount = 1;
    uint256 collegeStaffCount;

    // Mappings
    mapping(uint256 => Student) studentsMapping;
    mapping(uint256 => Document) documentsMapping;
    mapping(uint256 => Request) requestsMapping;
    mapping(uint256 => CollegeStaff) collegeStaffsMapping;

    mapping(address => uint256) collegeStaffAddressToIDMapping;
    mapping(string => uint256) studentsEmailToIdMapping;

    receive() external payable {}

    constructor() {
        owner = payable(msg.sender);
    }

    function registerStudent(
        string memory name,
        string memory studentId,
        string memory emailId,
        string memory mobileNo
    ) public {
        studentsMapping[studentsCount] = Student(
            msg.sender,
            name,
            studentId,
            emailId,
            mobileNo
        );

        studentsEmailToIdMapping[emailId] = studentsCount;
        studentsCount += 1;
    }

    function registerStaff(
        string memory name,
        string memory department,
        string memory emailId,
        uint256 level
    ) public {
        collegeStaffsMapping[collegeStaffCount] = CollegeStaff(
            msg.sender,
            department,
            level,
            name,
            emailId
        );
        collegeStaffAddressToIDMapping[msg.sender] = collegeStaffCount;
        collegeStaffCount += 1;
    }

    function requestDocument(
        string memory docName,
        string memory description,
        string memory reqType,
        string memory department
    ) public payable {
        require(
            keccak256(abi.encodePacked(docName)) ==
                keccak256(abi.encodePacked("Academic Transcript")) &&
                msg.value >= 1 ether
        );
        owner.transfer(msg.value);

        requestsMapping[requestCount] = Request({
            reqId: requestCount,
            studentAdd: msg.sender,
            docName: docName,
            description: description,
            level: 1,
            reqType: reqType,
            issuer1: payable(address(0)),
            issuer2: payable(address(0)),
            initTime: block.timestamp,
            closeTime: 0,
            status: 1,
            department: department,
            comment: ""
        });
        requestCount += 1;
    }

    function fetchAllRequestsForStudent()
        public
        view
        returns (Request[] memory)
    {
        uint256 itemCount;
        for (uint256 i = 0; i < requestCount; i++) {
            if (requestsMapping[i].studentAdd == msg.sender) {
                itemCount += 1;
            }
        }

        Request[] memory result = new Request[](itemCount);
        itemCount = 0;

        for (uint256 i = 0; i < requestCount; i++) {
            if (requestsMapping[i].studentAdd == msg.sender) {
                Request storage newItem = requestsMapping[i];
                result[itemCount] = newItem;
                itemCount += 1;
            }
        }

        return result;
    }

    function fetchIndividualRequest(
        uint256 reqId
    ) public view returns (Request memory) {
        return requestsMapping[reqId];
    }

    function fetchAllDocumentsForStudent()
        public
        view
        returns (Document[] memory)
    {
        uint256 itemCount;
        for (uint256 i = 0; i < documentsCount; i++) {
            if (documentsMapping[i].studentAdd == msg.sender) {
                itemCount += 1;
            }
        }

        Document[] memory result = new Document[](itemCount);
        itemCount = 0;

        for (uint256 i = 0; i < documentsCount; i++) {
            if (documentsMapping[i].studentAdd == msg.sender) {
                Document storage newItem = documentsMapping[i];
                result[itemCount] = newItem;
                itemCount += 1;
            }
        }

        return result;
    }

    function fetchIndividualDocumentForStudent(
        uint256 docID
    ) public view returns (Document memory) {
        return documentsMapping[docID];
    }

    // College staff functions
    function fetchAllRequestsForCollegeStaff()
        public
        view
        returns (Request[] memory)
    {
        uint256 staffId = collegeStaffAddressToIDMapping[msg.sender];
        uint256 itemCount;

        for (uint256 i = 0; i < requestCount; i++) {
            if (
                requestsMapping[i].level ==
                collegeStaffsMapping[staffId].level &&
                requestsMapping[i].status == 1 &&
                keccak256(abi.encodePacked((requestsMapping[i].department))) ==
                keccak256(
                    abi.encodePacked((collegeStaffsMapping[staffId].department))
                )
            ) {
                itemCount += 1;
            }
        }

        Request[] memory result = new Request[](itemCount);
        itemCount = 0;

        for (uint256 i = 0; i < requestCount; i++) {
            if (
                requestsMapping[i].level ==
                collegeStaffsMapping[staffId].level &&
                requestsMapping[i].status == 1 &&
                keccak256(abi.encodePacked((requestsMapping[i].department))) ==
                keccak256(
                    abi.encodePacked((collegeStaffsMapping[staffId].department))
                )
            ) {
                Request storage newItem = requestsMapping[i];
                result[itemCount] = newItem;
                itemCount += 1;
            }
        }

        return result;
    }

    function rejectRequest(uint256 reqId, string memory comment) public {
        requestsMapping[reqId].status = 2;
        requestsMapping[reqId].issuer1 = msg.sender;
        requestsMapping[reqId].issuer2 = msg.sender;
        requestsMapping[reqId].comment = comment;
    }

    function updateRequest(uint256 reqId, string memory comment) public {
        requestsMapping[reqId].issuer1 = msg.sender;
        requestsMapping[reqId].comment = comment;
        requestsMapping[reqId].level = 2;
    }

    function issueDocument(uint256 reqId, string memory ipfsCID) public {
        documentsMapping[documentsCount] = Document({
            docId: documentsCount,
            docName: requestsMapping[reqId].docName,
            description: requestsMapping[reqId].description,
            studentAdd: requestsMapping[reqId].studentAdd,
            issuer2: msg.sender,
            reqId: reqId,
            ipfsCID: ipfsCID,
            department: requestsMapping[reqId].department
        });

        requestsMapping[reqId].issuer2 = msg.sender;
        requestsMapping[reqId].status = 0;
    }

    function issueMultipleDocument(
        string[] memory cidArr,
        string memory docName,
        string memory description,
        string[] memory emails
    ) public {
        for (uint256 i = 0; i < cidArr.length; i++) {
            documentsMapping[documentsCount] = Document({
                docId: documentsCount,
                docName: docName,
                description: description,
                studentAdd: studentsMapping[studentsEmailToIdMapping[emails[i]]]
                    .studentAdd,
                issuer2: msg.sender,
                reqId: 0,
                ipfsCID: cidArr[i],
                department: collegeStaffsMapping[
                    collegeStaffAddressToIDMapping[msg.sender]
                ].department
            });

            documentsCount += 1;
        }
    }

    function verifyDocument(
        string memory cid
    ) public payable returns (Document memory) {
        require(msg.value >= 1 ether);
        owner.transfer(msg.value);
        for (uint256 i = 0; i < documentsCount; i++) {
            if (
                keccak256(abi.encodePacked(documentsMapping[i].ipfsCID)) ==
                keccak256(abi.encodePacked(cid))
            ) {
                return documentsMapping[i];
            }
        }
        revert("Not found");
    }
}

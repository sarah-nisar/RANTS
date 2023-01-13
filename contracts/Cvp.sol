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

    struct IPFSFile {
        string cid;
        string fileName;
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
        uint256 docId;
        string docName;
        string description;
        uint256 level;
        string reqType;
        uint256 initTime;
        uint256 closeTime;
        uint256 status; // 1 = ongoing 0=successfully closed 2=rejected
        // address issuer1;
        address issuer2;
        string department;
        // IPFSFile[] referenceFiles;
        string comment;
    }

    struct Document {
        uint256 docId; // 0 =no request created in case of multiple docuemtn issued in one go
        string docName;
        string description;
        address studentAdd;
        address issuer2;
        uint256 reqId;
        IPFSFile file;
        // string ipfsCID;
        string token;
        string department;
    }

    // Counts
    uint256 studentsCount;
    uint256 documentsCount = 1;
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
        collegeStaffsMapping[collegeStaffCount] = CollegeStaff(
            msg.sender,
            "College",
            2,
            "VJTI",
            "vjti@vjti.in"
        );
        collegeStaffAddressToIDMapping[msg.sender] = collegeStaffCount;
        collegeStaffCount += 1;
    }

    function isOwner() public view returns (bool) {
        return owner == msg.sender;
    }

    function registerStudent(
        address studentAdd,
        string memory name,
        string memory studentId,
        string memory emailId,
        string memory mobileNo
    ) public {
        studentsMapping[studentsCount] = Student(
            studentAdd,
            name,
            studentId,
            emailId,
            mobileNo
        );

        studentsEmailToIdMapping[emailId] = studentsCount;
        studentsCount += 1;
    }

    function registerStaff(
        address staffAdd,
        string memory name,
        string memory department,
        string memory emailId,
        uint256 level
    ) public {
        collegeStaffsMapping[collegeStaffCount] = CollegeStaff(
            staffAdd,
            department,
            level,
            name,
            emailId
        );
        collegeStaffAddressToIDMapping[staffAdd] = collegeStaffCount;
        collegeStaffCount += 1;
    }

    function fetchStudentByAddress(
        address studentAdd
    ) public view returns (Student memory) {
        for (uint256 i = 0; i < studentsCount; i++) {
            if (studentsMapping[i].studentAdd == studentAdd) {
                return studentsMapping[i];
            }
        }
        revert();
    }

    function fetchCollegeStaffByAddress(
        address staffAdd
    ) public view returns (CollegeStaff memory) {
        for (uint256 i = 0; i < collegeStaffCount; i++) {
            if (collegeStaffsMapping[i].staffAdd == staffAdd) {
                return collegeStaffsMapping[i];
            }
        }
        revert();
    }

    function fetchAllStaffMembers()
        public
        view
        returns (CollegeStaff[] memory)
    {
        CollegeStaff[] memory result = new CollegeStaff[](collegeStaffCount);

        for (uint256 i = 0; i < collegeStaffCount; i++) {
            CollegeStaff storage newStaffMember = collegeStaffsMapping[i];
            result[i] = newStaffMember;
        }
        return result;
    }

    function fetchAllStudents() public view returns (Student[] memory) {
        Student[] memory result = new Student[](studentsCount);

        for (uint256 i = 0; i < studentsCount; i++) {
            Student storage newStudent = studentsMapping[i];
            result[i] = newStudent;
        }
        return result;
    }

    function requestDocument(
        address studentAdd,
        string memory docName,
        string memory description,
        string memory reqType,
        string memory department
    ) public payable {
        // if (
        //     keccak256(abi.encodePacked(docName)) ==
        //     keccak256(abi.encodePacked("Academic Transcript"))
        // ) {
        //     require(msg.value >= 1 ether);
        // }
        owner.transfer(msg.value);

        // IPFSFile[] memory files = new IPFSFile[](0);

        requestsMapping[requestCount] = Request({
            reqId: requestCount,
            studentAdd: studentAdd,
            docName: docName,
            description: description,
            level: 2, //TODo:For timebieng humne ye rakha hai baad mai change karna hai
            reqType: reqType,
            // issuer1: payable(address(0)),
            issuer2: payable(address(0)),
            initTime: block.timestamp,
            closeTime: 0,
            status: 1,
            department: department,
            comment: "",
            // referenceFiles: files,
            docId: 0
        });
        requestCount += 1;
    }

    function updateRequestDocument(
        address studentAdd,
        string memory docName,
        string memory description,
        string memory reqType,
        string memory department,
        // string[] memory fileNames,
        // string[] memory cids,
        uint256 docId
    ) public payable {
        // if (
        //     keccak256(abi.encodePacked(docName)) ==
        //     keccak256(abi.encodePacked("Academic Transcript"))
        // ) {
        //     require(msg.value >= 1 ether);
        // }
        owner.transfer(msg.value);

        // IPFSFile[] memory files = new IPFSFile[](cids.length);
        // for (uint256 i = 0; i < cids.length; i++) {
        //     IPFSFile memory newFile = IPFSFile(cids[i], fileNames[i]);
        // files[i] = newFile;
        // }

        requestsMapping[requestCount] = Request({
            reqId: requestCount,
            studentAdd: studentAdd,
            docName: docName,
            description: description,
            level: 2, //TODo:For timebieng humne ye rakha hai baad mai change karna hai
            reqType: reqType,
            // issuer1: payable(address(0)),
            issuer2: payable(address(0)),
            initTime: block.timestamp,
            closeTime: 0,
            status: 1,
            department: department,
            comment: "",
            // referenceFiles: files,
            docId: docId
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
                msg.sender == owner &&
                (requestsMapping[i].level ==
                    collegeStaffsMapping[staffId].level &&
                    requestsMapping[i].status == 1 &&
                    keccak256(
                        abi.encodePacked((requestsMapping[i].department))
                    ) ==
                    keccak256(
                        abi.encodePacked(
                            (collegeStaffsMapping[staffId].department)
                        )
                    ))
            ) {
                itemCount += 1;
            }
        }

        Request[] memory result = new Request[](itemCount);
        itemCount = 0;

        for (uint256 i = 0; i < requestCount; i++) {
            if (
                msg.sender == owner &&
                (requestsMapping[i].level ==
                    collegeStaffsMapping[staffId].level &&
                    requestsMapping[i].status == 1 &&
                    keccak256(
                        abi.encodePacked((requestsMapping[i].department))
                    ) ==
                    keccak256(
                        abi.encodePacked(
                            (collegeStaffsMapping[staffId].department)
                        )
                    ))
            ) {
                Request storage newItem = requestsMapping[i];
                result[itemCount] = newItem;
                itemCount += 1;
            }
        }

        return result;
    }

    function rejectRequest(
        uint256 reqId,
        string memory comment,
        address staffAdd
    ) public {
        requestsMapping[reqId].status = 2;
        // requestsMapping[reqId].issuer1 = staffAdd;
        requestsMapping[reqId].issuer2 = staffAdd;
        requestsMapping[reqId].comment = comment;
    }

    // function updateRequest(
    //     uint256 reqId,
    //     string memory comment,
    //     address staffAdd
    // ) public {
    //     requestsMapping[reqId].issuer1 = staffAdd;
    //     requestsMapping[reqId].comment = comment;
    //     requestsMapping[reqId].level = 2;
    // }

    function issueDocument(
        uint256 reqId,
        string memory ipfsCID,
        string memory ipfsFileName,
        string memory token,
        // string memory jsonToken
        address staffAdd
    ) public {
        IPFSFile memory newFile = IPFSFile(ipfsCID, ipfsFileName);
        documentsMapping[documentsCount] = Document({
            docId: documentsCount,
            docName: requestsMapping[reqId].docName,
            description: requestsMapping[reqId].description,
            studentAdd: requestsMapping[reqId].studentAdd,
            issuer2: staffAdd,
            reqId: reqId,
            token: token,
            // ipfsCID: ipfsCID,
            department: requestsMapping[reqId].department,
            file: newFile
        });

        requestsMapping[reqId].issuer2 = staffAdd;
        requestsMapping[reqId].status = 0;
    }

    function issueMultipleDocument(
        string[] memory cidArr,
        string memory docName,
        string memory description,
        string[] memory emails,
        string[] memory fileNames,
        address staffAdd,
        string[] memory tokens
    ) public {
        for (uint256 i = 0; i < cidArr.length; i++) {
            IPFSFile memory newFile = IPFSFile(cidArr[i], fileNames[i]);
            documentsMapping[documentsCount] = Document({
                docId: documentsCount,
                docName: docName,
                description: description,
                studentAdd: studentsMapping[studentsEmailToIdMapping[emails[i]]]
                    .studentAdd,
                issuer2: staffAdd,
                reqId: 0,
                token: tokens[i],
                file: newFile,
                department: collegeStaffsMapping[
                    collegeStaffAddressToIDMapping[staffAdd]
                ].department
            });

            documentsCount += 1;
        }
    }

    function verifyDocument(
        string memory token
    ) public view returns (Document memory) {
        for (uint256 i = 0; i < documentsCount; i++) {
            if (
                keccak256(abi.encodePacked(documentsMapping[i].token)) ==
                keccak256(abi.encodePacked(token))
            ) {
                return documentsMapping[i];
            }
        }
        revert("Not found");
    }

    function payForVerification(
    ) public payable  {
        require(msg.value >= 1 ether);
        owner.transfer(msg.value);
    }
}

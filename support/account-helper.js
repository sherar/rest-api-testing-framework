module.exports = {
    hasValidAccountProperties: function (res) {
        var myArray = ["kantoxReference", "externalReference",
            "name", "owner", "ownerReference",
            "countryCode", "currencies", "bankCodeType",
            "bankCode", "accountNumberType", "accountNumber",
            "bankAccountStatus", "validationErrorCode", "validationErrorMessage"
        ]
        myArray.forEach(function (property) {
            if (!(property in res.body)) throw new Error("Missing " + property + " key");
        });
    }
};
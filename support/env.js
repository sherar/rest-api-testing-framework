module.exports = {
    apiUrl: "https://demo.kantox.com/api",
    userLoginDetails: {
        login: "apiusertest@kantox.com",
        password: "!2018abde123"
    },
    endpoints: {
        bankAccounts: "/companies/IURAER4WT/bank_accounts"
    },
    bankAccounts: {
        accountProperties: ['kantoxReference',
            'externalReference',
            'name',
            'owner',
            'ownerReference',
            'countryCode',
            'currencies',
            'bankCodeType',
            'bankCode',
            'accountNumberType',
            'accountNumber',
            'bankAccountStatus',
            'validationErrorCode',
            'validationErrorMessage'
        ],
        requiredAccountIdentifierElements: {
            belgium: {
                companyRef: "IURAER4WT",
                bankCountryCode: "BE"
            }
        },
        existingAccountDetails: {
            kantoxReference: "BA-BUV652UVB"
        },
        newAccountDetails: {
            companyRef: 'IURAER4WT',
            accountAlias: 'MyTestAccount',
            bankCountryCode: 'GB',
            bankCode: '{"bic_swift":"LOYDGB21T00"}',
            accountNumber: '{"iban":"GB04LOYD77930985984947"}',
            currencies: 'EUR',
            reference: 'AutomationTestAccount'
        }
    }
};
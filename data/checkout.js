// Centralized checkout customer information for tests

module.exports = {
    customers: {
        john: {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '12345'
        },
        jane: {
            firstName: 'Jane',
            lastName: 'Smith',
            postalCode: '54321'
        },
        alice: {
            firstName: 'Alice',
            lastName: 'Johnson',
            postalCode: 'ABCDE'
        },
        testUser: {
            firstName: 'Test',
            lastName: 'User',
            postalCode: '12345'
        }
    },
    invalid: {
        emptyFirstName: {
            firstName: '',
            lastName: 'Doe',
            postalCode: '12345'
        },
        emptyLastName: {
            firstName: 'John',
            lastName: '',
            postalCode: '12345'
        },
        emptyPostalCode: {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: ''
        },
        allEmpty: {
            firstName: '',
            lastName: '',
            postalCode: ''
        }
    }
};

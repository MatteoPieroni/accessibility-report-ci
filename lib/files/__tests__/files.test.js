let fs = require('fs');
const filesUtils = require('../index');

fs.mkdir = jest.fn();

describe('directoryExists', () => {
    afterEach(() => {
        fs = require('fs');
    })

    it('returns true if a folder exists', () => {
        fs = {
            statSync: (folder) => ({
                isFolder: (folder) => true,
            }),
        }
        expect(filesUtils.directoryExists('test-folder')).toBeTruthy();
    })
})
const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const { v4: uuid } = require('uuid');

jest.mock('uuid', () => ({ v4: jest.fn() }));

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

const ID = 'something-not-a-uuid';
const NAME = 'A sample item';

beforeEach(() => {
    jest.clearAllMocks();
    uuid.mockReturnValue(ID);
});

test('it stores item with default priority when none is provided', async () => {
    const req = { body: { name: NAME } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    const expectedItem = { id: ID, name: NAME, completed: false, priority: 'medium' };
    expect(db.storeItem).toHaveBeenCalledWith(expectedItem);
    expect(res.send).toHaveBeenCalledWith(expectedItem);
});

test('it stores item with the provided valid priority', async () => {
    const req = { body: { name: NAME, priority: 'high' } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    const expectedItem = { id: ID, name: NAME, completed: false, priority: 'high' };
    expect(db.storeItem).toHaveBeenCalledWith(expectedItem);
    expect(res.send).toHaveBeenCalledWith(expectedItem);
});

test('it defaults to medium when an invalid priority is provided', async () => {
    const req = { body: { name: NAME, priority: 'critical' } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    expect(db.storeItem).toHaveBeenCalledWith(
        expect.objectContaining({ priority: 'medium' }),
    );
});

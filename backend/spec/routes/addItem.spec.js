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

    const expectedItem = { id: ID, name: NAME, completed: false, priority: 'medium', due_date: null };
    expect(db.storeItem).toHaveBeenCalledWith(expectedItem);
    expect(res.send).toHaveBeenCalledWith(expectedItem);
});

test('it stores item with the provided valid priority', async () => {
    const req = { body: { name: NAME, priority: 'high' } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    const expectedItem = { id: ID, name: NAME, completed: false, priority: 'high', due_date: null };
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

test('it stores item with a valid due_date', async () => {
    const req = { body: { name: NAME, due_date: '2026-10-01' } };
    const res = { send: jest.fn() };

    await addItem(req, res);
    expect(db.storeItem).toHaveBeenCalledWith(
        expect.objectContaining({ due_date: '2026-10-01' })
    );
});

test('it stores null due_date when value is invalid', async () => {
    const req = { body: { name: NAME, due_date: 'not-a-date' } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    expect(db.storeItem).toHaveBeenCalledWith(
        expect.objectContaining({ due_date: null }),
    );
});

import Thinker from '../../'
import utils from '../../utils'
import MemoryLogger from '../../memory_logger'
import MemoryStorage from '../../memory_storage'

const collectionTypeRequestItems = {
  todo1: { id: 'todo1' },
  todo2: { id: 'todo2' },
}
const collectionTypeLocalItems = {
  todo2: { id: 'todo2' },
  todo4: { id: 'todo4' },
}
const collectionTypeServerItems = {
  todo2: { id: 'todo2' },
  todo3: { id: 'todo3' },
}
const collectionTypeItemIds = ['todo1', 'todo2', 'todo3']

const singletonTypeRequestItems = { updated_at: 1 }
const singletonTypeLocalItems = { updated_at: 3 }
const singletonTypeServerItems = { updated_at: 2 }
const singletonTypeItemIds = []

describe('#_deserializeItem', () => {
  let thinker
  let deserializeItem, deserializeItemCBs

  beforeEach(() => {
    deserializeItemCBs = []
    deserializeItem = jest.fn((
      syncInfo,
      objectType,
      objectAction,
      requestItem,
      localItem,
      serverItem,
      callback,
    ) => {
      deserializeItemCBs.push(callback)
    })

    thinker = new Thinker({
      storage: new MemoryStorage,
      logger: new MemoryLogger,
      deserializeItem,
    })

    thinker._decideAction = jest.fn((requestItem, localItem, serverItem, isServerSaveFailed) => {
      const existedItem = serverItem || localItem || requestItem
      switch(existedItem.id) {
        case 'todo1': return 'keepDirty'
        case 'todo2': return 'update'
        case 'todo3': return 'keepDirty'
        case 'todo_order': return 'new'
        default: return 'keepDirty'
      }
    })
  })

  it('decide action and call initOption.deserializeItem for every collection type record', () => {
    const fakeSyncInfo = {}
    const fakeResp = {data: {}}
    const promiseCallback = jest.fn()
    thinker._deserializeItem(
      fakeSyncInfo,
      'todos',
      collectionTypeItemIds,
      collectionTypeRequestItems,
      collectionTypeLocalItems,
      collectionTypeServerItems,
      fakeResp,
    ).then(promiseCallback, promiseCallback)
    expect(thinker._decideAction).toHaveBeenCalledTimes(3)
    expect(thinker._decideAction).toHaveBeenCalledWith({id: 'todo1'}, undefined, undefined, false)
    expect(thinker._decideAction).toHaveBeenCalledWith({id: 'todo2'}, {id: 'todo2'}, {id: 'todo2'}, false)
    expect(thinker._decideAction).toHaveBeenCalledWith(undefined, undefined, {id: 'todo3'}, false)
    expect(deserializeItem).toHaveBeenCalledTimes(3)
    expect(deserializeItem).toHaveBeenCalledWith(fakeSyncInfo, 'todos', 'keepDirty', {id: 'todo1'}, undefined, undefined, expect.any(Function))
    expect(deserializeItem).toHaveBeenCalledWith(fakeSyncInfo, 'todos', 'update', {id: 'todo2'}, {id: 'todo2'}, {id: 'todo2'}, expect.any(Function))
    expect(deserializeItem).toHaveBeenCalledWith(fakeSyncInfo, 'todos', 'keepDirty', undefined, undefined, {id: 'todo3'}, expect.any(Function))
    deserializeItemCBs[0](null, {id: 'todo1', name: 'name1'})
    deserializeItemCBs[1](null, {id: 'todo2', name: 'name2'})
    deserializeItemCBs[2](null, {id: 'todo3', name: 'name3'})
    expect(promiseCallback).toHaveBeenCalledWith({
      keepDirty: {
        todo1: {id: 'todo1', name: 'name1'},
        todo3: {id: 'todo3', name: 'name3'},
      },
      update: {
        todo2: {id: 'todo2', name: 'name2'},
      },
    })
  })

  it('decide action and call initOption.deserializeItem for every singleton type record', () => {
    const fakeSyncInfo = {}
    const fakeResp = {data: {}}
    const promiseCallback = jest.fn()
    thinker._deserializeItem(
      fakeSyncInfo,
      'todo_order',
      singletonTypeItemIds,
      singletonTypeRequestItems,
      singletonTypeLocalItems,
      singletonTypeServerItems,
      fakeResp,
    ).then(promiseCallback, promiseCallback)
    expect(thinker._decideAction).toHaveBeenCalledTimes(1)
    expect(thinker._decideAction).toHaveBeenCalledWith({updated_at: 1}, {updated_at: 3}, {updated_at: 2}, false)
    expect(deserializeItem).toHaveBeenCalledTimes(1)
    expect(deserializeItem).toHaveBeenCalledWith(fakeSyncInfo, 'todo_order', 'keepDirty', {updated_at: 1}, {updated_at: 3}, {updated_at: 2}, expect.any(Function))
    deserializeItemCBs[0](null, {updated_at: 3, todo_ids: [1, 2]})
    expect(promiseCallback).toHaveBeenCalledWith({keepDirty: {updated_at: 3, todo_ids: [1, 2]}})
  })

  it('can handle error', () => {
    const fakeSyncInfo = {}
    const fakeResp = {data: {}}
    const fakeError = new Error
    const promiseCallback1 = jest.fn()
    const promiseCallback2 = jest.fn()

    thinker._deserializeItem(
      fakeSyncInfo,
      'todo_order',
      singletonTypeItemIds,
      singletonTypeRequestItems,
      singletonTypeLocalItems,
      singletonTypeServerItems,
      fakeResp,
    ).then(promiseCallback1, promiseCallback1)
    deserializeItemCBs[0](fakeError)
    expect(promiseCallback1).toBeCalledWith(fakeError)

    thinker._deserializeItem(
      fakeSyncInfo,
      'todos',
      collectionTypeItemIds,
      collectionTypeRequestItems,
      collectionTypeLocalItems,
      collectionTypeServerItems,
      fakeResp,
    ).then(promiseCallback2, promiseCallback2)
    deserializeItemCBs[2](fakeError)
    expect(promiseCallback2).toBeCalledWith(fakeError)
  })

  it('can handle `resp.data.failures` field', () => {
    const fakeSyncInfo = {}
    const fakeResp = {
      data: {
        failures: ['todo_order', 'pomos', 'todos:todo1'],
      },
    }
    const promiseCallback1 = jest.fn()
    const promiseCallback2 = jest.fn()
    const promiseCallback3 = jest.fn()

    thinker._deserializeItem(
      fakeSyncInfo,
      'todo_order',
      singletonTypeItemIds,
      singletonTypeRequestItems,
      singletonTypeLocalItems,
      singletonTypeServerItems,
      fakeResp,
    ).then(promiseCallback1, promiseCallback1)
    expect(thinker._decideAction).toHaveBeenCalledTimes(1)
    expect(thinker._decideAction).toHaveBeenCalledWith({updated_at: 1}, {updated_at: 3}, {updated_at: 2}, true)
    expect(deserializeItem).toHaveBeenCalledTimes(1)
    expect(deserializeItem).toHaveBeenCalledWith(fakeSyncInfo, 'todo_order', 'keepDirty', {updated_at: 1}, {updated_at: 3}, {updated_at: 2}, expect.any(Function))
    deserializeItemCBs[0](null, {updated_at: 3, todo_ids: [1, 2]})
    expect(promiseCallback1).toHaveBeenCalledWith({keepDirty: {updated_at: 3, todo_ids: [1, 2]}})

    thinker._deserializeItem(
      fakeSyncInfo,
      'todos',
      collectionTypeItemIds,
      collectionTypeRequestItems,
      collectionTypeLocalItems,
      collectionTypeServerItems,
      fakeResp,
    ).then(promiseCallback2, promiseCallback2)
    expect(thinker._decideAction).toHaveBeenCalledTimes(4)
    expect(thinker._decideAction).toHaveBeenCalledWith({id: 'todo1'}, undefined, undefined, true)
    expect(thinker._decideAction).toHaveBeenCalledWith({id: 'todo2'}, {id: 'todo2'}, {id: 'todo2'}, false)
    expect(thinker._decideAction).toHaveBeenCalledWith(undefined, undefined, {id: 'todo3'}, false)
    expect(deserializeItem).toHaveBeenCalledTimes(4)
    expect(deserializeItem).toHaveBeenCalledWith(fakeSyncInfo, 'todos', 'update', {id: 'todo2'}, {id: 'todo2'}, {id: 'todo2'}, expect.any(Function))
    expect(deserializeItem).toHaveBeenCalledWith(fakeSyncInfo, 'todos', 'keepDirty', undefined, undefined, {id: 'todo3'}, expect.any(Function))
    deserializeItemCBs[1](null, {id: 'todo1', name: 'name1'})
    deserializeItemCBs[2](null, {id: 'todo2', name: 'name2'})
    deserializeItemCBs[3](null, {id: 'todo3', name: 'name3'})
    expect(promiseCallback2).toHaveBeenCalledWith({
      update: {todo2: {id: 'todo2', name: 'name2'}},
      keepDirty: {
        todo1: {id: 'todo1', name: 'name1'},
        todo3: {id: 'todo3', name: 'name3'},
      },
    })

    thinker._deserializeItem(
      fakeSyncInfo,
      'pomos',
      ['pomo1', 'pomo2'],
      {pomo1: {id: 'pomo1'}, pomo2: {id: 'pomo2'}},
      {pomo1: {id: 'pomo1', desc: 'desc1'}, pomo2: {id: 'pomo2', desc: 'desc2'}},
      {},
      fakeResp,
    ).then(promiseCallback3, promiseCallback3)
    expect(thinker._decideAction).toHaveBeenCalledTimes(4)
    expect(deserializeItem).toHaveBeenCalledTimes(4)
    expect(promiseCallback3).toHaveBeenCalledWith({
      keepDirty: {
        pomo1: {id: 'pomo1', desc: 'desc1'},
        pomo2: {id: 'pomo2', desc: 'desc2'},
      },
    })
  })
})

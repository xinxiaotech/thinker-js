import moment from 'moment'
import utils from '../../utils'
import Thinker from '../../'
import { FakeLogger, FakeStorage } from '../../../test_helpers'

const resp = {
  config: {
    data: {
      objects: {
        todos: {
          todo1: { id: 'todo1' },
          todo2: { id: 'todo2' },
        },
        pomos: {
          pomo1: { id: 'pomo1' },
          pomo2: { id: 'pomo2' },
        },
        todo_order: {},
      },
    },
  },
  data: {
    objects: {
      todos: {
        todo2: { id: 'todo2' },
        todo3: { id: 'todo3' },
      },
      pomos: {},
      todo_order: {},
    },
  },
}

describe('#_updateLocalData', () => {
  let thinker, fakeStorage, fakeLogger
  let getItems, getItemsCB
  let updateLocalData, updateLocalDataCB
  let deserializeItemDefers

  beforeEach(() => {
    fakeStorage = new FakeStorage
    fakeLogger = new FakeLogger
    getItems = jest.fn((syncInfo, ids, cb) => { getItemsCB = cb })
    updateLocalData = jest.fn((syncInfo, data, cb) => { updateLocalDataCB = cb })
    thinker = new Thinker({
      storage: fakeStorage,
      logger: fakeLogger,
      getItems,
      updateLocalData,
    })
    deserializeItemDefers = []
    thinker._deserializeItem = jest.fn(() => {
      const deserializeItemDefer = utils.pending()
      deserializeItemDefers.push(deserializeItemDefer)
      return deserializeItemDefer.promise
    })
    thinker._decideAction = jest.fn((serverItem, localItem, requestItem, isServerSaveFailed) => {
      switch(localItem.id) {
        case 'todo1': return 'cleanDirty'
        case 'todo2': return 'new'
        case 'pomo1': return 'update'
        default: return 'doNothing'
      }
    })
  })

  it('query related datas', () => {
    const syncInfo = {}
    const fakeError = new Error
    const promiseCallback = jest.fn()

    thinker._updateLocalData(syncInfo, resp).then(null, promiseCallback)
    expect(getItems).toBeCalledWith(syncInfo, {
      todos: ['todo1', 'todo2', 'todo3'],
      pomos: ['pomo1', 'pomo2'],
      todo_order: [],
    }, expect.any(Function))
    getItemsCB(fakeError)
    expect(promiseCallback).toBeCalledWith(fakeError)
  })

  it('call #_deserializeItem for every type', () => {
    const syncInfo = {}
    const fakeError = new Error
    const promiseCallback = jest.fn()
    const localItems = {
      todos: {todo1: {}, todo2: {}, todo3: {}},
      pomos: {pomo1: {}, pomo2: {}},
      todo_order: {},
    }

    thinker._updateLocalData(syncInfo, resp).then(null, promiseCallback)
    getItemsCB(null, localItems)
    expect(thinker._deserializeItem.mock.calls).toHaveLength(3)
    expect(thinker._deserializeItem.mock.calls).toContainEqual([syncInfo, 'todos', ['todo1', 'todo2', 'todo3'], resp.config.data.objects.todos, localItems.todos, resp.data.objects.todos, resp])
    deserializeItemDefers[0].resolve()
    expect(thinker._deserializeItem.mock.calls).toContainEqual([syncInfo, 'pomos', ['pomo1', 'pomo2'], resp.config.data.objects.pomos, localItems.pomos, resp.data.objects.pomos, resp])
    deserializeItemDefers[1].reject(fakeError)
    expect(thinker._deserializeItem.mock.calls).toContainEqual([syncInfo, 'todo_order', [], resp.config.data.objects.todo_order, localItems.todo_order, resp.data.objects.todo_order, resp])
    deserializeItemDefers[2].resolve()
    expect(promiseCallback).toBeCalledWith(fakeError)
  })

  it('pass deserialized items to initOption.updateLocalData', () => {
    const syncInfo = {}
    const promiseCallback = jest.fn()
    thinker._updateLocalData(syncInfo, resp).then(null, promiseCallback)
    getItemsCB(null, {})
    deserializeItemDefers[0].resolve({keepDirty: {}, new: {todo1: {}}})
    deserializeItemDefers[1].resolve({})
    deserializeItemDefers[2].resolve({update: {updated_at: moment().format()}})
    expect(updateLocalData).toBeCalledWith(syncInfo, {
      todos: {new: {todo1: {}}},
      todo_order: {update: {updated_at: moment().format()}},
    }, expect.any(Function))
  })
})

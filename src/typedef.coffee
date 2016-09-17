###*
# @namespace
# @name ThinkerType
###

###*
# @callback ThinkerType~NodeLikeCallback
# @param {?Error} err 错误信息
# @param {?Object} [data] 数据
###

###*
# @typedef {Object} ThinkerType~SyncInfo
# @property {Boolean} isFirstTime - 是否是第一次进行同步
# @property {Thinker~SyncOption[]} passInOptions - 被合并到本轮同步里的调用 `do()` 时传入所有设置的数组
###

###*
# @typedef {Object} ThinkerType~SyncOption
# @property {Boolean} syncAllData - 是否进行完整同步
###

###*
# @typedef {Object} ThinkerType~RequestInfo
# @property {String} url - 请求的地址
# @property {String} method - 请求的 HTTP 方法
# @property {?Object} headers - 请求头
# @property {?Object} params - 请求的 URL 参数
# @property {?Object} data - 请求体
###

###*
# @typedef {Object} ThinkerType~ResponseInfo
# @property {ThinkerType~RequestInfo} config - 发起请求时的设置
# @property {Number} status - 服务器响应的状态码
# @property {Object} headers - 服务器响应的 HTTP 头
# @property {Object} data - 服务器响应的数据
###

###*
# @typedef {String} ThinkerType~ObjectId - 物件的 id ，目前应该是 UUID
###

###*
# @typedef {String} ThinkerType~ObjectType - 和 response.objects 的 key 一样的字符串
###

###*
# @typedef {Object} ThinkerType~ObjectIdSet - 和 response.objects 相似结构的用于存储 id 的字典
# @example
# {
#   "pomos": ["uuiduuid-uuid-uuid-uuid-uuiduuiduuid", "uuiduuid-uuid-uuid-uuid-uuiduuiduuid", ...],
#   "todos": ["uuiduuid-uuid-uuid-uuid-uuiduuiduuid", "uuiduuid-uuid-uuid-uuid-uuiduuiduuid", ...],
#   "sub_todos": ["uuiduuid-uuid-uuid-uuid-uuiduuiduuid", "uuiduuid-uuid-uuid-uuid-uuiduuiduuid", ...],
#   "preferences": ["use_notification", "goal_month"],
#   "todo_order": []
# }
###

###*
# @typedef {Object} ThinkerType~ObjectSet - 和 response.objects 一样结构的字典
# @example
# {
#   "pomos": {
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     ...
#   },
#   "todos": {
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     ...
#   },
#   "sub_todos": {
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     ...
#   },
#   "preferences": {
#     "use_notification": {...},
#     "goal_month": {...}
#   },
#   "todo_order": {
#     "updated_at": "...",
#     "order": [...]
#   }
# }
###

###*
# @typedef {Object} ThinkerType~GroupedObjectSet - 和 response.objects 相似结构的用于表示数据应该怎么处理的字典
# @example
# {
#   "pomos": {
#     "keepDirty": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "cleanDirty": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "update": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "new": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#   },
#   "todos": {
#     "keepDirty": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "cleanDirty": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "update": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "new": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#   },
#   "sub_todos": {
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#     ...
#     "keepDirty": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "cleanDirty": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "update": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#     "new": {
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       "uuiduuid-uuid-uuid-uuid-uuiduuiduuid": {...},
#       ...
#     },
#   },
#   "preferences": {
#     "keepDirty": {
#       "use_notification": {...},
#       "goal_month": {...}
#       ...
#     },
#     "cleanDirty": {
#       "use_notification": {...},
#       "goal_month": {...}
#       ...
#     },
#     "update": {
#       "use_notification": {...},
#       "goal_month": {...}
#       ...
#     },
#     "new": {
#       "use_notification": {...},
#       "goal_month": {...}
#       ...
#     },
#   },
#   "todo_order": {
#     "keepDirty": {
#       "updated_at": "...",
#       "order": [...]
#     },
#     "cleanDirty": {
#       "updated_at": "...",
#       "order": [...]
#     },
#     "update": {
#       "updated_at": "...",
#       "order": [...]
#     },
#     "new": {
#       "updated_at": "...",
#       "order": [...]
#     },
#   }
# }
###

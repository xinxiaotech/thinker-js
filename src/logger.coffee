
### @interface ###
module.exports = class Logger
  ###*
  # 打印普通日志
  #
  # @param {...*} message
  ###
  log: (message...) ->
    console.log(message...)

  ###*
  # 打印错误日志
  #
  # @param {...*} message
  ###
  error: (message...) ->
    console.error(message...)

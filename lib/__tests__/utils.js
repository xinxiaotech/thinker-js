import utils from '../utils'

describe('utils', () => {
  describe('.delayRetry', () => {
    it('pending')
  })

  describe('.parseValidDate', () => {
    it('support native Date instance', () => {
      const date = new Date
      expect(utils.parseValidDate(date)).toBe(date)
    })

    it('support stringified Integer', () => {
      expect(utils.parseValidDate('112233')).toEqual(new Date(112233))
    })

    it('support Date constructor supported formats', () => {
      expect(utils.parseValidDate('Mon Feb 13 2017 12:46:30 GMT+0800 (CST)'))
        .toEqual(new Date('Mon Feb 13 2017 12:46:30 GMT+0800 (CST)'))
    })

    it('return null if input not valid', () => {
      expect(utils.parseValidDate('not valid datetime')).toBe(null)
    })
  })
})

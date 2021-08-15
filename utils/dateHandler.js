//处理时间的函数
const dayjs = require('dayjs')

const dateHandler = function(DATE) {
    return dayjs(DATE).format('YYYY-MM-DD')
}

exports.dateHandler=dateHandler